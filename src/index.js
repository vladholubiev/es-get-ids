import elasticsearch from 'elasticsearch';
import ElasticsearchScrollStream from 'elasticsearch-scroll-stream';
import es from 'event-stream';
import JSONStream from 'JSONStream';

/**
 * Get ids of documents from Elasticsearch by query
 * @param {String} esURL URL for ES connection
 * @param {String} [index] ES index name
 * @param {String} [type] Mapping type name
 * @param {String} [scroll=10s] Scroll time unit
 * @param {Number} [size=1000] Number of ids to fetch in 1 request
 * @param {Object} [body] Query body to filter documents
 * @returns {Promise.<String[]>} Array of ids
 */
export default function getIds(esURL, {index, type, scroll = '10s', size = 5000, body = {}} = {}) {
  const ESClient = new elasticsearch.Client({host: esURL});
  const ESStream = new ElasticsearchScrollStream(ESClient, {
    scroll,
    size,
    index,
    type,
    body,
    _source: ['_id']
  }, ['_id']);

  const ids = [];

  return new Promise((resolve, reject) => {
    ESStream
      .on('end', () => resolve(ids))
      .on('error', reject)
      .pipe(es.mapSync(data => data.toString()))
      .pipe(JSONStream.parse())
      .pipe(es.mapSync(data => {
        ids.push(data._id);
      }));
  });
}

module.exports = getIds;

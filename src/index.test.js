import getIds from '.';
import nock from 'nock';

const ES_URL = 'http://localhost:9200';

beforeEach(() => {
  nock.cleanAll();
});

it('should export a function', () => {
  expect(getIds).toBeInstanceOf(Function);
});

it('should return document ids from elasticsearch', async () => {
  nock(ES_URL)
    .post('/_search?scroll=10s&size=5000&_source=_id')
    .reply(200, {
      hits: {
        total: 4,
        hits: [
          {_index: 'i-1', _type: 'all', _id: 'id-1', _source: {}},
          {_index: 'i-1', _type: 'all', _id: 'id-2', _source: {}}
        ]
      }
    })
    .post('/_search/scroll?scroll=10s')
    .reply(200, {
      hits: {
        total: 4,
        hits: [
          {_index: 'i-3', _type: 'all', _id: 'id-3', _source: {}},
          {_index: 'i-4', _type: 'all', _id: 'id-4', _source: {}}
        ]
      }
    });

  const ids = await getIds(ES_URL);

  expect(ids).toEqual(['id-1', 'id-2', 'id-3', 'id-4']);
});

it('should pass request body to ES', async () => {
  nock(ES_URL)
    .post('/_search?scroll=10s&size=5000&_source=_id', body => {
      expect(body).toEqual({query: {term: {a: 1}}});
      return true;
    })
    .reply(200, {
      hits: {
        total: 4,
        hits: [
          {_index: 'i-1', _type: 'all', _id: 'id-1', _source: {}},
          {_index: 'i-1', _type: 'all', _id: 'id-2', _source: {}}
        ]
      }
    })
    .post('/_search/scroll?scroll=10s')
    .reply(200, {
      hits: {
        total: 4,
        hits: [
          {_index: 'i-3', _type: 'all', _id: 'id-3', _source: {}},
          {_index: 'i-4', _type: 'all', _id: 'id-4', _source: {}}
        ]
      }
    });

  await getIds(ES_URL, {body: {query: {term: {a: 1}}}});
});

it('should respect changing scroll size', async () => {
  nock(ES_URL)
    .post('/_search?scroll=10s&size=100&_source=_id')
    .reply(200, {
      hits: {
        total: 4,
        hits: [
          {_index: 'i-1', _type: 'all', _id: 'id-1', _source: {}},
          {_index: 'i-1', _type: 'all', _id: 'id-2', _source: {}}
        ]
      }
    })
    .post('/_search/scroll?scroll=10s')
    .reply(200, {
      hits: {
        total: 4,
        hits: [
          {_index: 'i-3', _type: 'all', _id: 'id-3', _source: {}},
          {_index: 'i-4', _type: 'all', _id: 'id-4', _source: {}}
        ]
      }
    });

  await getIds(ES_URL, {size: 100});
});

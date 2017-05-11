# Elasticsearch Get Ids

> Get all ids from Elasticsearch

Uses [Scroll API](https://www.elastic.co/guide/en/elasticsearch/reference/current/search-request-scroll.html)
to overcome a result window limit of 10 000.

## Install

```shell
$ yarn add es-get-ids
```

## Usage

```javascript
import getIds from 'es-get-ids';
await getIds(ES_URL); // 1, 2, 3, 4

// Options
await getIds(ES_URL, {index, type, scroll = '10s', size = 5000, body = {}});

// body can be whatever
```

const { Client } = require('@elastic/elasticsearch');
const elastic = new Client({ node: 'http://103.20.96.114:9200' });
// const elastic = new Client({ node: 'http://localhost:9200' });

module.exports = elastic;

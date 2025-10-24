const { Client } = require('@elastic/elasticsearch');
const elastic = new Client({ node: 'https://tiktokk.website:9200' });

module.exports = elastic;

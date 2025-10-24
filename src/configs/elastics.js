const { Client } = require('@elastic/elasticsearch');
const elastic = new Client({
  node: 'https://elastic.tiktokk.website',
});

module.exports = elastic;

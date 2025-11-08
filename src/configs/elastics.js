const { Client } = require('@elastic/elasticsearch');
const elastic = new Client({
  node: process.env.ELASTIC_URL,
  auth: {
    username: 'elastic',
    password: process.env.ELASTIC_PASSWORD,
  },
});

module.exports = elastic;

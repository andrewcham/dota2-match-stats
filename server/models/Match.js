var mongojs = require('mongojs');
var localName = 'Match';
var productionName = 'mongodb://test:test1@ds031632.mongolab.com:31632/matches'
var collections = ['matches'];

var db = mongojs(productionName, collections);
db.matches.createIndex({match_id: 1}, {unique: true});

module.exports = db;
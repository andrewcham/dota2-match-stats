var mongojs = require('mongojs');
var name = 'Match';
var collections = ['matches'];

var db = mongojs(name, collections);
db.matches.createIndex({match_id: 1}, {unique: true});

module.exports = db;
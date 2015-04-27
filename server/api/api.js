var key = require('./key');
var request = require('request');

var matchURL = 'https://api.steampowered.com/IDOTA2Match_570/GetMatchDetails/V001/';
var playerURL = 'http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/';

/**
  * Calls DOTA 2 API to get match data
  *
  * Params:
  *   match_id - Match ID to be queried
  *	  cb - callback data from the query, in JSON form
  */
var getMatch = function (id, cb) {
	request({
		url: matchURL,
		method: 'GET',
		qs: {'key': key, 'match_id': id}
	}, function (err, res, body){
		if (err) { throw err; }
		if (res.statusCode != 200) { throw new Error('Not a valid match'); }
		cb(JSON.parse(body).result);
	});
};

/**
  * Calls DOTA 2 API to get player summaries
  *
  * Params:
  *   ids - String of comma-separated 64-bit account_ids to be searched
  *	  cb - callback data from the query, in JSON form
  */
var getPlayerSummaries = function(ids, cb) {
	request({
		url: playerURL,
		method: 'GET',
		qs: {'key': key, 'steamids': ids}
	}, function (err, res, body){
		if (err) { throw err; }
		if (res.statusCode != 200) { throw new Error('Not valid IDs'); }
		cb(JSON.parse(body).response.players);
	});
};

module.exports.getMatch = getMatch;
module.exports.getPlayerSummaries = getPlayerSummaries;
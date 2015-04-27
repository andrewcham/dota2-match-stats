var express = require('express');
var router = express.Router();
var mongojs = require('mongojs');
var api = require('../api/api');
var db = require('../models/Match');

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index');
});

/* GET match details */
router.get('/api/matches/:m_id', function(req, res) {
  db.matches.find({
    match_id: Number(req.params.m_id)
  }, function(err, match) {
    if (err) { res.status(500).send(err); }
    else {
      if (match.length === 0) { // If match doesn't exist in DB, call API
        api.getMatch(req.params.m_id, function(match_data) {
          // Perform an insert with the match data retrived from API
          db.matches.insert(match_data, function(err, new_match) {
            if (err) { res.status(500).send(err); }
            else { res.json(new_match); }
          });
        });
      }
      // If match is found in the DB, just return it 
      else { res.json(match); }
    }
  });
});

module.exports = router;

/**
  * Transforms the raw Match JSON data to be more presentable to the client.
  * NOTE: We can't actually store player information because persona name is
  *       not a static variable in the DOTA 2 world: the player can always 
  *       change their name!
  *
  * Params:
  *   matchJSON - Raw match JSON data to be cleaned
  *   cb - callback modified JSON
  */
function transformMatchJSON (matchJSON, cb) {
  var newJSON = matchJSON;


  return newJSON;
}
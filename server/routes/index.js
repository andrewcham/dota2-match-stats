var express = require('express');
var router = express.Router();
var mongojs = require('mongojs');
var api = require('../api/api');
var transform = require('../api/transformation');
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
          if (match_data.error) { // Add the Match ID to API error so we don't need to check them again
            match_data.match_id = Number(req.params.m_id);
          }

          // Perform an insert with the match data retrived from API
          db.matches.insert(match_data, function(err, new_match) {
            if (err) { res.status(500).send(err); }
            else {
              if (match_data.error) { // If the match search errored out, don't bother transforming
                res.json(new_match);
              }
              else {
                transform(new_match, function(new_json) {
                  res.json(new_json);
                }); 
              }
            }
          });
        });
      }
      // If match is found in the DB, just return it 
      else { 
        if (match[0].error) { // If the match ID has an error associated with it, don't bother transforming
          res.json(match[0]);
        }
        else {
          transform(match[0], function(new_json) {
            res.json(new_json);
          }); 
        }
      }
    }
  });
});

module.exports = router;
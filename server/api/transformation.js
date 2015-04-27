var bignum = require('bignum');
var heroes = require('./data/heroes.json');
var items = require('./data/items.json');
var modes = require('./data/modes.json');
var api = require('../api/api');

var bit64converstion = 76561197960265728;
var private32bit = 4294967295;
var item_keys = ['item_0', 'item_1', 'item_2', 'item_3', 'item_4', 'item_5'];

/**
  * Transforms the raw Match JSON data to be more presentable to the client.
  * NOTE: We can't actually store player information because information is
  *       not always static in the DOTA 2 world: the player can always 
  *       change their name!
  *
  * Params:
  *   matchJSON - Raw match JSON data to be cleaned
  *   cb - callback modified JSON
  */
var transformMatchJSON = function (matchJson, cb) {
  var newJson = matchJson;

  // Transform account_ids into player names
  var players = newJson.players;
  var account_ids = '';
  var num_public_accounts = 0;

  for (player = 0; player < players.length; player++) {
    var id = !players[player].account_id ? private32bit : players[player].account_id;
    // If the player has set their profile to be private, don't search
    if (id !== private32bit) {
      account_ids += bignum(id).add(bit64converstion).toString() + ',';
      num_public_accounts += 1;
    }
  }

  // Change information in the copy of the JSON to be returned
  api.getPlayerSummaries(account_ids, function(player_data) {
    // Place 32-bit IDs (keys) and persona names (values) into a dict-like JSON
    var persona_names = {};

    for (player = 0; player < num_public_accounts; player++) {
      var summary = player_data[player];
      persona_names[bignum(summary.steamid).sub(bit64converstion).toString()] = summary.personaname;
    }

    for (player = 0; player < newJson.players.length; player++) {
      // Change account_id value to the player's persona
      if (newJson.players[player].account_id === private32bit) {
        newJson.players[player].account_id = 'Anonymous';
      }
      else if (!newJson.players[player].account_id) {
        newJson.players[player].account_id = 'Bot';
      }
      else {
        var a_id = newJson.players[player].account_id;
        newJson.players[player].account_id = persona_names[a_id];
      }

      // Change item numbers to names
      for (item = 0; item < item_keys.length; item++) {
        var item_key = newJson.players[player][item_keys[item]];
        newJson.players[player][item_keys[item]] = items[item_key];
      }

      // Change hero_id field to hero name
      var h_id = newJson.players[player].hero_id;
      newJson.players[player].hero_id = heroes[h_id];
    }

    // Separate the players into Radiant and Dire (they keep order in the JSON)
    var teams = {};
    teams.radiant = newJson.players.slice(0, 5);
    teams.dire = newJson.players.slice(5, 10);
    newJson.players = teams;

    // Transform start_time field from UNIX to a readable time
    newJson.start_time = unixConverter(Number(newJson.start_time));

    // Transform duration field from seconds to readable time
    newJson.duration = secondsConverter(Number(newJson.duration));

    // Transform game_mode integer to a string describing the mode
    newJson.game_mode = modes[newJson.game_mode];
    
    // Place changed JSON into the callback
    cb(newJson);
  }); 
};

module.exports = transformMatchJSON;

/* HELPERS */

 /**
  * Changes UNIX timestamp to a regular format
  *
  * Params:
  *   unix - The time in UNIX to be converted.
  *
  * Returns:
  *   The date and time in a proper format (date/month/year hour:min:sec)
  */
function unixConverter(unix) {
  var a = new Date(unix * 1000);
  var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  var year = a.getFullYear();
  var month = months[a.getMonth()];
  var date = a.getDate() < 10 ? '0' + a.getDate() : a.getDate();
  var hour = a.getHours() < 10 ? '0' + a.getHours() : a.getHours(); 
  var min = a.getMinutes() < 10 ? '0' + a.getMinutes() : a.getMinutes(); 
  var sec = a.getSeconds() < 10 ? '0' + a.getSeconds() : a.getSeconds();
  return date + '/' + month + '/' + year + ' ' + hour + ':' + min + ':' + sec;  
}

 /**
  * Changes seconds to a regular format
  *
  * Params:
  *   unix - The time in UNIX to be converted.
  *
  * Returns:
  *   The date and time in a proper format (mins:sec)
  */
function secondsConverter(seconds) {
  var min = Math.floor(seconds / 60) < 10 ? '0' + Math.floor(seconds / 60) : Math.floor(seconds / 60);
  var sec = seconds % 60 < 10 ? '0' + seconds % 60 : seconds % 60;
  return min + ':' + sec;
}
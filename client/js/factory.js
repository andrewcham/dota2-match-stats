matchApp.factory('matchesFactory', function($http) {
  var urlBase = '/api/matches/';
  var _matchService = {};

  /**
  * Calls route API to get match details of a certain match ID.
  *
  * Params:
  *   match_id - Match ID to be queried
  */
  _matchService.getMatch = function(match_id) {
    return $http.get(urlBase + match_id);
  };
 
  return _matchService;
});
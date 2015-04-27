matchApp.controller('MatchCtrl', function($scope, matchesFactory) {
  // Initially set match to be empty
  $scope.match = '';
 
 /**
  * Accesses the match service and assigns the match ID specified to the scope
  *
  * Params:
  *   $event - an event that triggers the function
  */
  $scope.getMatch = function($event) {
    if ($scope.matchInput) {
      matchesFactory.getMatch(
        $scope.matchInput
      ).then(function(data) {
        /* Route returns list of matches, but since we're only looking at
           one match at a time, just put the first element in the scope */
        $scope.match = data.data[0];
      });
      // Blank the input
      $scope.matchInput = '';
    }
  };
});
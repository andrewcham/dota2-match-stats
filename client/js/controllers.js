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
        console.log(data.data);
        $scope.match = data.data;
      });
      // Blank the input
      $scope.matchInput = '';
    }
  };
});
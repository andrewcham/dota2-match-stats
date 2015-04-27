matchApp = angular.module('matchApp', ['ngRoute'])
  .config(function($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: '/partials/match.html',
        controller: 'MatchCtrl'
      }).otherwise({
        redirectTo: '/'
      });
  });
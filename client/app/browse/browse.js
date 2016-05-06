angular.module('fickle.browse', [])
.controller('browseController', function (Browse,$scope, $http, $location, $window , Auth) {
    Browse.getPopularPodcasts()
    .then(function (data) {
      $scope.browseResults = data;
    });
});
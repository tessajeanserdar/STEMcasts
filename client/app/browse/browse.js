angular.module('fickle.browse', [])
.controller('browseController', function (Browse,$scope, $http, $location, $window,Show) {
   $scope.loaded = false;
    Browse.getPopularPodcasts()
    .then(function (data) {
      $scope.loaded = true;
      $scope.browseResults = data;
    });
    $scope.getShow = function(show){
      Show.setShow(show)
    }
})

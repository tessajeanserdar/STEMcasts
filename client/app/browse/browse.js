angular.module('fickle.browse', [])
.controller('browseController', function (Browse,$scope, $http, $location, $window,Show) {  
    Browse.getPopularPodcasts()
    .then(function (data) {
      $scope.browseResults = data;
    });

    $scope.getShow = function(show){
      Show.setShow(show)
    }

 
});
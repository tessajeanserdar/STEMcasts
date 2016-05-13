angular.module('fickle.browse', [])
.controller('browseController', function (Browse,$scope, $http, $location, $window,Show) {
    Browse.getPopularPodcasts()
    .then(function (data) {
      $scope.browseResults = data;
    });

    $scope.getShow = function(show){
      Show.setShow(show)
    }

   $scope.displayName = function(showName){
    if(showName.length > 20) 
      showName = showName.substring(0,10);
      showName = showName.concat('...');
      return showName;
   }
 
});
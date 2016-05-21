angular.module('fickle.show',[])
.controller('showController',function($scope,$window,Show){
  $scope.loaded = false; 
  Show.getShowsEpisodes()
    .then(function (data){
      $scope.loaded = true; 
      $scope.results = data;
      $scope.songs = data.episodeDetails;
  })
})

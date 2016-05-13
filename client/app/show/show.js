angular.module('fickle.show',[])
.controller('showController',function($scope,$window,Show){
  Show.getShowsEpisodes()
  .then(function (data){
    $scope.results = data;
    $scope.songs = data.episodeDetails;
  })
})

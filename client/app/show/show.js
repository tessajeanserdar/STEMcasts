angular.module('fickle.show',[])
.controller('showController',function($scope,$window,Show){
  $scope.loaded = false; 
  Show.getShowsEpisodes()
    .then(function (data){
      $scope.loaded = true; 
      $scope.results = data;
      $scope.songs = data.episodeDetails;
  })
  $scope.orderByDate = function(item) {
      var parts = item.dateString.split('-');
      var date = new Date(parseInt(parts[2]), 
                          parseInt(parts[1]), 
                          parseInt(parts[0])
                          );

      return date;
  };
})

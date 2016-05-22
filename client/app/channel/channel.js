angular.module('fickle.channel',[])
.controller('channelController',function ($scope,Podcasts) {
    $scope.loaded = false;
    Podcasts.getTags()
    .then(function (data){
      $scope.loaded = true;
      $scope.podcastTags = data;
    })
  
  $scope.getPodcastsForTag = function(tag){
      Podcasts.setTags(tag,"channel");
  };




})
angular.module('fickle.channel',[])
.controller('channelController',function ($scope,Podcasts) {
  
  function init() {
    Podcasts.getTags()
    .then(function (data){
      $scope.podcastTags = data;
    })
  }

  $scope.getPodcastsForTag = function(tag){
      Podcasts.setTags(tag,"channel");
  };

  init();



})
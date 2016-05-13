angular.module('fickle.channel',[])
.controller('channelController',function ($scope,Podcasts) {
  
  function init() {
    Podcasts.getTags()
    .then(function (data){
      console.log("we have the channels ",data)
      $scope.podcastTags = data;
    })
  }

  $scope.getPodcastsForTag = function(tag){
      Podcasts.setTags(tag,"channel");
  };

  init();



})
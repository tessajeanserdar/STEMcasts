angular.module('fickle.player',[])
.controller('playerController', function($scope,Podcasts,UserResources,audio,$window) {
    var user = JSON.parse(window.localStorage.getItem('com.fickle'));
    if(user){
      var username = user.username;
    }
    $scope.loaded = false;
    $scope.currentSong;
    var audioElement = document.querySelector('.audioPlayer');
    $scope.initPlay = function () {
      audioElement.play();
    }
    $scope.stopPlay = function() {
       var oldSrc = audioElement.src;
       audioElement.src = "";
    }
    $scope.moveToNext = function () {
      next()
    }
    function next () {
       $scope.currentSong = $scope.songs.pop()
       audio.playNext($scope.currentSong)
    }
    Podcasts.getPodcasts(username).then(function (data){
      $scope.loaded = true;
      $scope.songs = data;
      $scope.currentSong = $scope.songs.pop();
      audioElement.addEventListener('ended', next);
    })

})

//   $scope.selected = [];
//   $scope.results = [];

//   var user = JSON.parse(window.localStorage.getItem('com.fickle'));
//   var username = user.username;
//     // function getPods (){
//     //   var queue = JSON.parse($window.localStorage.getItem('podcastQueue'));
//     //   if(queue === null || !queue.length > 0 || $window.localStorage.getItem('search')) {

//       //     $scope.results = data[0];
//       //     data.shift()
//       //     $window.localStorage.setItem('podcastQueue', JSON.stringify(data));
//       //     $window.localStorage.removeItem('search');
//       //   });  
//       // } else if (queue.length > 0) {
//       //   $scope.results = queue[0];
//       //   $window.localStorage.removeItem('podcastQueue');
//       //   queue.shift();
//       //   $window.localStorage.setItem('podcastQueue', JSON.stringify(queue))
//       // }
//     })
    
//     // getPods();

//   $scope.parseDate = function(episode){
//     return Date.parse(episode.pubDate);
//   };

//   $scope.next = function () {
//     getPods();
//   };



//   $scope.likeResource = function(resource){
//     var userpref = {
//       'username' : username,
//       'ResourceName' : resource
//     }
//     UserResources.likeResource(userpref)
//     .then(function(message){
//       if(message ===200){
//         console.log("You have liked this")
//         return false;
//       }
//     })
//     .catch(function (error) {
//       console.error(error);
//     });
//   };
  

//   $scope.markAsSeen = function(resource){
//     var currentDate = new Date().toJSON().slice(0,10)
//     var userHasSeen = {
//       'username' : username,
//       'ResourceName' : resource,
//       'currentDate' : currentDate
//     }
//     UserResources.markAsSeen(userHasSeen)
//     .then(function(message){
//       if(message ===200){
//         console.log("updated DB that user has seen this")
//       }
//     })
//     .catch(function (error) {
//       console.error(error);
//     });
//   }
// })
.filter("trustUrl", ['$sce', function ($sce) {
        return function (recordingUrl) {
            return $sce.trustAsResourceUrl(recordingUrl);
        };
}]);
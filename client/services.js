angular.module('fickle.services', [])
.factory('Auth', function ($http, $location, $window) {
  var signin = function (user) {
    return $http({
      method: 'POST',
      url: '/signin',
      data: user
    })
    .then(function (resp) {
      console.log("response",resp.data.data)
      return resp.data;
    });
  }
  var signup = function (user) {
    console.log("user in controller",user)
    var user = JSON.stringify(user)
    return $http({
      method: 'POST',
      url: '/signup',
      data: user
    })
    .then(function (resp) {
      return resp.data;
    });
  };
  return {
    signin: signin,
    signup: signup,
  };
})

.factory('Podcasts', function ($http, $location, $window) {
  var resources = [];
  var rec = [];
  var getTags = function () {
    return $http({
      method: 'GET',
      url: '/tags',
    })
    .then(function (resp) {
      console.log(resp)
      return resp.data;
    });
  };
    
  var setTags = function(resource,type) {
    rec = resource;
    queueType = type;
  };

  var getPodcasts = function (user) {
    console.log("user name in getPodcasts service",user)
    var userPref ={
      username : user,
      resource : rec,
      queueType : queueType
      } 

    if(userPref.resource.length === 0){
      userPref.resource = JSON.parse(window.localStorage.getItem('selected'));
    }

    if(userPref.queueType === "explore"){
      return $http({
        method: 'POST',
        url: '/explore',
        data: userPref
      })
      .then(function (resp) {
        console.log(resp)
        return resp.data;
      }); 
    }
    
    if(userPref.queueType === "channel"){
      return $http({
        method: 'POST',
        url: '/channel',
        data: userPref
      })
      .then(function (resp) {
        return resp.data;
      });    
    }
  };

  var GetRec = function (callback) {
    callback(resources, rec);
  }

  var getRec = function (user) {
    return $http({
      method: 'POST',
      url: '/getRec',
      data : user
    })
    .then(function (resp) {
      return resp.data;
    });
  };

  var getPodcastsForChannelQueue = function (tag) {
    return $http({
      method: 'POST',
      url: '/tags',
      data: tag
    })
    .then(function (resp) {
      return resp.status;
    });
  };

  return {
    getTags: getTags,
    getPodcasts: getPodcasts,
    GetRec: GetRec,
    setTags : setTags,
    getRec: getRec,
    getPodcastsForChannelQueue : getPodcastsForChannelQueue
  };
})

.factory('User', function ($http, $location, $window) {
  var getUser = function (user) {
    return $http({
      method: 'GET',
      url: '/user/' + user
    })
    .then(function (res) {
      return res.data;
    });
  };

  var getLikes = function (user) {
    return $http({
      method: 'GET',
      url: '/userlike/' + user
    })
    .then(function (resp) {
      return resp.data;
    });
  };

  var getDislike = function (path) {
    return $http({
      method: 'GET',
      url: '/userDislike/' + path
    })
    .then(function (resp) {
      return resp.data;
    })
  };

  return {
    getUser: getUser,
    getLikes: getLikes,
    getDislike: getDislike
  };
})
.factory('UserResources', function ($http, $location, $window) {
  var likeResource = function (userPref) {
    return $http({
      method: 'POST',
      url: '/likeResource',
      data: userPref
    })
    .then(function (resp) {
      return resp.status;
    });
  };

  var dislikeResource = function (userPref) {
    return $http({
      method: 'POST',
      url: '/dislikeResource',
      data: userPref
    })
    .then(function (resp) {
      return resp.status;
    });
  };

  var markAsSeen = function (userHasSeen) {
    return $http({
      method: 'POST',
      url: '/resourceHistory',
      data: userHasSeen
    })
    .then(function (resp) {
      return resp.status;
    });
  };

  return {
    likeResource: likeResource,
    dislikeResource: dislikeResource,
    markAsSeen : markAsSeen
  };
})

.factory('Search', function($http) {
  var searchPodcasts = function (input) {
    return $http({
      method: 'GET',
      url: '/suggest/' + input
    })
    .then(function (resp) {
      return resp.data;
    });
  };    
  return {
    searchPodcasts : searchPodcasts
  }
})
.factory('Browse', function($http) {
  var getPopularPodcasts = function () {
    return $http({
      method: 'GET',
      url: '/browse'
    })
    .then(function (resp) {
      return resp.data;
    });
  };    
  return {
    getPopularPodcasts : getPopularPodcasts
  }
})
.factory('Show',function($http){
  var setShow = function (showname){
    currentShow =  showname;
  }
  var getShowsEpisodes = function () {
    var showsOptions = {
      showName : currentShow
    }
    console.log("currentShow",showsOptions)
    return $http({
      method: 'POST',
      url: '/show',
      data: showsOptions
    })
    .then(function (resp) {
      console.log(resp.data)
      return resp.data;
    });
  };    
  return {
    getShowsEpisodes : getShowsEpisodes,
    setShow : setShow
  }
})
.factory('jqueryAudioPlayer',function(tracks){
  console.log(tracks)
   var jqueryMedia = function(tracks) {
    jQuery(function($) {
                   var supportsAudio = !!document.createElement('audio').canPlayType;
  if(supportsAudio) {
      var index = 0,
      playing = false;
      mediaPath = '/how_to/assets/media/audio/',
      extension = '',
      // tracks = [
      //     {"track":1,"name":"Happy Birthday Variation: In the style of Beethoven","length":"00:55","file":"01_Happy_Birthday_Variation_In_The"},
      //     {"track":2,"name":"Wedding March Variation 1","length":"00:37","file":"02_Wedding_March_1"},
      //     {"track":3,"name":"Happy Birthday Variation: In the style of Tango","length":"01:05","file":"03_Happy_Birthday_Variation_In_The"},
      //     {"track":4,"name":"Wedding March Variation 2","length":"00:40","file":"04_Wedding_March_2"},
      //     {"track":5,"name":"Random Classical","length":"00:59","file":"05_AFI_com"}
      // ],
      tracks = tracks,
      trackCount = tracks.length,
      npAction = $('#npAction'),
      npTitle = $('#npTitle'),
            audio = $('#audio1').bind('play', function() {
                playing = true;
                npAction.text('Now Playing:');
            }).bind('pause', function() {
                playing = false;
                npAction.text('Paused:');
            }).bind('ended', function() {
                npAction.text('Paused:');
                if((index + 1) < trackCount) {
                    index++;
                    loadTrack(index);
                    audio.play();
                } else {
                    audio.pause();
                    index = 0;
                    loadTrack(index);
                }
            }).get(0),
             btnPrev = $('#btnPrev').click(function() {
                 if((index - 1) > -1) {
                     index--;
                     loadTrack(index);
                     if(playing) {
                         audio.play();
                     }
                 } else {
                     audio.pause();
                     index = 0;
                     loadTrack(index);
                 }
             }),
             btnNext = $('#btnNext').click(function() {
                 if((index + 1) < trackCount) {
                     index++;
                     loadTrack(index);
                     if(playing) {
                         audio.play();
                     }
                 } else {
                     audio.pause();
                     index = 0;
                     loadTrack(index);
                 }
             }),
              li = $('#plUL li').click(function() {
                  var id = parseInt($(this).index());
                  console.log(id)
                  if(id !== index) {
                      playTrack(id);
                  }
              }),
              loadTrack = function(id) {
                  $('.plSel').removeClass('plSel');
                  $('#plUL li:eq(' + id + ')').addClass('plSel');
                  npTitle.text(tracks[id].name);
                  index = id;
                  audio.src = 'http://www.stephaniequinn.com/Music/Allegro%20from%20Duet%20in%20C%20Major.mp3';
              },
              playTrack = function(id) {
                  loadTrack(id);
                  audio.play();
              };
              if(audio.canPlayType('audio/ogg')) {
                  extension = '.ogg';
              }
              if(audio.canPlayType('audio/mpeg')) {
                  extension = '.mp3';
              }
              loadTrack(index);
          }
          });
       }

      return {jqueryMediaPlayer : jqueryMedia}
})
.factory('audio',function ($document) {
  var playNext = function(currentShow){
    updateToNext()
    var audioElement = document.querySelector('.audioPlayer');
    audioElement.src = currentShow.url;
    audioElement.play(); 
  }

  var updateToNext = function (){
    var audioElement = document.querySelector('.audioPlayer');
    audioElement.src = ""
  }
  var initPlay = function(){
    var audioElement = document.querySelector('.audioPlayer');
    var playButton = document.querySelector('.play');
    playButton.addEventListner("click" ,function () {
      audioElement.play();
    })
  }
  
  return { 
    playNext: playNext,
    initPlay : initPlay
   }
});

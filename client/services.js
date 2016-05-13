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



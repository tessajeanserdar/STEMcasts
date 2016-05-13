angular.module('fickle', [
  'angularSoundManager',
  'fickle.auth',
  'fickle.services',
  'fickle.user',
  'fickle.player',
  'fickle.elasticSearch',
  'fickle.channel',
  'fickle.browse',
  'fickle.show',
  'fickle.welcome', 
  'ui.router'
])
.config(function ($stateProvider, $urlRouterProvider) {

 $urlRouterProvider.otherwise("/welcome");
 $stateProvider
   .state('login', {
     url: "/login",
     templateUrl: "/app/login/login.html",
     controller: 'AuthController'
   })
   .state('channel', {
     url: "/channel",
     templateUrl: "/app/channel/channel.html",
     controller: 'channelController'
   })
   .state('player', {
    url: '/player',
    templateUrl: '/app/player/player.html',
    controller: 'playerController'
   })
  .state('user', {
    url: "/user",
    templateUrl: "/app/user/user.html",
    controller: 'userController'
  })
  .state('explore', {
    url: "/explore",
    templateUrl: "/app/explore/explore.html",
    controller: 'elasticController'
  })
  .state('browse', {
    url: "/browse",
    templateUrl: "/app/browse/browse.html",
    controller: 'browseController'
  })
  .state('show', {
    url: "/show",
    templateUrl: "/app/show/show.html",
    controller: 'showController'
  })
  .state('welcome', {
    url: "/welcome",
    templateUrl: "/app/welcome/welcome.html",
    controller: 'welcomeController'
  });
});


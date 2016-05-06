angular.module('fickle', [
  'fickle.auth',
  'fickle.services',
  'fickle.user',
  'fickle.resource',
  'fickle.elasticSearch',
  'fickle.channel',
  'fickle.browse',
  'ui.router'
])
.config(function ($stateProvider, $urlRouterProvider) {

 $urlRouterProvider.otherwise("/search");
 $stateProvider
   // .state('search', {
   //   url: "/search",
   //   templateUrl: "/app/Search/search.html",
   //   controller: 'searchController'
   // })
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
   .state('resource', {
    url: '/resource',
    templateUrl: '/app/resources/resource.html',
    controller: 'resourceController'
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
  });
});


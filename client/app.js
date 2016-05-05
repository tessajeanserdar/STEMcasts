angular.module('app', ['app.auth','ngRoute'])

.config(function ($routeProvider) {
  $routeProvider
    .when('/', {
      templateUrl: './index.html',
    })
    .when('/login', {
      templateUrl: './client/login/login.html',
      controller: 'AuthController'
    })
    .otherwise('/');
});
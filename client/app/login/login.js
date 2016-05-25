angular.module('fickle.auth', [])

.controller('AuthController', function ($scope, $http, $location, $window , Auth) {
  $scope.signin = function () {
    // console.log(user)
    // $scope.error = '';
    // if(!user) {
    //   var userData = {
    //     "username":$scope.username,
    //     "password":$scope.password
    //   }
    // } 
    Auth.signin(JSON.stringify($scope.user))
    .then(function(message){
      if(message === "Wrong Input"){
        alert("Thats not a valid user password combo")
      } else {
        window.localStorage.setItem('com.fickle', JSON.stringify(message[0]));
        $location.path('/explore');
      }
    })
    .catch(function (error) {
      console.error(error);
    });
  };

  $scope.signup = function () {
    $scope.signUpError = '';
    Auth.signup($scope.user)
    .then(function(message){
      if(message==="existing"){
        alert("You already have an account. Please login.");
      } else {
        window.localStorage.setItem('com.fickle', JSON.stringify(message[0]));
        $location.path('/explore');
      }
    });
  };
});
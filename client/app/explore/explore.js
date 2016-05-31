angular.module('fickle.elasticSearch', [])
.controller('elasticController', function ($scope, Search,Podcasts) {
  $scope.search = function() {
    var input = $scope.searchString;
    if (input.length > 1) {
      Search.searchPodcasts(input).then(function (data) {
        $scope.results = data.docsuggest[0].options;
      });
    } else {
      $scope.results = [];
    }
  };
  $scope.sendTags = function(selected) {
    var isShow = selected.payload.url ? true : false;
    var obj = { name: selected.text, isShow: isShow };
    window.localStorage.removeItem('selected');
    window.localStorage.setItem('selected', JSON.stringify(selected))
    Podcasts.setTags(selected,"explore");
  };

  $scope.DoWork = function(){
        alert('Hello World!');  
  };
})



const myApp = angular.module("myApp", [
  "ngRoute",
  "ngMaterial",
  "infinite-scroll",
  "ngStorage",
]);

function mainController($scope, $sessionStorage, apiCall) {
  console.log("controller executed");
  $sessionStorage.myData= "This is a test data";
  console.log($sessionStorage.myData);
    apiCall.getNewsDetails(4).then(console.log);
}

myApp.controller("mainController", mainController);

myApp.config(function ($routeProvider, $locationProvider) {
  $locationProvider.hashPrefix("");
  $routeProvider
    .when("/", {
      controller: "topStoriesController",
      templateUrl: "./src/mainContainer/topStories/TopStories.html",
    })
    .when("/new", {
      controller: "newStoriesController",
      templateUrl: "./src/mainContainer/newStories/NewStories.html",
    })
    .when("/best", {
      controller: "bestStoriesController",
      templateUrl: "./src/mainContainer/bestStories/BestStories.html",
    })
    .otherwise({
      redirectTo: "/",
    });
});

myApp.service('apiCall',function($http, $sessionStorage){
 this.getNewsDetails= async function(id) {
    const stringifiedId= id.toString();
    let sessionNewsDehydrated = $sessionStorage[stringifiedId]; 
    let sessionNews= null;
    if(sessionNewsDehydrated){
      sessionNews = JSON.parse(sessionNewsDehydrated);
    }

    if (sessionNews) {
      console.log("got from sessionStorage", sessionNews);
      return sessionNews;
    } else {
      try {
        console.log("Calling API");
        const news = await $http
          .get(
            `https://hacker-news.firebaseio.com/v0/item/${id}.json?print=pretty`
          )
          .then(function (response) {
            return response.data;
          });
        const shortenedNews = {
          title: news.title,
          score: news.score,
          type: news.type,
          url: news.url,
          by: news.by,
        };
        let shortenedNewsDehydrated= JSON.stringify(shortenedNews);
        $sessionStorage[stringifiedId]= shortenedNewsDehydrated;
        return shortenedNews;
      } catch (error) {
        console.log(error);
        $scope.bestStoriesError = true;
      }
    }
  }
  
})

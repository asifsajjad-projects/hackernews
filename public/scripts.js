const myApp = angular.module("myApp", [
  "ngRoute",
  "ngMaterial",
  "infinite-scroll",
  "ngCookies",
]);

function mainController($scope, $cookies) {
  console.log("controller executed");
  console.log(Object.keys($cookies.getAll()).length);
}

myApp.controller("mainController", mainController);

myApp.config(function ($routeProvider, $locationProvider) {
  $locationProvider.hashPrefix("");
  $routeProvider
    .when("/", {
      controller: "topStoriesController",
      templateUrl: "../src/mainContainer/topStories/TopStories.html",
    })
    .when("/new", {
      controller: "newStoriesController",
      templateUrl: "../src/mainContainer/newStories/NewStories.html",
    })
    .when("/best", {
      controller: "bestStoriesController",
      templateUrl: "../src/mainContainer/bestStories/BestStories.html",
    })
    .otherwise({
      redirectTo: "/",
    });
});

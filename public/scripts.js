const myApp = angular.module("myApp", [
  "ngRoute",
  "ngMaterial",
  "infinite-scroll",
]);



myApp.config(function($routeProvider, $locationProvider){
    $locationProvider.hashPrefix('');
    $routeProvider
    .when('/',{
        controller:topController,
        templateUrl:"../src/mainContainer/topStories/TopStories.html"
    })
    .when('/new', {
        controller:newStoriesController,
        templateUrl:"../src/mainContainer/newStories/NewStories.html"
    })
    .when('/best', {
        controller:bestStoriesController,
        templateUrl:"../src/mainContainer/bestStories/BestStories.html"
    })
    .otherwise({
        redirectTo:'/'
    })
})

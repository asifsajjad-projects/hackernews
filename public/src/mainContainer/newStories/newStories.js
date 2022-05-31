function newStoriesController($scope, $http, apiCall) {
  console.log("new stories called");
  

  $http
    .get("https://hacker-news.firebaseio.com/v0/newstories.json?print=pretty")
    .then(function (response) {
      $scope.totalNewIds = response.data;
      $scope.lastNewIndex = 10;
      return response.data.slice(0, 10);
    })
    .then(async function (smallArray) {
      try {
        const firstTenNewsArray = await Promise.all(
          smallArray.map(apiCall.getNewsDetails)
        );
        $scope.myNewNewsArray = firstTenNewsArray;
        $scope.bestStoriesError = false;
      } catch (error) {
        $scope.bestStoriesError = true;
        console.log(error);
      }
    })
    .catch(function (err) {
      $scope.bestStoriesError = true;
      console.log(err);
    });

  $scope.loadNewNext = async function () {
    console.log("loadNewNext called");
    if ($scope.totalNewIds) {
      $scope.disableNewScroll = true;
      let shortArray = $scope.totalNewIds.slice(
        $scope.lastNewIndex,
        $scope.lastNewIndex + 10
      );
      try {
        const nextTenNewsArray = await Promise.all(
          shortArray.map(apiCall.getNewsDetails)
        );
        $scope.myNewNewsArray = [...$scope.myNewNewsArray, ...nextTenNewsArray];
        $scope.disableNewScroll = false;
        $scope.lastNewIndex += 10;
        $scope.bestStoriesError = false;
        $scope.$digest();
      } catch (error) {
        $scope.bestStoriesError = true;
        console.log(error);
      }
    }
  };
}

myApp.controller("newStoriesController", newStoriesController);

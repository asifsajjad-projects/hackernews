function bestStoriesController($scope, $http, $sessionStorage,apiCall) {
  console.log("best stories called");

  

  $http
    .get("https://hacker-news.firebaseio.com/v0/beststories.json?print=pretty")
    .then(function (response) {
      $scope.totalBestIds = response.data;
      $scope.lastBestIndex = 10;
      return response.data.slice(0, 10);
    })
    .then(async function (smallArray) {
      try {
        const firstTenNewsArray = await Promise.all(
          smallArray.map(apiCall.getNewsDetails)
        );
        $scope.myBestNewsArray = firstTenNewsArray;
        $scope.bestStoriesError = false;
      } catch (error) {
        console.log(error);
        $scope.bestStoriesError = true;
      }
    })
    .catch(function (err) {
      $scope.bestStoriesError = true;
      console.log(err);
    });

  $scope.loadBestNext = async function () {
    console.log("loadBestNext called");
    if ($scope.totalBestIds) {
      $scope.disableBestScroll = true;
      let shortArray = $scope.totalBestIds.slice(
        $scope.lastBestIndex,
        $scope.lastBestIndex + 10
      );
      try {
        const nextTenNewsArray = await Promise.all(
          shortArray.map(apiCall.getNewsDetails)
        );
        $scope.myBestNewsArray = [
          ...$scope.myBestNewsArray,
          ...nextTenNewsArray,
        ];
        $scope.disableBestScroll = false;
        $scope.bestStoriesError = false;
        $scope.lastBestIndex += 10;
        $scope.$digest();
        console.log($scope.myBestNewsArray);
      } catch (error) {
        $scope.bestStoriesError = true;
        console.log(error);
      }
    }
  };
}

myApp.controller("bestStoriesController", bestStoriesController);

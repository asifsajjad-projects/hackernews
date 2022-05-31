function topStoriesController($scope, $http,apiCall) {
 

  $http
    .get("https://hacker-news.firebaseio.com/v0/topstories.json?print=pretty")
    .then(function (response) {
      $scope.totalIds = response.data;
      $scope.lastIndex = 10;
      return response.data.slice(0, 10);
    })
    .then(async function (smallArray) {
      try {
        const firstTenNewsArray = await Promise.all(
          smallArray.map(apiCall.getNewsDetails)
        );
        $scope.myNewsArray = firstTenNewsArray;
        $scope.topStoriesError = false;
      } catch (error) {
        console.log(error);
        $scope.topStoriesError = true;
      }
    })
    .catch(function (err) {
      $scope.topStoriesError = true;
      console.log(err);
    });

  $scope.loadNext = async function () {
    if ($scope.totalIds) {
      $scope.disableTopScroll = true;
      let shortArray = $scope.totalIds.slice(
        $scope.lastIndex,
        $scope.lastIndex + 10
      );
      try {
        const nextTenNewsArray = await Promise.all(
          shortArray.map(apiCall.getNewsDetails)
        );
        $scope.myNewsArray = [...$scope.myNewsArray, ...nextTenNewsArray];
        $scope.disableTopScroll = false;
        $scope.lastIndex += 10;
        $scope.topStoriesError = false;
        $scope.$digest();
      } catch (error) {
        console.log(error);
        $scope.topStoriesError = true;
      }
    }
  };
}

myApp.controller("topStoriesController", topStoriesController);

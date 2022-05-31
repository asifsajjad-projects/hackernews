function bestStoriesController($scope, $http, $cookies) {
  console.log("best stories called");

  async function getNewsDetails(id) {
    let cookieNews = $cookies.getObject(id.toString());
    console.log(cookieNews);

    if (cookieNews) {
      console.log("got from cookie", cookieNews);
      return cookieNews;
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
        $cookies.putObject(id.toString(), shortenedNews);
        return shortenedNews;
      } catch (error) {
        console.log(error);
        $scope.bestStoriesError = true;
      }
    }
  }

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
          smallArray.map(getNewsDetails)
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
          shortArray.map(getNewsDetails)
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

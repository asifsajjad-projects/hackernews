function bestStoriesController($scope, $http) {
    console.log("best stories called");
    async function getNewsDetails(id) {
      try {
        const news = await $http
          .get(
            `https://hacker-news.firebaseio.com/v0/item/${id}.json?print=pretty`
          )
          .then(function (response) {
            return response.data;
          });
        return news;
      } catch (error) {
        console.log(error);
      }
    }
  
    $http
      .get("https://hacker-news.firebaseio.com/v0/beststories.json?print=pretty")
      .then(function (response) {
        console.log(response.data);
        $scope.totalBestIds = response.data;
        $scope.lastBestIndex = 10;
        return response.data.slice(0, 10);
      })
      .then(async function (smallArray) {
        try {
          console.log(smallArray);
          // let abc= await getNewsDetails(smallArray[0]);
          // console.log(abc);
          const firstTenNewsArray = await Promise.all(
            smallArray.map(getNewsDetails)
          );
          $scope.myBestNewsArray = firstTenNewsArray;
          console.log($scope.myBestNewsArray);
        } catch (error) {
          console.log(error);
        }
      })
      .catch(console.log);
  
      $scope.loadBestNext= async function(){
          console.log("loadBestNext called");
          if($scope.totalBestIds){
              $scope.disableBestScroll=true;
              let shortArray=$scope.totalBestIds.slice($scope.lastBestIndex, $scope.lastBestIndex+10);
              try {
                  const nextTenNewsArray = await Promise.all(
                    shortArray.map(getNewsDetails)
                  );
                  $scope.myBestNewsArray= [...$scope.myBestNewsArray,...nextTenNewsArray];
                  $scope.disableBestScroll=false;
                  $scope.$digest();
                  console.log($scope.myBestNewsArray);
                } catch (error) {
                  console.log(error);
                }
          }
          
      }
  }
  
  myApp.controller("bestStoriesController", bestStoriesController);
function newStoriesController($scope, $http) {
    console.log("new stories called");
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
      .get("https://hacker-news.firebaseio.com/v0/newstories.json?print=pretty")
      .then(function (response) {
        console.log(response.data);
        $scope.totalNewIds = response.data;
        $scope.lastNewIndex = 10;
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
          $scope.myNewNewsArray = firstTenNewsArray;
          console.log($scope.myNewNewsArray);
        } catch (error) {
          console.log(error);
        }
      })
      .catch(console.log);
  
      $scope.loadNewNext= async function(){
          console.log("loadNewNext called");
          if($scope.totalNewIds){
              $scope.disableNewScroll=true;
              let shortArray=$scope.totalNewIds.slice($scope.lastNewIndex, $scope.lastNewIndex+10);
              try {
                  const nextTenNewsArray = await Promise.all(
                    shortArray.map(getNewsDetails)
                  );
                  $scope.myNewNewsArray= [...$scope.myNewNewsArray,...nextTenNewsArray];
                  $scope.disableNewScroll=false;
                  $scope.$digest();
                  console.log($scope.myNewNewsArray);
                } catch (error) {
                  console.log(error);
                }
          }
          
      }
  }
  
  myApp.controller("newStoriesController", newStoriesController);
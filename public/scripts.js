const myApp = angular.module("myApp", [
  "ngRoute",
  "ngMaterial",
  "infinite-scroll",
]);

function myController($scope, $http) {
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
    .get("https://hacker-news.firebaseio.com/v0/topstories.json?print=pretty")
    .then(function (response) {
      console.log(response.data);
      $scope.totalIds = response.data;
      $scope.lastIndex = 10;
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
        $scope.myNewsArray = firstTenNewsArray;
        console.log($scope.myNewsArray);
      } catch (error) {
        console.log(error);
      }
    })
    .catch(console.log);

    $scope.loadNext= async function(){
        console.log("loadNext called");
        if($scope.totalIds){
            $scope.disableScroll=true;
            let shortArray=$scope.totalIds.slice($scope.lastIndex, $scope.lastIndex+10);
            try {
                const nextTenNewsArray = await Promise.all(
                  shortArray.map(getNewsDetails)
                );
                $scope.myNewsArray= [...$scope.myNewsArray,...nextTenNewsArray];
                $scope.disableScroll=false;
                $scope.$digest();
                console.log($scope.myNewsArray);
              } catch (error) {
                console.log(error);
              }
        }
        
    }
}

myApp.controller("myController", myController);

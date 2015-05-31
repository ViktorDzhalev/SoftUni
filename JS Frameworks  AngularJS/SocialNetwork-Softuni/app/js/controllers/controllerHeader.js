socialNetworkBaseApp.controller('controllerHeader',
    ['$scope', '$location', '$route', 'userData', 'authenticationData','infoService','friendsData',
        function ($scope, $location, $route, userData, authenticationData,infoService,friendsData) {

            $scope.isActive = function (locationHTML) {
                return locationHTML === $location.path();
            };

            $scope.user = authenticationData.getLoggedUser();

            $scope.searchUsers = searchUsers;
            $scope.searchResultsShown = false;

            $scope.showRequestsDetail = showRequestsDetail;
            $scope.requestDetailsShown = false;
            $scope.searchUsers = searchUsers;
            $scope.searchResultsShown = false;

            friendsData.getFriendRequests()
                .$promise
                .then(function (data) {
                    $scope.requestsCount = data.length;
                    $scope.requests = data;
                }, function (error) {
                    infoService( 'Error!');
                    authenticationData.deleteCredentials();
                    $route.reload();
                });

            function showRequestsDetail() {
                if($scope.requestsCount) {
                    $scope.requestDetailsShown = true;
                }
            }
            function searchUsers(searchTerm) {
                userData.searchUsersByName(searchTerm)
                    .$promise
                    .then(function (data) {
                        if(data.length) {
                            $scope.searchResults = data;
                            $scope.searchResultsCount = data.length;
                            $scope.searchResultsShown = true;
                        } else {
                            $scope.searchResults = [];
                            $scope.searchResultsShown = false;
                        }
                    }, function (error) {
                        $scope.searchResultsShown = false;
                    });
            }

            function redirectToHome(time) {
                $timeout(function () {
                    $location.path('/');
                }, time);
            }
        }]);
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
          //  $scope.defaultProfileImageData = defaultProfileImageData;

            friendsData.getFriendRequests()
                .$promise
                .then(function (data) {
                    $scope.requestsCount = data.length;
                    $scope.requests = data;
                }, function (error) {
                    toaster.pop('error', 'Error!', error.data.message, defaultNotificationTimeout);
                    credentials.deleteCredentials();
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
                            infoService.success('ddddoo');
                            $scope.searchResults = data;
                            $scope.searchResultsCount = data.length;
                            $scope.searchResultsShown = true;
                        } else {
                            $scope.searchResults = [];
                            $scope.searchResultsShown = false;
                        }
                    }, function (error) {
                        $scope.searchResultsShown = false;
                        infoService.error('noo');
                    });
            }

            function redirectToHome(time) {
                $timeout(function () {
                    $location.path('/');
                }, time);
            }
        }]);
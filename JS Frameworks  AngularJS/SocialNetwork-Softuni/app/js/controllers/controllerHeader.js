socialNetworkBaseApp.controller('controllerHeader',
    ['$scope', '$location', '$route', 'userData', 'authenticationData','infoService',
        function ($scope, $location, $route, userData, authenticationData,infoService) {

            $scope.isActive = function (locationHTML) {
                return locationHTML === $location.path();
            };

            $scope.user = authenticationData.getLoggedUser();

            $scope.searchUsers = searchUsers;
            $scope.searchResultsShown = false;

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
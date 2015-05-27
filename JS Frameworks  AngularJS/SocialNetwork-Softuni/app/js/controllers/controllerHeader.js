socialNetworkBaseApp.controller('controllerHeader',
    ['$scope', '$location', '$route', 'userData', 'authenticationData',
        function ($scope, $location, $route, userData, authenticationData) {

            $scope.isActive = function (locationHTML) {
                return locationHTML === $location.path();
            };

            $scope.user = authenticationData.getLoggedUser();
        }]);
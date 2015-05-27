'use strict';

socialNetworkBaseApp.controller('controllerLogout',
    ['$scope', '$location', '$timeout', 'userData', 'authenticationData', 'infoService', function ($scope, $location, $timeout, userData, authenticationData, infoService){
        $scope.logoutUser = logoutUser;
        $scope.logoutUser();

        function logoutUser() {
            userData.logout()
                .$promise
                .then(function (data) {
                    authenticationData.deleteCredentials();
                    infoService.success('Logout successful!');
                    redirectToHome(1000);
                }, function (error) {
                    infoService.error('Logout error!');
                    redirectToHome(0);
                })
        }

        function redirectToHome(time) {
            $timeout(function () {
                $location.path('/');
            }, time);
        }
    }
    ]);


'use strict';

socialNetworkBaseApp.controller('controllerPassword',
    ['$scope', '$location', '$timeout', 'userData', 'authenticationData', 'infoService', function ($scope, $location, $timeout, userData, authenticationData, infoService){
        $scope.changePassword = changePassword;

        function changePassword(password, changePasswordForm) {
            userData.changePassword(password)
                .$promise
                .then(function (data) {
                    infoService.success('Password is change');
                    redirectToHome(2000);
                }, function (error) {
                    infoService.success('Password is not a change');
                })
        }

        function redirectToHome(time) {
            $timeout(function () {
                $location.path('/');
            }, time);
        }
    }
    ]);


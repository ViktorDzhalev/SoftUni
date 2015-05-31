'use strict';

socialNetworkBaseApp.controller('controllerLogin',
    ['$scope', '$route', '$timeout', 'userData','authenticationData','infoService',
        function ($scope, $route, $timeout, userData, authenticationData, infoService) {
        $scope.rememberMe = false;
        $scope.login = login;

        function login(user, loginForm) {
            userData.login(user)
                .$promise
                .then(function (data) {
                    if ($scope.rememberMe) {
                        $scope.$storage = authenticationData.saveInLocalStorage(data.access_token, data.token_type);
                    } else {
                        $scope.$storage = authenticationData.saveInSessionStorage(data.access_token, data.token_type);
                    }

                    userData.getLoggedUserData()
                        .$promise
                        .then(function (data) {
                            authenticationData.saveLoggedUser(data);
                            infoService.success('Login successful');
                            $scope.loginForm.$setPristine();
                            reloadRoute()
                        }, function (error) {
                            infoService.error('Login error');
                            authenticationData.deleteCredentials();
                            $route.reload();
                        });
                }, function (error) {
                    infoService.error('Login error')
                });
        }

        function reloadRoute(time) {
            $timeout(function () {
                $route.reload();
            }, time);
        }
    }
    ]);
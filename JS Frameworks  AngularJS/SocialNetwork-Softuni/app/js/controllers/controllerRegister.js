'use strict';

socialNetworkBaseApp.controller('controllerRegister',
    ['$scope', '$route', '$timeout', 'userData','$location', 'authenticationData', function ($scope, $route, $timeout, userData,$location,authenticationData) {
        $scope.register = register;

        function register(user, registerForm) {
            userData.register(user)
                .$promise
                .then(function (data) {
                    authenticationData.saveLoggedUser(user);
                    authenticationData.saveInSessionStorage(data.access_token, data.token_type);
                    $scope.registerForm.$setPristine();
                    $location.path('/');
                    $route.reload();
                }, function (error) {
                })
        }

        function reloadRoute(time) {
            $timeout(function () {
                $route.reload();
            }, time);
        }
    }
    ]);
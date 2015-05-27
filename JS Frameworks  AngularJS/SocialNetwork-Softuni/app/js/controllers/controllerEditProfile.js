'use strict';

socialNetworkBaseApp.controller('controllerEditProfile',
    ['$scope', '$location', '$timeout', 'userData', 'authenticationData', 'infoService', function ($scope, $location, $timeout, userData, authenticationData, infoService){
        $scope.editUser = authenticationData.getLoggedUser();
        $scope.editProfile = editProfile;
        $scope.formatProfileImgToBase64 = formatProfileImgToBase64;
        $scope.formatCoverImgToBase64 = formatCoverImgToBase64;

        function editProfile(user, editProfileForm) {
            userData.edit(user)
                .$promise
                .then(function (data) {
                    $scope.editProfileForm.$setPristine();
                    $scope.editUser.name = user.name;
                    $scope.editUser.email = user.email;
                    $scope.editUser.profileImageData = user.profileImageData;
                    $scope.editUser.coverImageData = user.coverImageData;
                    $scope.editUser.gender = user.gender;
                    infoService.success('Edit successful');
                    redirectToWall($scope.editUser.username, 2000);
                }, function (error) {
                    infoService.success('Edit error');
                })
        }

        function formatProfileImgToBase64() {
            $scope.editUserData.profileImageData = 'data:image/jpg;base64,' + $scope.editUserData.profileImageData.base64;
        }

        function formatCoverImgToBase64() {
            $scope.editUserData.coverImageData = 'data:image/jpg;base64,' + $scope.editUserData.coverImageData.base64;
        }

        function redirectToWall(user, time) {
            $timeout(function () {
                $location.path('/users/' + user);
            }, time);
        }
    }
    ]);

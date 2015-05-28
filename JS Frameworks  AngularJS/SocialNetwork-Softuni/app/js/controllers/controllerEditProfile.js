'use strict';

socialNetworkBaseApp.controller('controllerEditProfile',
    ['$scope','$route', '$location', '$timeout', 'userData', 'authenticationData', 'infoService', function ($scope,$route, $location, $timeout, userData, authenticationData, infoService){
        $scope.editUser = authenticationData.getLoggedUser();
        $scope.editProfile = editProfile;
        $scope.formatProfileImgToBase64 = formatProfileImgToBase64;
        $scope.formatCoverImgToBase64 = formatCoverImgToBase64;

        function editProfile(user, editProfileForm) {
            if(!user.name){
                user.name = $scope.editUser.name;
            }
            if(!user.email){
                user.email = $scope.editUser.email;
            }
            if(!user.profileImageData){
                user.profileImageData = $scope.editUser.profileImageData;
            }
            if(!user.coverImageData){
                user.coverImageData = $scope.editUser.coverImageData;
            }
            if(!user.gender){
                user.gender = $scope.editUser.gender;
            }
            userData.edit(user)
                .$promise
                .then(function (data) {
                    $scope.editProfileForm.$setPristine();
                   // authenticationData.saveLoggedUser(user);

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

        //$scope.editUser = authenticationData.getLoggedUser();
        //$scope.editProfile = editProfile;
        //
        //function editProfile (editUserData) {
        //    userData.edit(editUserData)
        //        .$promise
        //        .then(function () {
        //            userData.getLoggedUserData()
        //                .$promise
        //                .then(function (currentUserData) {
        //                    authenticationData.saveLoggedUser(currentUserData);
        //                    $scope.editProfileForm.$setPristine();
        //                    infoService.success('YYYES')
        //                    $location.path('/');
        //                    $route.reload();
        //                }, function (error) {
        //                    // notificationService.success('Edit User Error!');
        //                    authenticationData.deleteCredentials();
        //                    $route.reload();
        //                });
        //        },
        //        function (error) {
        //            //notificationService.error('Edit User Error!');
        //        })
      //  }
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

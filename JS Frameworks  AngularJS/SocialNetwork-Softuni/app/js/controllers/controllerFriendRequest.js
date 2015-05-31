'use strict';

socialNetworkBaseApp.controller('controllerFriendRequest',
    ['$scope', '$route', 'friendsData', 'infoService', function ($scope, $route, friendsData, infoService) {
        var defaultNotificationTimeout = 2000;
        $scope.acceptRequest = acceptRequest;
        $scope.rejectRequest = rejectRequest;
        $scope.cancel = cancel;


        function cancel(requestId) {
            $scope.requestDetailsShown = false;
        }

        function acceptRequest(requestId) {
            friendsData.approveFriendRequest(requestId)
                .$promise
                .then(function (data) {
                    infoService.success('Success!');
                    friendsData.getFriendRequests()
                        .$promise
                        .then(function (data) {
                            $scope.requestsCount = data.length;
                            $scope.requests = data;
                            if($scope.requestsCount === 0) {
                                $scope.requestDetailsShown = false;
                            }
                        });
                }, function (error) {
                    infoService.error('Error!');
                });
        }

        function rejectRequest(requestId) {
            friendsData.rejectFriendRequest(requestId)
                .$promise
                .then(function (data) {
                    infoService.success('Success!');
                    friendsData.getFriendRequests()
                        .$promise
                        .then(function (data) {
                            $scope.requestsCount = data.length;
                            $scope.requests = data;
                            if($scope.requestsCount === 0) {
                                $scope.requestDetailsShown = false;
                            }
                        });
                }, function (error) {
                    infoService.error('Error!');
                });
        }
    }]);


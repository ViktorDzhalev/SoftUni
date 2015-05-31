'use strict';

socialNetworkBaseApp.directive('friendsRequests', function () {
    return {
        templateUrl: 'templatesHTML/user/friends-requests.html',
        restrict: 'A',
        controller: 'controllerFriendRequest'
    }
});

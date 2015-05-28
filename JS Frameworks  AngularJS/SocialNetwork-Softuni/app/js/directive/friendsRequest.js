'use strict';

socialNetworkBaseApp.directive('friendRequests', function () {
    return {
        templateUrl: 'templatesHTML/user/friendsrequests.html',
        restrict: 'A',
        controller: 'controllerFriendRequest'
    }
});

'use strict';

socialNetworkBaseApp.directive('searchUser', function () {
    return {
        templateUrl: 'templatesHTML/user/searchUserResults.html',
        restrict: 'A',
        controller: 'controllerHeader'
    }
});
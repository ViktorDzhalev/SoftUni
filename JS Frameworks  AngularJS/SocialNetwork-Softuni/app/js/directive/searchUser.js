'use strict';

socialNetworkBaseApp.directive('usersSearchResults', function () {
    return {
        templateUrl: 'templatesHTML/user/searchUserResults.html',
        restrict: 'A',
        controller: 'controllerHeader'
    }
});
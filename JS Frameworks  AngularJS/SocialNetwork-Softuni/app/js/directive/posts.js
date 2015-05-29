'use strict';

socialNetworkBaseApp.directive('posts', function () {
    return {
        templateUrl: 'templatesHTML/user/posts.html',
        restrict: 'A',
        controller: 'userWallController'
    }
});

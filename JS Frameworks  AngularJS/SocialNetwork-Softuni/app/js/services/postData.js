'use strict';

socialNetworkBaseApp.factory('postData', ['$resource', 'baseUrl', 'authenticationData', function ($resource, baseUrl, authenticationData) {
    function getNewsFeed(startPostId, pageSize) {
        var authorization = authenticationData.getAuthorization();
        return $resource(
            baseUrl + 'me/feed?StartPostId=' + (startPostId || '') + '&PageSize=' + pageSize,
            null,
            {
                'get': {
                    method: 'GET',
                    isArray: true,
                    headers: {'Authorization': authorization}
                }
            })
            .get();
    }



    return {
        getNewsFeed: getNewsFeed
    }
}]);

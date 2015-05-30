'use strict';

socialNetworkBaseApp.factory('userData', ['$resource', 'baseUrl','authenticationData',
        function ($resource, baseUrl, authenticationData) {
        function loginUser(user) {
            return $resource(baseUrl + 'users/Login')
                .save(user);
        }

        function registerUser(user) {
            return $resource(baseUrl + 'users/Register')
                .save(user);
        }

        function logoutUser() {
            var authorization = authenticationData.getAuthorization();
            return $resource(
                baseUrl + 'users/logout',
                null,
                {
                    'save': {
                        method: 'POST',
                        headers: {'Authorization': authorization}
                    }
                })
                .save();
        }

        function editUser(user) {
            var authorization = authenticationData.getAuthorization();
            return $resource(
                baseUrl + 'me',
                null,
                {
                    'put': {
                        method: 'PUT',
                        headers: {'Authorization': authorization}
                    }
                })
                .put(user);
        }

        function getLoggedUserData() {
            var authorization = authenticationData.getAuthorization();
            return $resource(
                baseUrl + 'me',
                null,
                {
                    'get': {
                        method: 'GET',
                        headers: {'Authorization': authorization}
                    }
                })
                .get();
        }

        function changePassword(password) {
            var authorization = authenticationData.getAuthorization();
            return $resource(
                baseUrl + 'me/changepassword',
                null,
                {
                    'put': {
                        method: 'PUT',
                        headers: {'Authorization': authorization}
                    }
                })
                .put(password);
        }

        function searchUsersByName(name) {
            var authorization = authenticationData.getAuthorization();
            return $resource(
                baseUrl + 'users/search?searchTerm=' + name,
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

            function getUserFullData(username) {
                var authorization = authenticationData.getAuthorization();
                return $resource(
                    baseUrl + 'users/' + username,
                    null,
                    {
                        'get': {
                            method: 'GET',
                            headers: {'Authorization': authorization}
                        }
                    })
                    .get();
            }

            return {
                login: loginUser,
                register: registerUser,
                logout: logoutUser,
                edit: editUser,
                getLoggedUserData: getLoggedUserData,
                changePassword: changePassword,
                searchUsersByName: searchUsersByName,
                getUserFullData: getUserFullData

    }
}]);
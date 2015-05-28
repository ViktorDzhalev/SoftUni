'use strict';

var socialNetworkBaseApp = angular
    .module('socialNetworkBaseApp', ['ngResource', 'ngRoute', 'ngStorage'])
    .config(function ($routeProvider) {
        $routeProvider
            .when('/', {
                templateUrl: 'templatesHTML/home.html'
            })
            .when('/logout', {
                templateUrl: 'templatesHTML/user/logout.html',
                controller: 'controllerLogout'
            })
            .when('/user/editProfile', {
                templateUrl: 'templatesHTML/user/editProfile.html',
                controller: 'controllerEditProfile',
                resolve:{
                    isLogged: function($location, $sessionStorage, $localStorage){
                        if(!$sessionStorage.authorization && !$localStorage.authorization){
                            $location.path('/');
                        }
                    }
                }
            })
            .when('/register', {
                templateUrl: 'templatesHTML/guest/register.html',
                controller: 'controllerRegister',
                resolve: {
                    isLogged: function ($location, $sessionStorage) {
                        if ($sessionStorage.authorization) {
                            $location.path('/');
                        }
                    }
                }
            })
            .when('/user/password', {
                templateUrl: 'templatesHTML/user/changePassword.html',
                //controller: 'controllerPassword',
                resolve:{
                    isLogged: function($location, $sessionStorage, $localStorage){
                        if(!$sessionStorage.authorization && !$localStorage.authorization){
                            $location.path('/');
                        }
                    }
                }
            })
            .otherwise({
                redirectTo: '/'
            })
    })
    .value('user', {
        "username": '',
        "name": ''
    })
    .constant('baseUrl', 'http://softuni-social-network.azurewebsites.net/api/');
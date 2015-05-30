'use strict';

socialNetworkBaseApp.controller('userWallController',
    ['$scope', '$route', '$routeParams', 'userData', 'friendsData', 'postData', 'authenticationData', 'infoService',
        function ($scope, $route, $routeParams, userData, friendsData, postData, authenticationData, infoService) {
        var defaultStartPostId = 0,
            defaultPageSize = 5;

        $scope.user = authenticationData.getLoggedUser();
        $scope.sendFriendRequest = sendFriendRequest;
        $scope.wallOwnerUsername = $routeParams.username;
        $scope.isUserWall = false;
        $scope.submitPost = submitPost;
        $scope.deletePost = deletePost;
        $scope.unlikePost = unlikePost;
        $scope.likePost = likePost;

       // $scope.allCommentsShown = false;
       // $scope.showAllComments = showAllComments;
       // $scope.showLessComments = showLessComments;
        $scope.commentButtonName = 'Comment';
        $scope.editButtonName = 'Edit post';
       // $scope.unlikeComment = unlikeComment;
       // $scope.likeComment = likeComment;
        //$scope.deleteComment = deleteComment;
        $scope.show = false;
        $scope.showEditPost = false;
        $scope.idPost = 1;
        $scope.idPostComment =1;
        $scope.userPreviewShown = false;
        $scope.showUserPreview = showUserPreview;

        $scope.commentEdit= function (id){
            $scope.show = !$scope.show;
            $scope.idPost = id;
            console.log(12);
        };

        $scope.editPost= function (id){
            $scope.showEditPost = !$scope.showEditPost;
            $scope.idPostComment = id;
        };

        getPosts();
        if($routeParams.username) {
            userData.getUserFullData($routeParams.username)
                .$promise
                .then(function (data) {
                    $scope.userData = data;
                    $scope.wallOwnerName = $scope.userData.name;
                    if($scope.user.username === $routeParams.username || $scope.userData.isFriend === true) {
                        $scope.isFriendOrLoggedUser = true;
                        $scope.wallOwner = $scope.userData.username;
                    }

                    if($scope.userData.isFriend) {
                        $scope.buttonName = 'Friend';
                        $scope.disabledButton = 'disabled';
                    } else if (
                        !$scope.userData.isFriend
                        && $scope.userData.hasPendingRequest
                        && $scope.user.username !== $routeParams.username) {
                        $scope.buttonName = 'Pending request';
                        $scope.disabledButton = 'disabled';
                    } else if(
                        !$scope.userData.isFriend
                        && !$scope.userData.hasPendingReques
                        && $scope.user.username !== $routeParams.username) {
                        $scope.buttonName = 'Invite';
                    } else {
                        $scope.buttonName = 'My wall';
                        $scope.disabledButton = 'disabled';
                    }
                });
        }

        function getPosts() {
            if(!$routeParams.username) {
                $scope.isUserWall = false;
                postData.getNewsFeed(defaultStartPostId, defaultPageSize)
                    .$promise
                    .then(function (data) {
                        $scope.posts = data;
                    }, function (error) {
                       // toaster.pop('error', 'Error!', error.data.message, defaultNotificationTimeout);
                    });
            } else {
                $scope.isUserWall = true;
                postData.getUserWall($routeParams.username, defaultStartPostId, defaultPageSize)
                    .$promise
                    .then(function (data) {
                        $scope.posts = data;
                    }, function (error) {
                       //toaster.pop('error', 'Error!', error.status);
                    });
            }
        }


        function unlikePost(postId) {
            $scope.posts.forEach(function (post) {
                if(post.id == postId) {
                    if(post.author.isFriend || post.wallOwner.isFriend || $scope.user.username == post.author.username) {
                        postData.unlikePost(postId)
                            .$promise
                            .then(function (data) {
                                post.liked = false;
                                post.likesCount--;
                            }, function (error) {
                                //toaster.pop('error', 'Error!', error.data.message, defaultNotificationTimeout);
                            });
                    } else {
                        //toaster.pop('error', 'Error!', 'You can`t unlike this post!', defaultNotificationTimeout);
                    }
                }
            });
        }

        function likePost(postId) {
            $scope.posts.forEach(function (post) {
                if(post.id == postId) {
                    if(post.author.isFriend || post.wallOwner.isFriend || $scope.user.username == post.author.username) {
                        postData.likePost(postId)
                            .$promise
                            .then(function (data) {
                                post.liked = true;
                                post.likesCount++;
                            }, function (error) {
                               // toaster.pop('error', 'Error!', error.data.message, defaultNotificationTimeout);
                            });
                    } else {
                       // toaster.pop('error', 'Error!', 'You can`t like this post!', defaultNotificationTimeout);
                    }
                }
            });
        }

        function deletePost(postId) {
                $scope.posts.forEach(function (post, index, object) {
                if(post.id == postId) {
                    postData.deletePost(postId)
                        .$promise
                        .then(function (data) {
                           //toaster.pop('success', 'Success!', 'Post deleted successfully.', defaultNotificationTimeout);
                            object.splice(index, 1);
                        }, function (error) {
                           // toaster.pop('error', 'Error!', error.data.message, defaultNotificationTimeout);
                        });
                }
            })
        }

        function submitPost(postContent) {
            var post = {
                postContent: postContent,
                username: $scope.wallOwner
            };

            postData.addPost(post)
                .$promise
                .then(function (data) {
                    $scope.posts.unshift(data);
                    $route.reload();
                }, function (error) {
                   //toaster.pop('error', 'Error!', error.data.message, defaultNotificationTimeout);
                })
        }

         //Edit post

        $scope.editPostFormShown = false;
        $scope.editPostFormPostId = null;
        $scope.showEditPostForm = showEditPostForm;
        $scope.closeEditPostForm = closeEditPostForm;
        $scope.editPost = editPost;

        function showEditPostForm(postId) {
            $scope.editPostFormShown = true;
            $scope.editPostFormPostId = postId;
        }

        function closeEditPostForm(){
            $scope.editPostFormShown = false;
            $scope.editPostFormPostId = null;
        }

        function editPost(postId, postContent) {
            $scope.posts.forEach(function (post) {
                if(post.id == postId && $scope.user.username == post.author.username) {
                    postData.editPost(postId, postContent)
                        .$promise
                        .then(function (data) {
                            $scope.editPostFormShown = false;
                            $scope.editPostFormPostId = null;
                            post.postContent = data.content;
                            //toaster.pop('error', 'Success!', 'Post edited successfully!', defaultNotificationTimeout);
                        }, function (error) {
                           // toaster.pop('error', 'Error!', error.data.message, defaultNotificationTimeout);
                        });
                }
            });
        }

        function sendFriendRequest(username) {
            friendsData.sendFriendRequest(username)
                .$promise
                .then(function (data) {
                    $scope.userData.hasPendingRequest = true;
                    $scope.buttonName = 'Pending request';
                    $scope.disabledButton = 'disabled';
                   // toaster.pop('success', 'Success!', data.message, defaultNotificationTimeout);
                }, function (error) {
                   //toaster.pop('error', 'Error!', error.data.message, defaultNotificationTimeout);
                });

        }

        function showUserPreview(username) {
            $scope.userFriendStatus = 'Getting status...';
            $scope.userHoverButtonType = 'disabled';

            userData.getUserPreviewData(username)
                .$promise
                .then(function (data) {
                    if(data.username == $scope.user.username) {
                        $scope.userFriendStatus = 'Me';
                        $scope.userHoverButtonType = 'disabled';
                    } else if(data.isFriend) {
                        $scope.userFriendStatus = 'Friend';
                        $scope.userHoverButtonType = 'disabled';
                    } else if(!data.isFriend && data.hasPendingRequest) {
                        $scope.userFriendStatus = 'Pending';
                        $scope.userHoverButtonType = 'disabled';
                    } else if(!data.isFriend && !data.hasPendingRequest) {
                        $scope.userFriendStatus = 'Invite';
                        $scope.userHoverButtonType = 'enabled';
                    }
                }, function (error) {
                   // toaster.pop('error', 'Error!', error.data.message);
                });

            return true;
        }

    }]);



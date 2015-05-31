'use strict';

socialNetworkBaseApp.controller('userWallController',
['$scope', '$route', '$routeParams', 'userData', 'commentData', 'friendsData', 'postData', 'authenticationData', 'infoService',
    function ($scope, $route, $routeParams, userData, commentData, friendsData, postData, authenticationData, infoService) {
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

        $scope.allCommentsShown = false;
        $scope.showAllComments = showAllComments;
        $scope.showLessComments = showLessComments;
        $scope.commentButtonName = 'Comment';
        $scope.editButtonName = 'Edit post';
        $scope.unlikeComment = unlikeComment;
        $scope.likeComment = likeComment;
        $scope.deleteComment = deleteComment;

        $scope.show = false;
        $scope.showEditPost = false;
        $scope.idPost = 1;
        $scope.idPostComment =1;
        $scope.userPreviewShown = false;
        $scope.showUserPreview = showUserPreview;



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
                        infoService.success('Success');
                    });
            } else {
                $scope.isUserWall = true;
                postData.getUserWall($routeParams.username, defaultStartPostId, defaultPageSize)
                    .$promise
                    .then(function (data) {
                        $scope.posts = data;
                    }, function (error) {
                        infoService.errror('Error');
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
                                 infoService.error('Error!');
                            });
                    } else {
                        infoService.error('Error!');
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
                                 infoService.error('Error!');
                            });
                    } else {
                        infoService.error('Error!');
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
                            infoService.success('Post deleted successfully.');
                            object.splice(index, 1);
                        }, function (error) {
                            infoService.error('Error!');
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
                    infoService.error( 'Error!');
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
                            infoService.success( 'Post edited successfully!');
                        }, function (error) {
                            infoService.error('Error!');
                        });
                }
            });
        }

            function showAllComments(postId) {
                postData.getPostComments(postId)
                    .$promise
                    .then(function (data) {
                        $scope.posts.forEach(function (post) {
                            if(post.id == postId) {
                                post.comments = data;
                                $scope.allCommentsShown = true;
                            }
                        });
                    }, function (error) {
                        infoService.error('Error!');
                    })
            }

            function showLessComments(postId) {
                $scope.posts.forEach(function (post) {
                    if(post.id == postId) {
                        post.comments = post.comments.slice(0, 3);
                        $scope.allCommentsShown = false;
                    }
                });
            }

        //Comments

            function unlikeComment(postId, commentId) {
                $scope.posts.forEach(function (post) {
                    if(post.id == postId) {
                        post.comments.forEach(function (comment) {
                            if(comment.id == commentId) {
                                if(post.author.isFriend || post.wallOwner.isFriend || $scope.user.username == post.author.username) {
                                    commentData.unlikeComment(postId, commentId)
                                        .$promise
                                        .then(function (data) {
                                            comment.liked = false;
                                            comment.likesCount--;
                                        }, function (error) {
                                            infoService.success('Error!');
                                        });
                                } else {
                                    infoService.error('You can`t unlike this comment!');
                                }
                            }
                        });
                    }
                });
            }

            function likeComment(postId, commentId) {
                $scope.posts.forEach(function (post) {
                    if(post.id == postId) {
                        post.comments.forEach(function (comment) {
                            if(comment.id == commentId) {
                                if(post.author.isFriend || post.wallOwner.isFriend || $scope.user.username == post.author.username) {
                                    commentData.likeComment(postId, commentId)
                                        .$promise
                                        .then(function (data) {
                                            comment.liked = true;
                                            comment.likesCount++;
                                        }, function (error) {
                                            infoService.error('Error!');
                                        });
                                } else {
                                    infoService.error( 'You can`t like this comment!');
                                }
                            }
                        });
                    }
                });
            }

         //form new comment

        $scope.showNewCommentForm = false;
        $scope.newCommentFormPostId = null;
        $scope.toggleNewCommentForm = toggleNewCommentForm;
        $scope.postComment = postComment;

        function toggleNewCommentForm(postId) {
            if($scope.showNewCommentForm) {
                $scope.showNewCommentForm = false;
                $scope.commentButtonName = 'Comment';
                $scope.commentContent = '';
            } else {
                $scope.showNewCommentForm = true;
                $scope.newCommentFormPostId = postId;
                $scope.commentButtonName = 'Hide';
            }
        }

        function postComment(commentContent, postId) {
            $scope.posts.forEach(function (post) {
                if(post.id == postId) {
                    if(post.author.isFriend || post.wallOwner.isFriend || $scope.user.username == post.author.username) {
                        commentData.addComment(commentContent, postId)
                            .$promise
                            .then(function (data) {
                                $scope.showNewCommentForm = false;
                                $scope.newCommentFormPostId = null;
                                post.comments.unshift(data);
                                post.totalCommentsCount++;
                                infoService.success( 'Comment successfully added.');
                            }, function (error) {
                                infoService.error('Error!');
                            });
                    } else {
                        infoService.error('Errror');
                    }
                }
            });
        }

            function deleteComment(postId, commentId) {
                $scope.posts.forEach(function (post) {
                    if(post.id == postId) {
                        post.comments.forEach(function (comment, index, object) {
                            if(comment.id == commentId) {
                                if ($scope.user.username == comment.author.username || $scope.user.username == post.author.username) {
                                    commentData.deleteComment(postId, commentId)
                                        .$promise
                                        .then(function (data) {
                                            post.totalCommentsCount--;
                                            infoService.success('Comment deleted successfully.');
                                            object.splice(index, 1);
                                        }, function (error) {
                                            infoService.error('Error!');
                                        });
                                }
                            }
                        });
                    }
                })
            }
          //Edit comment

            $scope.editCommentFormShown = false;
            $scope.editCommentFormCommentId = null;
            $scope.showEditCommentForm = showEditCommentForm;
            $scope.closeEditCommentForm = closeEditCommentForm;
            $scope.editComment = editComment;

            function showEditCommentForm(commentId) {
                console.log(33333);
                $scope.editCommentFormShown = true;
                $scope.editCommentFormCommentId = commentId;
            }

            function closeEditCommentForm(){
                $scope.editCommentFormShown = false;
                $scope.editCommentFormCommentId = null;
            }

            function editComment(postId, commentId, commentContent) {
                $scope.posts.forEach(function (post) {
                    if(post.id == postId) {
                        post.comments.forEach(function (comment) {
                            if(comment.id == commentId && $scope.user.username == comment.author.username) {
                                commentData.editComment(commentContent, postId, commentId)
                                    .$promise
                                    .then(function (data) {
                                        $scope.editCommentFormShown = false;
                                        $scope.editCommentFormCommentId = null;
                                        comment.commentContent = data.commentContent;
                                        infoService.success('Comment edited successfully!');
                                    }, function (error) {
                                        infoService.error('Error!');
                                    });
                            }
                        })
                    }
                });
            }

        $scope.user = authenticationData.getLoggedUser();


        if(!$routeParams.username || $routeParams.username === $scope.user.username) {
            $scope.username = $scope.user.username;
            friendsData.getLoggedUserFriendsPreview()
                .$promise
                .then(function (data) {
                    $scope.totalCount = data.totalCount;
                    $scope.friends = data.friends;
                }, function (error) {
                    infoService.error('Error!');
                });
        } else {
            $scope.username = $routeParams.username;
            friendsData.getOtherUserFriendsPreview($routeParams.username)
                .$promise
                .then(function (data) {
                    $scope.totalCount = data.totalCount;
                    $scope.friends = data.friends;
                }, function (error) {
                    infoService.error('Error!');
                });
        }
        function sendFriendRequest(username) {
            friendsData.sendFriendRequest(username)
                .$promise
                .then(function (data) {
                    $scope.userData.hasPendingRequest = true;
                    $scope.buttonName = 'Pending request';
                    $scope.disabledButton = 'disabled';
                    infoService.success( 'Success!');
                }, function (error) {
                    infoService.error('Error!');
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
                    infoService.error('Error!');
                });

            return true;
        }

}]);



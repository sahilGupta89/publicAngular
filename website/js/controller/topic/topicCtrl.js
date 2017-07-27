app.controller('topicCtrl', ['$scope', '$state', '$rootScope', '$location', '$stateParams', 'UserService', '$filter', '$sce', '$window', '$interval', '$timeout', 'config', function($scope, $state, $rootScope, $location, $stateParams, UserService, $filter, $sce, $window, $interval, $timeout, config) {

    /**
     *Get Current User Data
     */
    if (Object.getOwnPropertyNames($rootScope.globals).length === 2) {
        $scope.user = {
            id: $rootScope.globals.currentUser.data._id,
            type: $rootScope.globals.currentUser.data.userType,
            accessRights: $rootScope.globals.currentUser.data.accessRights,
            email: $rootScope.globals.currentUser.data.emailId,
            firstName: $rootScope.globals.currentUser.data.firstName,
            lastName: $rootScope.globals.currentUser.data.lastName,
            profilePicUrl: $rootScope.globals.currentUser.data.profilePicUrl
        }
    }

    /**
     *Get active class
     *@val = state name
     */
    $scope.getClass = function(val) {
        return ($state.current.name === val) ? 'active' : '';
    }



    /** 
     *Get topics
     *@param data object have user id, topicName, topicLanguage
     */
    $scope.getTopicDetail = function(data) {
        $scope.pageLoad = true;
        UserService.topicDetail(data)
            .then(function(res) {
                $scope.pageLoad = false;
                $scope.data = {
                    topicId: res.data.topicId,
                    topicDetails: res.data.topicDetails,
                    universalLinked: res.data.universalLinked,
                    contentLinking: res.data.contentLinking,
                    comments: res.data.comments,
                    languages: res.data.languages,
                    assessments: res.data.assessments
                }



                angular.forEach($scope.data.contentLinking, function(value) {
                    if (!value.isPurchased) {
                        if (value.purchasedCategories.indexOf(value._id) != -1) {
                            value.isPurchased = true;
                        }
                    }
                });



            });
    }


    /**
     *Get topic content when params have the values
     */
    if ($state.params.language && $state.params.name) {
        /** 
         *object for get topic detail
         */
        $scope.obj = {
            customerId: $scope.user.id,
            topicName: $state.params.name,
            topicLanguage: $state.params.language
        }

        /** 
         *Initialize get topic detail function
         *@param $scope.data = user id, topicName, topicLanguage
         */
        $scope.getTopicDetail($scope.obj);
    }



    /** 
     *Change category background colors
     *@param id = parent element id
     */
    $scope.categoryColors = function(id) {
        $scope.categoryColor = ['#ea5a60', '#676fc3', '#0da789', '#f59709', '#8fd14f', '#2d9bf0', '#fac711', '#8557c1', '#11ced4', '#b558c6'];
        angular.element('#' + id + ' .button').each(function(index) {
            var color = $scope.categoryColor[index];
            angular.element(this).css('backgroundColor', color);
        });
    }



    /**************************************************************************
        
        ###############################     Notes     #############################

        ***************************************************************************/

    $scope.note = {
        content: ''
    }

    /**
     *Get note
     */
    $scope.getNote = function() {
        var data = {
            topicId: $scope.data.topicId
        }
        $scope.isLoading = true;
        UserService.getNote(data)
            .then(function(res) {
                $scope.isLoading = false;
                angular.element('#noteModal').modal('show');
                if (res.data.notes && res.data.notes.length > 0) {
                    $scope.note.content = res.data.notes;
                    $scope.noteAction = true;
                } else {
                    $scope.note.content = '';
                    $scope.noteAction = false;
                }
            });
    }

    /**
     *Save note
     *@param type = save, delete
     */
    $scope.saveNote = function(type) {
        var data = {
            topicId: $scope.data.topicId
        }

        if (type == 'save') {
            data.note = $scope.note.content;
        }

        if (type == 'delete') {
            data.note = '';
        }

        $scope.isLoading = true;
        UserService.savenote(data)
            .then(function(res) {
                $scope.isLoading = false;
                angular.element('#noteModal').modal('hide');
            });
    }



    /**************************************************************************
        
        ############################     Share topic     ##########################

        ***************************************************************************/
    $scope.shareTopic = function() {
        angular.element('#socialModal').modal('show');
        $scope.socialshare = {
            url: config.domain + '#/topic/content/' + $state.params.language + '/' + $state.params.name,
            text: $scope.data.topicDetails.name,
            description: $scope.data.topicDetails.description
        }
    }

    /**************************************************************************

    ##############################     Comments     ###########################

    ***************************************************************************/


    $scope.commentLimit = 5;

    $scope.readMoreComment = function($event) {
        $scope.commentLimit = $scope.data.comments.length;
        $($event.target).hide();
    }

    $scope.comment = {
        comments: '',
        ratingStars: 0,
    }

    /**
     *Post your comment
     */
    $scope.postComment = function() {
        var data = {
            topicId: $scope.data.topicId,
            comments: $scope.comment.comments,
            ratingStars: $scope.comment.ratingStars
        }
        $scope.isLoading = true;
        UserService.createComment(data)
            .then(function(res) {
                $scope.isLoading = false;
                if (res.data.statusCode == 200) {
                    $scope.commentMsg = res.data.customMessage;

                    $timeout(function() {
                        $scope.commentMsg = false;
                    }, 3000);

                    $scope.addNewComment(data);

                    $scope.comment = {
                        comments: '',
                        ratingStars: 0,
                    }
                }
            });
    }

    /**
     *Add new comment in list
     */
    $scope.addNewComment = function(data) {
        var newCommnent = {
            ratingStars: data.ratingStars,
            comments: data.comments,
            customerId: {
                firstName: $scope.user.firstName,
                lastName: $scope.user.lastName,
                emailId: $scope.user.email,
                profilePicUrl: $scope.user.profilePicUrl
            }
        }
        $scope.data.comments.push(newCommnent);
    }


    /**************************************************************************

    ###################     Mark favourite, Unmark favourite    ################

    ***************************************************************************/

    /**
     *Toggle favourite
     *@param $event = clicked element
     */
    $scope.toggleFavourite = function($event) {

        var data = {
            topicId: $scope.data.topicId
        }

        if (angular.element($event.target).hasClass('favorite')) {
            $scope.unmarkFavourite(data, $event);
        } else {
            $scope.markFavourite(data, $event);
        }
    }

    /**
     *Mark favourite
     *@param data = topic id, customer id
     *@param $event = clicked element
     */
    $scope.markFavourite = function(data, $event) {
        $scope.isLoading = true;
        UserService.markFavourite(data)
            .then(function(res) {
                $scope.isLoading = false;
                if (res.status == 200) {
                    angular.element($event.target).addClass('favorite');
                }
            });
    }

    /**
     *Unmark favourite
     *@param data = topic id, customer id
     *@param $event = clicked element
     */
    $scope.unmarkFavourite = function(data, $event) {
        $scope.isLoading = true;
        UserService.unmarkFavourite(data)
            .then(function(res) {
                $scope.isLoading = false;
                if (res.status == 200) {
                    angular.element($event.target).removeClass('favorite');
                }
            });
    }


    /**************************************************************************

    ########################     Change Topic Language    ######################

    ***************************************************************************/
    /**
     *Change topic language
     */
    $scope.changeTopicLanguage = function($event) {
        if ($scope.topicLanguage) {
            $state.go($state.current.name, {
                'language': $scope.topicLanguage,
                'name': $state.params.name
            });

            $scope.obj.topicLanguage = $scope.topicLanguage;
            $scope.getTopicDetail($scope.obj);
        }
    }


    /**************************************************************************

    #############################     Buy topic    ############################

    ***************************************************************************/
    /**
     *Buy topic 
     */
    $scope.buyTopic = function() {
        var data = {
            topicCart: []
        }
        data.topicCart.push(parseInt($scope.data.topicId));
        $scope.isLoading = true;
        UserService.addToCart(data, 'TOPIC')
            .then(function(res) {
                $scope.isLoading = false;
                if (res.data.statusCode == 200) {
                    $state.go('cart');
                }
            });
    }





    /**************************************************************************

    ########################### Get engagement hours ##########################

    ***************************************************************************/

    var engagementHoursStart = new Date();
    $scope.$on('$locationChangeStart', function(event, next, current) {
        if ($state.current.name != 'library.topics') {
            var engagementHoursEnd = new Date();
            var engagementHours = (((engagementHoursEnd.valueOf() - engagementHoursStart.valueOf()) / 1000) / 60).toFixed(2);
            if ($scope.data) {
                var id = $scope.data.topicId;
            }
            var analysisData = {
                topicId: id,
                engangedTime: engagementHours
            }
            UserService.addAnalysisData(analysisData)
                .then(function(res) {});
        }
    })







    /**************************************************************************

    ###########################################################################

    ***************************************************************************/
    /**
     *Set page height
     */
    angular.element('.page-wrapper').css({ 'minHeight': ($window.innerHeight - (parseInt(angular.element('header.navbar').outerHeight()) + 37)) + 'px' });
    angular.element($window).bind('resize', function() {
        angular.element('.page-wrapper').css({ 'minHeight': ($window.innerHeight - (parseInt(angular.element('header.navbar').outerHeight()) + 37)) + 'px' });
    });

}]);

app.controller('myLibraryTopicsCtrl', ['$scope', '$state', 'UserService', 'share', '$window', '$timeout', 'config', function($scope, $state, UserService, share, $window, $timeout, config) {

    /*Get Page*/
    if ($state.params.name) {
        $scope.page = {
            name: $state.params.name,
            type: 'PACKAGE_DETAIL'
        }
    } else {
        $scope.page = {
            name: 'Topics',
            type: 'TOPICS'
        }
    }

    $scope.$emit('page', $scope.page);


    $scope.renewType = $state.params.renew;
    $scope.$emit('renewType', $state.params.renew);


    /** 
     *Filter object
     */
    $scope.filterBy = {
        curriculum: [],
        language: [],
        grade: [],
        subject: [],
        chapter: []
    };


    /** 
     *Get topic by 
     */
    $scope.data = {
        customerId: $scope.user.customerId,
        offset: 0,
        limit: 20,
        language: $scope.filterBy.language,
        board: $scope.filterBy.curriculum,
        grade: $scope.filterBy.grade,
        subject: $scope.filterBy.subject,
        chapter: $scope.filterBy.chapter
    }

    /**
     *Search topics by state param name 'search'
     */
    if ($state.params.search) {
        $scope.$emit('search', $state.params.search);
        $scope.data.search = $state.params.search;
    } else {
        $scope.$emit('search', '');
    }


    $scope.topics = [];
    $scope.count = 0;

    /** 
     *Get topics filter data
     */
    $scope.getFilters = function() {
        var data = {
            curriculum: $scope.filterBy.curriculum,
            language: $scope.filterBy.language,
            grade: $scope.filterBy.grade,
            subject: $scope.filterBy.subject
        };
        UserService.getFilters({ filter: data })
            .then(function(res) {
                if (res.status == 200) {
                    $scope.filters = res.data;
                }
            });
    }

    /** 
     *Initialize get topic filter function
     */
    $scope.getFilters();


    /** 
     *Get my topics
     *param data = customerid, offset, limit, language, board, grade, subject, chapter
     */
    $scope.getCustomerTopicPackages = function(data) {
        if ($scope.data.offset > $scope.count || $scope.loading == true) {
            return false;
        }
        $scope.loading = true;
        UserService.getCustomerTopicPackages(data)
            .then(function(res) {
                $scope.loading = false;
                if (res.status == '200') {
                    if (res.data.topics.data) {
                        $scope.topicSuccess(res.data.topics.data.topicLibrary, res.data.topics.count);
                    }
                    $scope.setFilter('curriculum');
                    $scope.setFilter('language');
                    $scope.setFilter('grade');
                    $scope.setFilter('subject');
                    $scope.setFilter('chapter');
                    $scope.breadCrumbFilter();

                }
            });
    }


    /*get Package Info Topics*/
    $scope.getPackageInfo = function(data) {
        if ($scope.data.offset > $scope.count || $scope.loading == true) {
            return false;
        }
        $scope.loading = true;
        UserService.getPackageInfo(data)
            .then(function(res) {
                $scope.loading = false;
                if (res.data.statusCode == '200') {
                    if (Object.keys(res.data.data).length != 0) {
                        $scope.topicSuccess(res.data.data.topicLibrary, res.data.count);
                    }
                    $scope.setFilter('subject');
                    $scope.setFilter('chapter');
                    $scope.breadCrumbFilter();
                }
            });
    }




    /** 
     *Get my topics success result
     *param data = get data of topicSuccess Api
     *param count = total count of topics
     */
    $scope.topicSuccess = function(data, count) {
        $scope.count = count;
        $scope.data.offset = $scope.data.offset + $scope.data.limit;
        $scope.topics.push.apply($scope.topics, data);
        angular.forEach(data, function(value, key) {
            //value.icon = 'https://' + value.icon.replace(/^http?\:\/\//i, "");
            $scope.topics.push.apply(value);
        });

        if ($scope.page.type == 'PACKAGE_DETAIL') {
            $scope.packageName = data[0].board + ', ' + data[0].grade;
        }


    }


    if ($state.params.id) {
        $scope.data.packageId = $state.params.id;

        if ($state.params.pack) {
            $scope.data.packageType = $state.params.pack;
        }

        /** 
         *Initialize get my topics
         *param $scope.data = customerid,package id, package type, offset, limit, language, board, grade, subject, chapter
         */

        $scope.getPackageInfo($scope.data);

        /** 
         *Initialize get my topics when scroll page
         *param $scope.data = customerid,package id, package type, offset, limit, language, board, grade, subject, chapter
         */
        angular.element($window).bind('scroll', function(e) {
            var scrollHeight = $(document).height();
            var scrollPosition = $($window).height() + $($window).scrollTop();
            if ((scrollHeight - scrollPosition) / scrollHeight === 0) {
                $scope.getPackageInfo($scope.data);
            }
        });

    } else {

        /** 
         *Initialize get my topics
         *param $scope.data = customerid, offset, limit, language, board, grade, subject, chapter
         */
        $scope.getCustomerTopicPackages($scope.data);

        /** 
         *Initialize get my topics when scroll page
         *param $scope.data = customerid, offset, limit, language, board, grade, subject, chapter
         */
        angular.element($window).bind('scroll', function(e) {
            var scrollHeight = $(document).height();
            var scrollPosition = $($window).height() + $($window).scrollTop();
            if ((scrollHeight - scrollPosition) / scrollHeight === 0) {
                $scope.getCustomerTopicPackages($scope.data);
            }
        });
    }


    /**************************************************************************
        
    ###############################    Filter    ##############################

    ***************************************************************************/


    $scope.filterBoard = function(value) {
        if ($scope.filterBy.curriculum[0] == value) {
            $scope.filterBy.curriculum = [];
        } else {
            $scope.filterBy.curriculum[0] = value;
        }
    }
    $scope.filterChange = function() {
        $scope.data.offset = 0;
        $scope.count = 0;
        $scope.topics = [];

        $scope.getFilters();
        if ($scope.page.type == 'TOPICS') {
            $scope.getCustomerTopicPackages($scope.data);
        }
        if ($scope.page.type == 'PACKAGE_DETAIL') {
            $scope.getPackageInfo($scope.data);
        }

    }


    $scope.$watchCollection('filterBy.curriculum', function(oldValue, newValue) {
        if (oldValue != newValue) {
            $scope.data.board = $scope.filterBy.curriculum;
            $scope.filterChange();
        }
    });

    $scope.$watchCollection('filterBy.language', function(oldValue, newValue) {
        if (oldValue != newValue) {
            $scope.filterChange();
        }
    });

    $scope.$watchCollection('filterBy.grade', function(oldValue, newValue) {
        if (oldValue != newValue) {
            $scope.filterChange();
        }
    });

    $scope.$watchCollection('filterBy.subject', function(oldValue, newValue) {
        if (oldValue != newValue) {
            $scope.filterChange();
        }
    });

    $scope.$watchCollection('filterBy.chapter', function(oldValue, newValue) {
        if (oldValue != newValue) {
            $scope.filterChange();
        }
    });


    /*Set Filters*/
    $scope.setFilter = function(name) {
        angular.forEach($scope.filterBy, function(value, key) {
            if (key == name) {
                $scope.filterCount = value.length;
                $scope.setFilterCount($scope.filterCount, name);
            }
        });
    }

    /*Set Filter Count*/
    $scope.setFilterCount = function(count, name) {
        if (name == 'curriculum' && count != 0) { $scope.filterCurriculumCount = '(' + count + ')' } else if (name == 'curriculum') { $scope.filterCurriculumCount = '' }
        if (name == 'language' && count != 0) { $scope.filterLanguageCount = '(' + count + ')' } else if (name == 'language') { $scope.filterLanguageCount = '' }
        if (name == 'grade' && count != 0) { $scope.filterGradeCount = '(' + count + ')' } else if (name == 'grade') { $scope.filterGradeCount = '' }
        if (name == 'subject' && count != 0) { $scope.filterSubjectCount = '(' + count + ')' } else if (name == 'subject') { $scope.filterSubjectCount = '' }
        if (name == 'chapter' && count != 0) { $scope.filterChapterCount = '(' + count + ')' } else if (name == 'chapter') { $scope.filterChapterCount = '' }
    }

    $scope.breadCrumbFilter = function() {
        $scope.breadCrumbFilterData = [];
        angular.forEach($scope.filterBy, function(value, key) {
            if (value.length != 0) {
                if (key == 'curriculum') { $scope.breadCrumbFilterData.push({ 'curriculum': value }) }
                if (key == 'language') { $scope.breadCrumbFilterData.push({ 'language': value }) }
                if (key == 'grade') { $scope.breadCrumbFilterData.push({ 'grade': value }) }
                if (key == 'subject') { $scope.breadCrumbFilterData.push({ 'subject': value }) }
                if (key == 'chapter') { $scope.breadCrumbFilterData.push({ 'chapter': value }) }
            }
        });
    }

    /*Remove Filter Data*/
    $scope.removeFilterBy = function(k, v) {
        angular.forEach($scope.filterBy, function(value, key) {
            if (key == k) {
                var i = value.indexOf(v);
                value.splice(i, 1);
                $scope.data.offset = 0;
            }
        });
    }

    /*Clear Filter*/
    $scope.clearFilter = function() {
        share.clear('topicFilter');
        $scope.filterBy = {
            curriculum: [],
            language: [],
            grade: [],
            subject: [],
            chapter: []
        };
        $scope.data.language = $scope.filterBy.language;
        $scope.data.board = $scope.filterBy.curriculum;
        $scope.data.grade = $scope.filterBy.grade;
        $scope.data.subject = $scope.filterBy.subject;
        $scope.data.chapter = $scope.filterBy.chapter;
    }


    /**************************************************************************
        
    ############################    Share Topics    ###########################

    ***************************************************************************/

    $scope.shareTopic = function(data) {
        /*Social Share content*/
        $scope.socialshare = {
            url: config.domain + '#/topic/content/' + data.language + '/' + data.name,
            text: data.name,
            description: data.description
        }
        $('#socialModal').modal('show');
    }



    /**************************************************************************
        
    ##################    Mark favourite, Unmark favourite   ##################

    ***************************************************************************/

    /** 
     *favorite topics object
     */
    $scope.favoriteData = {
        customerId: $scope.user.customerId
    }

    /** 
     *Toggle favourite topics
     *@param id = topic id
     *@param $event = favourite button element
     */
    $scope.toggleFavourite = function(id, $event) {
        $scope.favoriteData.topicId = id;
        $scope.loading = true;
        if (angular.element($event.target).hasClass('favorite')) {
            $scope.unmarkFavourite(id, $event);
        } else {
            $scope.markFavourite(id, $event);
        }
    }

    /** 
     *Mark favourite topics
     *@param id = topic id
     *@param $event = favourite button element
     */
    $scope.markFavourite = function(id, $event) {
        $scope.favoriteData.topicId = id;
        UserService.markFavourite($scope.favoriteData)
            .then(function(res) {
                $scope.loading = false;
                if (res.status == 200) {
                    angular.element($event.target).addClass('favorite');
                }
            });
    }

    /** 
     *Unmark favourite topics
     *@param id = topic id
     *@param $event = favourite button element
     */
    $scope.unmarkFavourite = function(id, $event) {
        $scope.favoriteData.topicId = id;
        UserService.unmarkFavourite($scope.favoriteData)
            .then(function(res) {
                $scope.loading = false;
                if (res.status == 200) {
                    angular.element($event.target).removeClass('favorite');
                }
            });
    }


    /**************************************************************************
        
    ###############################    Search     #############################

    ***************************************************************************/
    /**
     *Clear Search
     */
    $scope.clearSearch = function() {
        $state.go($state.current.name, {
            'search': ''
        });
    }


    /**************************************************************************
        
    ###############################    Renew      #############################

    ***************************************************************************/

    $scope.renewData = {
        topicId: [],
        packageId: $state.params.id
    }

    if ($state.params.pack) {
        $scope.renewData.packageType = $state.params.pack;
    } else {
        $scope.renewData.packageType = config.packageType[2];
    }

    /**
     *Renew package
     */

    $scope.$parent.renewExpirey = function() {

        if ($scope.renewData.topicId.length == 0) {
            alert(config.message.selectTopics);
            return false;
        }

        $scope.isLoading = true;
        UserService.renewExpirey($scope.renewData)
            .then(function(res) {
                $scope.isLoading = false;
                if (res.status == 200) {
                    if (res.data.type == 'RENEW_FAIL') {
                        $scope.message = res.data.customMessage;
                        $timeout(function() {
                            $scope.message = false;
                        }, 3000);
                    } else {
                        $state.go('cart');
                    }

                }
            });
    }



    /**************************************************************************
        
    ###########################################################################

    ***************************************************************************/

    /*Set Fixed Header onScroll*/
    angular.element($window).bind('scroll', function(e) {
        if (angular.element('#fixedTopBar').prop('offsetTop') <= this.pageYOffset) {
            angular.element('#fixedTopBar').addClass('listwithFiilter');
        } else {
            angular.element('#fixedTopBar').removeClass('listwithFiilter');
        }
    });

    /*Open always one Filter Tab*/
    $scope.filterTab = function($event) {
        if ($($event.target).parents('.panel').children('.panel-collapse').hasClass('in')) {
            $event.preventDefault();
            $event.stopPropagation();
        }
    }

}]);

app.controller('libraryTopicsCtrl', ['$scope', 'UserService', '$state', '$window', 'share', 'config', function($scope, UserService, $state, $window, share, config) {

    /*Get Page*/
    if ($state.current.name == "library.topics") {
        $scope.page = {
            name: 'All Topics',
            type: 'all'
        }
    } else if ($state.current.name == "library.bestsellers") {
        $scope.page = {
            name: 'Best Sellers',
            type: 'best'
        }
    } else if ($state.current.name == "library.newrelease") {
        $scope.page = {
            name: 'New Release',
            type: 'new'
        }
    } else if ($state.current.name == "library.freetopics") {
        $scope.page = {
            name: 'Free Topics',
            type: 'free'
        }
    } else if ($state.current.name == "library.favourite") {
        $scope.page = {
            name: 'Favorite',
            type: 'favourite'
        }
    } else if ($state.current.name == "library.history") {
        $scope.page = {
            name: 'History',
            type: 'history'
        }
    } else if ($state.current.name == "library.package") {
        $scope.page = {
            name: 'Package Detail',
            type: 'packagedetail'
        }
    } else {
        $state.go('library.topics');
    }


    if (share.getObject('topicFilter')) {
        $scope.filterBy = share.getObject('topicFilter');
    } else {
        $scope.filterBy = {
            curriculum: [],
            language: [],
            grade: [],
            subject: [],
            chapter: []
        };
    }


    $scope.$emit('page', $scope.page);


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
     * Get package list
     */
    $scope.getPackages = function() {
        UserService.getPackage()
            .then(function(res) {
                if (res.status == 200) {
                    $scope.offers = res.data.openPackage;
                }
            });
    }

    /** 
     *Initialize get package function
     */
    $scope.getPackages();





    $scope.data = {
        offset: 0,
        limit: 20,
        language: $scope.filterBy.language,
        board: $scope.filterBy.curriculum,
        grade: $scope.filterBy.grade,
        subject: $scope.filterBy.subject,
        chapter: $scope.filterBy.chapter
    }


    /**
     *Get search param
     */
    if ($state.params.search) {
        $scope.$emit('search', $state.params.search);
        $scope.data.search = $state.params.search;
    } else {
        $scope.$emit('search', '');
    }


    $scope.topics = [];
    $scope.count = 0;

    $scope.topicCategoryArrayList = {
        contentName: [],
        categoryName: []
    }


    /** 
     *Get topics
     *@param data = customerid, offset, limit, language, board, grade, subject, chapter
     *@param type = all, best, new, free, favourite, history
     */
    $scope.topicLibrary = function(data, type) {
        if ($scope.data.offset > $scope.count || $scope.loading == true) {
            return false;
        }

        $scope.loading = true;
        UserService.topics(data, type)
            .then(function(res) {
                $scope.loading = false;
                if (res.data.statusCode == '200') {

                    if ($scope.user.type == config.userType[2]) {
                        $scope.topicCategory = {
                            categoryName: res.data.categoryName,
                            contentName: res.data.contentName
                        }
                    } else {
                        $scope.topicCategory = false;
                    }

                    $scope.topicSuccess(res.data.data.topicLibrary, res.data.count);
                    $scope.setFilter('curriculum');
                    $scope.setFilter('language');
                    $scope.setFilter('grade');
                    $scope.setFilter('subject');
                    $scope.setFilter('chapter');
                    $scope.breadCrumbFilter();

                }
            });
    }


    /** 
     *Get topics by package id
     *@param data = customerid, package id, offset, limit, language, board, grade, subject, chapter
     */
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
     *Get topics sucess result
     *@param data = res api
     *@count = total data limit
     */
    $scope.topicSuccess = function(data, count) {
        $scope.count = count;
        $scope.data.offset = $scope.data.offset + $scope.data.limit;
        /*$scope.topics.push.apply($scope.topics, data);*/
        angular.forEach(data, function(value, key) {
            //value.icon = 'https://' + value.icon.replace(/^http?\:\/\//i, "");
            if ($scope.user.type == config.userType[2]) {
                angular.forEach(value.mergedObject, function(merged, key1) {
                    if (Object.keys($scope.agentTopics.topicArray).indexOf(key1) == -1) {
                        $scope.agentTopics.topicArray[key1] = {
                            categoryName: [],
                            contentType: [],
                            topicId: key1,
                        };

                        if ($scope.topicCategoryArrayList.contentName.length > 0) {
                            angular.forEach($scope.topicCategoryArrayList.contentName, function(content) {
                                if ($scope.agentTopics.topicArray[key1].contentType.indexOf(content) == -1) {
                                    $scope.agentTopics.topicArray[key1].contentType.push(content);
                                }
                            })
                        }
                        if ($scope.topicCategoryArrayList.categoryName) {
                            angular.forEach($scope.topicCategoryArrayList.categoryName, function(category) {
                                if ($scope.agentTopics.topicArray[key1].categoryName.indexOf(category) == -1) {
                                    $scope.agentTopics.topicArray[key1].categoryName.push(category);
                                }
                            })
                        }
                    }
                });
            }
            $scope.topics.push(value);

        });

        if ($scope.page.type == 'packagedetail') {
            $scope.packageName = data[0].board + ', ' + data[0].grade;
        }







    }

    if ($scope.page.type == 'all' || $scope.page.type == 'best' || $scope.page.type == 'new' || $scope.page.type == 'free' || $scope.page.type == 'favourite' || $scope.page.type == 'history') {

        /** 
         *Initialize get topic library function
         *@param $scope.data = customerid, offset, limit, language, board, grade, subject, chapter
         *@param $scope.page.type
         */
        $scope.topicLibrary($scope.data, $scope.page.type);

        /** 
         *Initialize get topic library function when scroll page
         *param $scope.data = customerid, offset, limit, language, board, grade, subject, chapter
         *@param $scope.page.type
         */
        angular.element($window).bind('scroll', function(e) {
            var scrollHeight = $(document).height();
            var scrollPosition = $($window).height() + $($window).scrollTop();
            if ((scrollHeight - scrollPosition) / scrollHeight === 0) {
                $scope.topicLibrary($scope.data, $scope.page.type);
            }
        });
    }



    if ($scope.page.type == 'packagedetail') {

        /**
         *Get package id
         */
        $scope.data.packageId = $state.params.id;


        if ($state.params.pack) {
            $scope.data.packageType = $state.params.pack;
        }


        /** 
         *Initialize get package info function
         *@param $scope.data = customerid, offset, limit, language, board, grade, subject, chapter
         */
        $scope.getPackageInfo($scope.data);

        /** 
         *Initialize get package info function when scroll page
         *param $scope.data = customerid, offset, limit, language, board, grade, subject, chapter
         */
        angular.element($window).bind('scroll', function(e) {
            var scrollHeight = $(document).height();
            var scrollPosition = $($window).height() + $($window).scrollTop();
            if ((scrollHeight - scrollPosition) / scrollHeight === 0) {
                $scope.getPackageInfo($scope.data);
            }
        });
    }


    /**************************************************************************
        
    ###############################    Search     #############################

    ***************************************************************************/

    /*Search page data
     */
    if ($scope.user.type == config.userType[2]) {
        $scope.$parent.search = function() {
            $scope.data.search = $scope.searchItem;
            /** 
             *Initialize get topic library function
             *@param $scope.data = customerid, offset, limit, language, board, grade, subject, chapter
             *@param $scope.page.type
             */
            $scope.data.offset = 0;
            $scope.count = 0;
            $scope.topics = [];
            $scope.topicLibrary($scope.data, $scope.page.type);
        }
    }


    /**
     *Clear Search
     */
    if ($scope.user.type != config.userType[2]) {
        $scope.clearSearch = function() {
            $state.go($state.current.name, {
                'search': ''
            });
        }
    }

    if ($scope.user.type == config.userType[2]) {
        $scope.clearSearch = function() {
            $scope.data.search = '';
            $scope.data.offset = 0;
            $scope.count = 0;
            $scope.topics = [];
            $scope.topicLibrary($scope.data, $scope.page.type);
        }
    }


    /**************************************************************************
        
    ##############################    Filters     #############################

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

        if ($scope.page.type == 'packagedetail') {
            $scope.getPackageInfo($scope.data);
        }
        if ($scope.page.type == 'all' || $scope.page.type == 'best' || $scope.page.type == 'new' || $scope.page.type == 'free' || $scope.page.type == 'favourite' || $scope.page.type == 'history') {

            $scope.getFilters();


            $scope.topicLibrary($scope.data, $scope.page.type);
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
        share.setObject('topicFilter', $scope.filterBy);
        $scope.filterName = share.getObject('topicFilter');
        angular.forEach(share.getObject('topicFilter'), function(value, key) {
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
        angular.forEach(share.getObject('topicFilter'), function(value, key) {
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


    /*Show Filter Popup*/
    $scope.filterPopupShow = function() {
        $('.data-filter').addClass('show');
        $scope.FilterDone = true;
        angular.element('html').addClass('filterApply');
    }

    /*Hide Filter Popup*/
    $scope.filterPopupHide = function() {
        $('.data-filter').removeClass('show');
        $scope.FilterDone = false;
        angular.element('html').removeClass('filterApply');
    }




    /*Open always one Filter Tab*/
    $scope.filterTab = function($event) {
        if ($($event.target).parents('.panel').children('.panel-collapse').hasClass('in')) {
            $event.preventDefault();
            $event.stopPropagation();
        }
    }


    /**************************************************************************
        
    #########################    Buy Topics Start     #########################

    ***************************************************************************/
    /** 
     *Add to buy topics object for student and teacher
     */
    $scope.buyTopic = {
        topicCart: []
    };

    /** 
     *Add to buy topics object for agent
     */
    $scope.agentBuyTopics = {
        topicArray: {}
    }


    /**
     * watch collection for add to buy topics
     */
    $scope.$watchCollection('buyTopic.topicCart', function(oldValue, newValue) {
        if (oldValue != newValue) {

            $scope.buyTopicCount();

            if ($scope.buyTopic.topicCart.length > 0) {
                $scope.buyLength = '(' + $scope.buyTopic.topicCart.length + ')';
                $scope.getOffers($scope.buyTopic.topicCart.length);
            } else {
                $scope.buyLength = '';
            }

        }
    });


    /**
     *Add to buy topic count
     */
    $scope.buyTopicCount = function() {
        if ($scope.buyTopic.topicCart.length == 0) {
            $scope.buyLength = false;
        } else {
            $scope.buyLength = '(' + $scope.buyTopic.topicCart.length + ')';
        }
        $scope.$emit('buyLength', $scope.buyLength);
    }

    /**
     * Add to cart
     */
    $scope.$parent.addToCart = function() {
        if ($scope.buyLength == 0 || $scope.buyLength == undefined) {
            alert('Please select topics.');
            return false;
        } else {
            $scope.Loading = true;
            if ($scope.user.type == config.userType[2]) {
                UserService.addToCart($scope.agentBuyTopics, 'TOPIC')
                    .then(function(res) {
                        $scope.Loading = false;
                        if (res.data.statusCode == 200) {
                            $state.go('cart');
                        }
                    });

            } else {
                UserService.addToCart($scope.buyTopic, 'TOPIC')
                    .then(function(res) {
                        $scope.Loading = false;
                        if (res.data.statusCode == 200) {
                            $state.go('cart');
                        }
                    });
            }
        }
    }


    /**************************************************************************
        
    #########    Mark favourite, Unmark favourite, Delete favourite   #########

    ***************************************************************************/

    /** 
     *favorite topics object
     */
    $scope.favoriteData = {}



    /** 
     *Toggle favourite topics
     *@param id = topic id
     *@param $event = favourite button element
     */
    $scope.toggleFavourite = function(id, $event) {
        $scope.favoriteData.topicId = id;
        $scope.Loading = true;
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
                $scope.Loading = false;
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
                $scope.Loading = false;
                if (res.status == 200) {
                    angular.element($event.target).removeClass('favorite');
                }
            });
    }

    /** 
     *Delete favourite topic
     *@param id = topic id
     *@param $event = favourite button element
     */
    $scope.deleteFavourite = function(id) {
        $scope.favoriteData.topicId = id;
        $scope.Loading = true;
        UserService.unmarkFavourite($scope.favoriteData)
            .then(function(res) {
                $scope.Loading = false;
                if (res.status == 200) {
                    angular.forEach($scope.topics, function(value, key) {
                        if (value.Id == id) {
                            var i = $scope.topics.indexOf(value);
                            $scope.topics.splice(i, 1);
                            angular.element(this).parents('.topics').remove();
                        }
                    });
                }
            });
    }



    /**************************************************************************
        
    ###############################    Offers    ##############################

    ***************************************************************************/


    /** 
     *Get offers
     *@param length = selected topic length
     */

    $scope.getOffers = function(length) {
        var count = 2;
        if (length < count) {
            var min = 0;
        } else {
            var min = length - count;
        }
        var max = length + count;
        $scope.offersShow = [];
        angular.forEach($scope.offers, function(value, key) {
            if (min <= value.noOfTopics && max >= value.noOfTopics) {
                $('#offersModal').modal('show');
                $scope.offersShow.push(value);
            }
        });
    }


    /** 
     *Add topic from favorites data
     */
    $scope.addfromFavorites = function() {
        $scope.favoritData = {};
        $scope.Loading = true;
        UserService.topics($scope.favoritData, 'favourite')
            .then(function(res) {
                $scope.Loading = false;
                if (res.status == 200) {
                    $scope.myFavouriteMsg = true;
                    $scope.myFavourite = res.data.data.topicLibrary;
                    $scope.myFavourite.forEach(function(value) {
                        if ($scope.buyTopic.topicCart.indexOf(value.Id) == -1) $scope.buyTopic.topicCart.push(value.Id);
                    });
                }

            });
    }

    /** 
     *Hide offer popup
     */
    $scope.cancelOffer = function() {
        $scope.myFavouriteMsg = false;
        $('#offersModal').modal('hide');
    }





    /**************************************************************************
        
    ############################    Share Topics    ###########################

    ***************************************************************************/
    $scope.shareTopic = function(data) {
        console.log(data);
        /*Social Share content*/
        $scope.socialshare = {
            url: config.domain + '#/topic/content/' + data.language + '/' + data.name,
            text: data.name,
            description: data.description
        }
        $('#socialModal').modal('show');
    }




    /**************************************************************************
        
    ############################    Agent Section   ###########################

    ***************************************************************************/

    $scope.agentTopics = {
        topicArray: {}
    }

    $scope.checkCategory = function($event, topic, val, type) {
        var current = $($event.target);

        var categoryName = $scope.agentTopics.topicArray[topic.topicId].categoryName;
        var contentType = $scope.agentTopics.topicArray[topic.topicId].contentType;

        if (current.prop('checked')) {
            if (type == "categoryName") {
                if (categoryName.indexOf(val) == -1) {
                    categoryName.push(val);
                }
            } else if (type == "contentType") {
                if (contentType.indexOf(val) == -1) {
                    contentType.push(val);
                }
            }
        } else {
            if (type == "categoryName") {
                if (categoryName.indexOf(val) != -1) {
                    categoryName.splice(categoryName.indexOf(val), 1);
                }
            } else if (type == "contentType") {
                if (contentType.indexOf(val) != -1) {
                    contentType.splice(contentType.indexOf(val), 1);
                }
            }
        }


        var len = topic.categoryName.length + topic.contentType.length;
        var checked = categoryName.length + contentType.length;

        var tLength = 0;
        if ($scope.agentTopics.topicArray.hasOwnProperty(topic.topicId)) {
            tLength += $scope.agentTopics.topicArray[topic.topicId].categoryName.length + $scope.agentTopics.topicArray[topic.topicId].contentType.length;
            if (tLength == 0) {
                angular.element($event.target).parents('.topics').find('.topicChecked').prop('checked', false);
                delete $scope.agentBuyTopics.topicArray[topic.topicId];
            }
        }
        if (Object.keys($scope.agentBuyTopics.topicArray).length == 0) {
            $scope.buyLength = false;
            $scope.$emit('buyLength', false);
        } else {
            $scope.buyLength = Object.keys($scope.agentBuyTopics.topicArray).length;
            $scope.$emit('buyLength', $scope.buyLength);
        }
    }



    $scope.agentAddToBuy = function($event, topic) {
        var current = angular.element($event.target);

        var tLength = 0;

        angular.forEach(topic, function(value) {
            if ($scope.agentTopics.topicArray.hasOwnProperty(value.topicId)) {
                tLength += $scope.agentTopics.topicArray[value.topicId].categoryName.length + $scope.agentTopics.topicArray[value.topicId].contentType.length;
                if (tLength > 0 && current.prop('checked') == true) {
                    $scope.agentBuyTopics.topicArray[value.topicId] = $scope.agentTopics.topicArray[value.topicId];
                } else {
                    delete $scope.agentBuyTopics.topicArray[value.topicId];
                }
                if (tLength == 0) {
                    alert('Please select at least 1 category in this topic.');
                    angular.element($event.target).prop('checked', false);
                    return false;
                }

            }

            if (Object.keys($scope.agentBuyTopics.topicArray).length == 0) {
                $scope.buyLength = false;
                $scope.$emit('buyLength', false);
            } else {
                $scope.buyLength = Object.keys($scope.agentBuyTopics.topicArray).length;
                $scope.$emit('buyLength', $scope.buyLength);
            }
        });

    }

    $scope.topicCategoryCheck = function(value, type, method) {
        if (method == 'ADD') {
            angular.forEach($scope.agentTopics.topicArray, function(array) {

                if (type == 'categoryName') {
                    angular.forEach($scope.topics, function(topics) {
                        if (topics.mergedObject[array.topicId] && topics.mergedObject[array.topicId].categoryName.indexOf(value) != -1 && array.categoryName.indexOf(value) == -1) {
                            array.categoryName.push(value);
                        }
                    })
                } else if (type == 'contentName') {
                    angular.forEach($scope.topics, function(topics) {
                        if (topics.mergedObject[array.topicId] && topics.mergedObject[array.topicId].contentType.indexOf(value) != -1 && array.contentType.indexOf(value) == -1) {
                            array.contentType.push(value);
                        }
                    })
                }


            })
        } else if (method == 'REMOVE') {
            angular.forEach($scope.agentTopics.topicArray, function(array) {
                if (type == 'categoryName') {
                    if (array.categoryName.indexOf(value) != -1) {
                        array.categoryName.splice(value, 1);
                    }
                } else if (type == 'contentName') {
                    if (array.contentType.indexOf(value) != -1) {
                        array.contentType.splice(value, 1);
                    }
                }
            })
        }
    }


    $scope.compareArray = function(value1, value2) {
        if (value1.length > value2.length) {
            angular.forEach(value1, function(value) {
                if (value2.indexOf(value) == -1) {
                    return value;
                }
            })
        }
    }


    $scope.$watchCollection('topicCategoryArrayList.contentName', function(oldValue, newValue) {
        if (oldValue != newValue) {



            if (oldValue.length > newValue.length) {
                angular.forEach(oldValue, function(value) {
                    if (newValue.indexOf(value) == -1) {
                        $scope.topicCategoryCheck(value, 'contentName', 'ADD');
                    }
                })
            } else {
                angular.forEach(newValue, function(value) {
                    if (oldValue.indexOf(value) == -1) {
                        $scope.topicCategoryCheck(value, 'contentName', 'REMOVE');
                    }
                })
            }
        }
    });


    $scope.$watchCollection('topicCategoryArrayList.categoryName', function(oldValue, newValue) {
        if (oldValue != newValue) {

            if (oldValue.length > newValue.length) {
                angular.forEach(oldValue, function(value) {
                    if (newValue.indexOf(value) == -1) {
                        $scope.topicCategoryCheck(value, 'categoryName', 'ADD');
                    }
                })
            } else {
                angular.forEach(newValue, function(value) {
                    if (oldValue.indexOf(value) == -1) {
                        $scope.topicCategoryCheck(value, 'categoryName', 'REMOVE');
                    }
                })
            }
        }
    });



    $scope.allCheckedContent = function($event) {
        var checked = $($event.target).prop('checked');
        $scope.topicCategoryArrayList.categoryName = [];
        $scope.topicCategoryArrayList.contentName = [];

        if (checked) {
            angular.forEach($scope.topicCategory.categoryName, function(value) {
                $scope.topicCategoryArrayList.categoryName.push(value);
                $scope.topicCategoryCheck(value, 'categoryName', 'ADD');
            })
            angular.forEach($scope.topicCategory.contentName, function(value) {
                $scope.topicCategoryArrayList.contentName.push(value);
                $scope.topicCategoryCheck(value, 'contentName', 'ADD');
            })
        } else {
            angular.forEach($scope.agentTopics.topicArray, function(value) {
                value.categoryName = [];
                value.contentType = [];
            })
        }
    }


    $scope.ifChecked = function(data) {
        $scope.selectedTopics = [];
        if (Object.getOwnPropertyNames($scope.agentBuyTopics.topicArray).length > 0) {
            angular.forEach(data, function(topics) {
                angular.forEach(topics.mergedObject, function(value) {
                    if (Object.keys($scope.agentBuyTopics.topicArray).indexOf(value.topicId) != -1) {
                        $scope.selectedTopics.push(topics.name);
                    }
                })
            })
        }
    }


}]);

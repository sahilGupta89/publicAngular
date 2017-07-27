app.controller('libraryBulkTopicsCtrl', ['$scope', 'UserService', '$state', '$window', 'share', 'config', function($scope, UserService, $state, $window, share, config) {

    /*Get Page*/
    $scope.page = {
        name: 'Bulk purchase',
        type: 'BULK'
    }

    $scope.$emit('page', $scope.page);
    $scope.$emit('buyLength', '');

    $scope.data = {
        board: [],
        language: [],
        grade: [],
        subject: [],
        chapter: [],
        categoryName: [],
        contentType: []
    };


    $scope.content = {
        curriculum: [],
        language: [],
        grade: [],
        subject: [],
        chapter: []
    };

    /**
     *Get Topics category and content
     */
    $scope.getTopicsCategoryandContent = function() {
        var data = {
            customerId: $scope.user.customerId,
            offset: 0,
            limit: 0,
        }
        $scope.isLoading = true;
        UserService.topics(data, 'all')
            .then(function(res) {
                $scope.isLoading = false;
                if (res.data.statusCode == '200') {
                    $scope.bulkData = {
                        categoryName: res.data.categoryName,
                        contentName: res.data.contentName
                    }
                }
            });
    }


    /**
     *Initialize
     */
    $scope.getTopicsCategoryandContent();


    /** 
     *Get topics filter data
     */
    $scope.getFilters = function(data) {
        var data = {
            language: $scope.data.language,
            curriculum: $scope.data.board,
            grade: $scope.data.grade,
            subject: $scope.data.subject
        };
        $scope.isLoading = true;
        UserService.getFilters({ filter: data })
            .then(function(res) {
                if (res.status == 200) {
                    $scope.isLoading = false;

                    angular.forEach(res.data.languageList, function(value, key) {
                        if ($scope.content.language.indexOf(value.language) == -1) {
                            $scope.content.language.push(value.language);
                        }
                    })

                    if ($scope.data.language.length > 0) {
                        angular.forEach(res.data.boardList, function(value, key) {
                            if ($scope.content.curriculum.indexOf(value.board) == -1) {
                                $scope.content.curriculum.push(value.board);
                            }
                        })
                    }


                    if ($scope.data.board.length > 0) {
                        angular.forEach(res.data.gradeList, function(value, key) {
                            if ($scope.content.grade.indexOf(value.grade) == -1) {
                                $scope.content.grade.push(value.grade);
                            }
                        })
                    }

                    if ($scope.data.grade.length > 0) {
                        angular.forEach(res.data.subjectList, function(value, key) {
                            if ($scope.content.subject.indexOf(value.subject) == -1) {
                                $scope.content.subject.push(value.subject);
                            }
                        })
                    }

                    if ($scope.data.subject.length > 0) {
                        angular.forEach(res.data.chapterList, function(value, key) {
                            if ($scope.content.chapter.indexOf(value.chapter) == -1) {
                                $scope.content.chapter.push(value.chapter);
                            }
                        })
                    }

                }
            });
    }

    $scope.getFilters();


    $scope.$watchCollection('data.language', function(oldValue, newValue) {
        if (oldValue != newValue) {
            $scope.content.curriculum = [];
            $scope.content.grade = [];
            $scope.content.subject = [];
            $scope.content.chapter = [];

            $scope.data.board = [];
            $scope.data.grade = [];
            $scope.data.subject = [];
            $scope.data.chapter = [];

            $scope.getFilters();
        }
    });
    $scope.$watchCollection('data.board', function(oldValue, newValue) {
        if (oldValue != newValue) {
            $scope.content.grade = [];
            $scope.content.subject = [];
            $scope.content.chapter = [];

            $scope.data.grade = [];
            $scope.data.subject = [];
            $scope.data.chapter = [];

            $scope.getFilters();
        }
    });
    $scope.$watchCollection('data.grade', function(oldValue, newValue) {
        if (oldValue != newValue) {
            $scope.content.subject = [];
            $scope.content.chapter = [];

            $scope.data.subject = [];
            $scope.data.chapter = [];

            $scope.getFilters();
        }
    });
    $scope.$watchCollection('data.subject', function(oldValue, newValue) {
        if (oldValue != newValue) {
            $scope.content.chapter = [];
            $scope.data.chapter = [];
            $scope.getFilters();
        }
    });




    $scope.checkAllCategory = function($event) {
        var checked = $($event.target).prop('checked');
        if (checked) {
            angular.forEach($scope.bulkData.categoryName, function(value) {
                if ($scope.data.categoryName.indexOf(value) == -1) {
                    $scope.data.categoryName.push(value);
                }
            })
            angular.forEach($scope.bulkData.contentName, function(value) {
                if ($scope.data.contentType.indexOf(value) == -1) {
                    $scope.data.contentType.push(value);
                }
            })
        } else {
            $scope.data.categoryName = [];
            $scope.data.contentType = [];
        }
    }




    $scope.addTocart = function() {
        if ($scope.data.language.length == 0) {
            alert(config.message.selectLanguage);
            return false;
        } else if ($scope.data.board.length == 0) {
            alert(config.message.selectCurriculum);
            return false;
        } else if (($scope.data.categoryName.length + $scope.data.contentType.length) == 0) {
            alert(config.message.selectCategory);
            return false;
        } else {
            $scope.isLoading = true;
            UserService.selectAllAddToCart($scope.data)
                .then(function(res) {
                    $scope.isLoading = true;
                    if (res.data.statusCode == 200) {
                        $state.go('cart');
                    }
                });
        }
    }


}]);

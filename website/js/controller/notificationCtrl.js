app.controller('notificationCtrl', ['$scope', '$window', '$rootScope', 'UserService', '$state', 'favicoService', 'config', function($scope, $window, $rootScope, UserService, $state, favicoService, config) {

    /*Check object*/
    if (Object.getOwnPropertyNames($rootScope.globals).length === 2) {
        /*Get current user detail*/
        $scope.user = {
            id: $rootScope.globals.currentUser.data._id
        }
    }



    $scope.data = {
        skip: 0,
        limit: 100
    }
    $scope.count = 0;
    $scope.notification = [];

    /**
     *Get all notification
     */
    $scope.getAllNotifications = function() {
        if ($scope.data.skip > $scope.count || $scope.isLoading) {
            return false;
        }
        $scope.isLoading = true;
        UserService.getAllNotifications($scope.data)
            .then(function(res) {
                if (res.data.statusCode == 200) {
                    $scope.isLoading = false;
                    $scope.data.skip = res.data.limit;
                    $scope.count = res.data.totalNotifications;
                    angular.forEach(res.data.notificationData, function(value, key) {
                        $scope.notification.push(value);
                    });
                    /*$scope.notification = res.data.notificationData*/
                }
            });
    }

    /**
     *Initialize getAllNotifications function
     */
    $scope.getAllNotifications();

    angular.element($window).bind('scroll', function(e) {
        var scrollHeight = $(document).height();
        var scrollPosition = $($window).height() + $($window).scrollTop();
        if ((scrollHeight - scrollPosition) / scrollHeight === 0) {
            $scope.getAllNotifications();
        }
    });



    /**
     *Navigate notifications
     */
    $scope.navigateNotification = function(data) {
        if (data.notificationType == config.notificationType[0]) {
            $state.go('library.topics');
        }

        if (data.notificationType == config.notificationType[1]) {
            $state.go('library.packages');
        }

        if (data.notificationType == config.notificationType[2]) {
            $state.go('profile');
        }

        if (data.notificationType == config.notificationType[3]) {
            $state.go('library.freetopics');
        }

        if (data.notificationType == config.notificationType[4]) {
            $state.go('customer.list');
        }
    }


    /**
     *Set page height
     */
    angular.element('.page-wrapper').css({ 'minHeight': ($window.innerHeight - (parseInt(angular.element('header.navbar').outerHeight()) + 47)) + 'px' });
    angular.element($window).bind('resize', function() {
        angular.element('.page-wrapper').css({ 'minHeight': ($window.innerHeight - (parseInt(angular.element('header.navbar').outerHeight()) + 47)) + 'px' });
    });

}]);

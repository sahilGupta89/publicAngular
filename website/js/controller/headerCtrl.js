app.controller('headerCtrl', ['$scope', '$window', '$rootScope', '$location', 'UserService', 'AuthenticationService', '$translate', '$state', 'favicoService', 'config','share', function($scope, $window, $rootScope, $location, UserService, AuthenticationService, $translate, $state, favicoService, config,share) {

    /*Check object*/
    if (Object.getOwnPropertyNames($rootScope.globals).length === 2) {
        /*Get current user detail*/
        $scope.user = {
            id: $rootScope.globals.currentUser.data._id,
            name: $rootScope.globals.currentUser.data.firstName,
            photo: $rootScope.globals.currentUser.data.profilePicUrl,
            type: $rootScope.globals.currentUser.data.userType,
            accessRights: $rootScope.globals.currentUser.data.accessRights
        }

        /*IF user name not found then user name is email id*/
        if ($scope.user.name == null) {
            $scope.user.name = $rootScope.globals.currentUser.data.emailId;
        }
    }


    /** 
     *Get state name when change state
     */
    $scope.state = $state.current.name;
    $scope.$on('$locationChangeStart', function(event, next, current) {
        $scope.state = $state.current.name;
        angular.element('html').removeClass('sideMenu');
    });



    /**
     *Logout
     */
    $scope.logout = function() {
        AuthenticationService.ClearCredentials();
        share.remove('PxEd');
        $window.location.reload();
    }


    /**
     *Change Languages
     */
    $scope.language = 'en';
    $scope.languages = ['en', 'hi'];
    $scope.updateLanguage = function() {
        $translate.use($scope.language);
    };





    /**
     *Get cart items count
     */
    $scope.cartNumber = function() {
        var data = {
            customerId: $scope.user.id
        }
        UserService.cartNumber(data)
            .then(function(res) {
                $scope.Loading = false;
                if (res.data.statusCode == 200) {
                    $rootScope.cartItem = res.data.items;
                }
            });
    }

    /**
     *Get noitification count
     */
    $scope.notificationsCount = function() {
        UserService.notificationsCount()
            .then(function(res) {
                if (res.data.statusCode == 200) {
                    if (res.data.notificationCount > 0) {
                        $scope.notificationCount = res.data.notificationCount;
                        favicoService.badge($scope.notificationCount);
                    }
                }
            });
    }

    /**
     *Get all notification
     */
    $scope.getAllNotifications = function() {
        $scope.notification = false;
        var data = {
            skip: 0,
            limit: 10
        }
        $scope.isNotification = true;
        UserService.getAllNotifications(data)
            .then(function(res) {
                if (res.data.statusCode == 200) {
                    $scope.isNotification = false;;
                    $scope.notification = res.data.notificationData;
                    $scope.notificationCount = 0;
                    favicoService.badge(0);
                }
            });
    }


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



    if (Object.getOwnPropertyNames($rootScope.globals).length === 2) {
        $scope.notificationsCount();
        $scope.cartNumber();
    }


    /**
     *Side bar menu show hide
     */
    $scope.sideMenu = function(type) {
        if (type == 'show') { angular.element('html').addClass('sideMenu') }
        if (type == 'hide') { angular.element('html').removeClass('sideMenu') }
    }


}]);

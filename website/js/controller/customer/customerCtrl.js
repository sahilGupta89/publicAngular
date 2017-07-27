app.controller('customerCtrl', ['$scope', '$window', '$rootScope', 'UserService', '$state', function($scope, $window, $rootScope, UserService, $state) {

    /**
     *User Object
     */
    if (Object.getOwnPropertyNames($rootScope.globals).length === 2) {
        $scope.user = {
            id: $rootScope.globals.currentUser.data._id,
            type: $rootScope.globals.currentUser.data.userType,
            accessRights: $rootScope.globals.currentUser.data.accessRights
        }
    }


    $scope.$on('page', function(evnt, data) {
        $scope.page = data;
    });
    $scope.$on('count', function(evnt, data) {
        $scope.listCount = data;
    });

    $scope.$on('$locationChangeStart', function(event, next, current) {
        $scope.searchItem = '';
    });


    $scope.shareList = {
        users: []
    }
    $scope.$on('shareList', function(evnt, data) {
        $scope.shareList = data;
    });








    /**
     *Fixed share bar
     */
    angular.element($window).bind('scroll', function(e) {
        if (angular.element('#fixedShareBar').length == 1) {
            if (angular.element('#fixedShareBar').offset().top <= this.pageYOffset) {
                angular.element('#fixedShareBar').addClass('fixed');
            } else {
                angular.element('#fixedShareBar').removeClass('fixed');
            }
        }
    });


    /**
     *Set page height
     */
    angular.element('.page-wrapper').css({ 'minHeight': ($window.innerHeight - (parseInt(angular.element('header.navbar').outerHeight()) + 37)) + 'px' });
    angular.element($window).bind('resize', function() {
        angular.element('.page-wrapper').css({ 'minHeight': ($window.innerHeight - (parseInt(angular.element('header.navbar').outerHeight()) + 37)) + 'px' });
    });

}]);

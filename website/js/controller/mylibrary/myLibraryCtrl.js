app.controller('myLibraryCtrl', ['$scope', '$rootScope', '$state', '$window', function($scope, $rootScope, $state, $window) {

    /*Get Current User Data*/
    if (Object.getOwnPropertyNames($rootScope.globals).length === 2) {
        $scope.user = {
            customerId: $rootScope.globals.currentUser.data._id,
            type: $rootScope.globals.currentUser.data.userType,
            accessRights: $rootScope.globals.currentUser.data.accessRights,
            email: $rootScope.globals.currentUser.data.emailId
        }
    }


    $scope.$on('page', function(evnt, data) {
        $scope.page = data;
    });

    $scope.$on('renewType', function(evnt, data) {
        $scope.renewType = data;
    });



    $scope.$on('search', function(evnt, data) {
        $scope.searchItem = data;
    });


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

    /*Search Page
     */
    $scope.search = function() {
        $state.go($state.current.name, {
            'search': $scope.searchItem
        });
    }

    if ($state.params.search) {
        $scope.searchItem = $state.params.search;
    }


    /*Set Page Height*/
    angular.element('.page-wrapper').css({ 'minHeight': ($window.innerHeight - (parseInt(angular.element('header.navbar').outerHeight()) + 37)) + 'px' });
    angular.element($window).bind('resize', function() {
        angular.element('.page-wrapper').css({ 'minHeight': ($window.innerHeight - (parseInt(angular.element('header.navbar').outerHeight()) + 37)) + 'px' });
    });

}]);

app.controller('settingsCtrl', ['$scope', '$rootScope', '$window', 'UserService', function($scope, $rootScope, $window, UserService) {

    $scope.data = {
        customerId: $rootScope.globals.currentUser.data._id,
        password: '',
        newPassword: ''
    }

    /*Update Password*/
    $scope.updatePassword = function() {
        $scope.Loading = true;
        UserService.updatePassword($scope.data)
            .then(function(res) {
                $scope.Loading = false;
                if (res.status == 200) {
                    if (res.data.statusCode == 400) {
                        $scope.msgError = true;
                        $scope.msgSuccess = false;
                        $scope.message = res.data.message;
                    } else {
                        $scope.msgError = false;
                        $scope.msgSuccess = true;
                        $scope.message = res.data.customMessage;
                    }

                }
            });
    }

    angular.element('.page-wrapper').css({ 'minHeight': ($window.innerHeight - (parseInt(angular.element('header.navbar').outerHeight()) + 37)) + 'px' });
    angular.element($window).bind('resize', function() {
        angular.element('.page-wrapper').css({ 'minHeight': ($window.innerHeight - (parseInt(angular.element('header.navbar').outerHeight()) + 37)) + 'px' });
    });


}]);

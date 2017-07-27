app.controller('forgotPasswordCtrl', ['$scope', '$state', 'UserService', '$window', '$timeout', 'share', 'config', function($scope, $state, UserService, $window, $timeout, share, config) {


    $scope.isForgot = true;

    /**
     *Object for forgot password api
     */
    $scope.data = {};

    /**
     *Object for check otp api
     */
    $scope.otp = {};

    /**
     *Object for reset password api
     */
    $scope.reset = {};


    /**
     *Forgot password
     */
    $scope.forgotPassword = function() {
        $scope.isLoading = true;
        UserService.forgetPassword($scope.data)
            .then(function(res) {
                $scope.isLoading = false;
                if (res.statusText == "OK") {
                    if (res.data.statusCode == '400' || res.data.statusCode == '401') {
                        $scope.message = res.data.message;
                        $scope.msgError = true;

                        $timeout(function() {
                            $scope.message = '';
                            $scope.msgError = false;
                        }, 3000);

                    } else {
                        $scope.msgError = false;
                        $scope.isForgot = false;
                        $scope.isOTP = true;
                        $scope.otp.emailId = $scope.data.emailId;
                    }
                }
            });
    }


    /**
     *Check otp
     */
    $scope.checkOTP = function() {
        $scope.isLoading = true;
        UserService.checkOTP($scope.otp)
            .then(function(res) {
                $scope.isLoading = false;
                if (res.statusText == "OK") {
                    if (res.data.statusCode == '401' || res.data.statusCode == '400') {
                        $scope.message = res.data.customMessage;
                        $scope.msgError = true;

                        $timeout(function() {
                            $scope.message = '';
                            $scope.msgError = false;
                        }, 3000);

                    } else {
                        $scope.msgError = false;
                        $scope.isOTP = false;
                        $scope.isReset = true;
                        $scope.reset.emailId = $scope.data.emailId;
                        $scope.reset.code = $scope.otp.code;
                    }
                }
            });
    }


    /**
     *Reset password
     */
    $scope.resetPassword = function() {
        $scope.isLoading = true;
        UserService.resetPassword($scope.reset)
            .then(function(res) {
                $scope.isLoading = false;
                if (res.statusText == "OK") {
                    if (res.data.statusCode == '401' || res.data.statusCode == '400') {
                        $scope.msgError = true;
                        $scope.message = res.data.customMessage;

                        $timeout(function() {
                            $scope.message = '';
                            $scope.msgError = false;
                        }, 3000);

                    } else {
                        $scope.msgError = false;
                        share.set('message', res.data.customMessage);
                        $state.go('login');
                    }
                }
            });
    }


    /**
     *Set page height
     */
    angular.element('.page-wrapper').css({ 'minHeight': ($window.innerHeight - (parseInt(angular.element('header.navbar').outerHeight()) + 37)) + 'px' });
    angular.element($window).bind('resize', function() {
        angular.element('.page-wrapper').css({ 'minHeight': ($window.innerHeight - (parseInt(angular.element('header.navbar').outerHeight()) + 37)) + 'px' });
    });


}]);

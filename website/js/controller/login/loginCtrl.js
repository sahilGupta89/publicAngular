app.controller('loginCtrl', ['$scope', '$state', 'UserService', 'AuthenticationService', 'GooglePlus', '$facebook', '$location', '$window', 'share', '$timeout', 'config','$base64', function($scope, $state, UserService, AuthenticationService, GooglePlus, $facebook, $location, $window, share, $timeout, config,$base64) {
    /** 
     *Get success message for forgot password and hide after 3 sec
     */
    if (share.get('message')) {
        $scope.message = share.get('message');
        $scope.msgSuccess = true;
        $timeout(function() {
            $scope.message = '';
            $scope.msgSuccess = false;
            share.remove('message');
        }, 3000);
    }

    /** 
     *Get invalid message for 403 error
     */
    if (share.get('invalidMsg')) {
        $scope.message = share.get('invalidMsg');
        $scope.msgError = true;
        $timeout(function() {
            $scope.message = '';
            $scope.msgError = false;
            share.remove('invalidMsg');
        }, 3000);
    }



    $scope.loginData = {};


    if (share.get('authPxED')) {
        $scope.loginData.emailId = $base64.decode(share.get('authPxED'));
    }


    $scope.setLocalDB = function(data){
        share.set('authPxED',$base64.encode(data.emailId));


        if(angular.element('#remeberMe').prop('checked')==true){
            share.setObject('PxEd',{e:$base64.encode(data.emailId),p:$base64.encode(data.password)});
        }else{
            if (share.getObject('PxEd')) {
                angular.element('#remeberMe').prop('checked',true);
            }else{
                share.remove('PxEd');
            }
        }
    };




    $scope.login = function() {
        $scope.Loading = true;
        delete $scope.loginData.socialType;
        delete $scope.loginData.socialId;
        UserService.LoginUser($scope.loginData, 'login')
            .then(function(res) {
                $scope.Loading = false;
                if (res.statusText == "OK") {
                    if (res.data.statusCode == '400') {
                        $scope.msgError = true;
                        $scope.msgSuccess = false;
                        $scope.message = res.data.message;
                    } else if (res.data.statusCode == '401') {
                        $scope.msgError = true;
                        $scope.msgSuccess = false;
                        $scope.message = res.data.customMessage;
                    } else {
                        $scope.msgError = false;
                        $scope.Registration = false;
                        $scope.setLocalDB($scope.loginData);
                        AuthenticationService.SetCredentials(res.data.data, res.data.accessToken);
                        if (res.data.data.userType == config.userType[3] || res.data.data.userType == config.userType[4]) {
                            $location.path('/mylibrary/topics');
                        } else {
                            $location.path('/home/topics');
                        }
                    }
                }
            });
    }

    /*Google Plus Login*/
    $scope.googlelogin = function() {
        GooglePlus.login().then(function(authResult) {
            GooglePlus.getUser().then(function(user) {
                $scope.Loading = true;
                $scope.loginData.socialType = config.socialType[1];
                $scope.loginData.socialId = user.id;
                delete $scope.loginData.emailId;
                delete $scope.loginData.password;

                UserService.LoginUser($scope.loginData, 'socialLogin')
                    .then(function(res) {
                        $scope.Loading = false;
                        if (res.statusText == "OK") {
                            if (res.data.statusCode == '400' || res.data.statusCode == '401') {
                                $scope.msgError = true;
                                $scope.msgSuccess = false;
                                $scope.message = res.data.customMessage;
                            } else {
                                $scope.msgError = false;
                                $scope.Registration = false;
                                $scope.setLocalDB($scope.loginData);
                                AuthenticationService.SetCredentials(res.data.data, res.data.accessToken);

                                if (res.data.data.userType == config.userType[3] || res.data.data.userType == config.userType[4]) {
                                    $location.path('/mylibrary/topics');
                                } else {
                                    $location.path('/home/topics');
                                }

                            }
                        }
                    });
            });
        }, function(err) {
            console.log(err);
        });
    }

    /*Facebook Login*/
    $scope.facebooklogin = function() {
        $facebook.login().then(function(authResult) {
            $facebook.api("/me").then(
                function(response) {
                    $scope.Loading = true;
                    $scope.social = true;
                    $scope.loginData.socialType = config.socialType[0];
                    $scope.loginData.socialId = response.id;
                    delete $scope.loginData.emailId;
                    delete $scope.loginData.password;

                    UserService.LoginUser($scope.loginData, 'socialLogin')
                        .then(function(res) {
                            $scope.Loading = false;
                            if (res.statusText == "OK") {
                                if (res.data.statusCode == '400' || res.data.statusCode == '401' || res.data.statusCode == '500') {
                                    $scope.msgError = true;
                                    $scope.msgSuccess = false;
                                    $scope.message = res.data.customMessage;
                                } else {
                                    $scope.msgError = false;
                                    $scope.Registration = false;
                                    $scope.setLocalDB($scope.loginData);
                                    AuthenticationService.SetCredentials(res.data.data, res.data.accessToken);

                                    if (res.data.data.userType == config.userType[3] || res.data.data.userType == config.userType[4]) {
                                        $location.path('/mylibrary/topics');
                                    } else {
                                        $location.path('/home/topics');
                                    }

                                }
                            }
                        });
                },
                function(err) {
                    console.log(err);
                });
        });
    }

    ;
    if (share.getObject('PxEd')) {
        var auth = share.getObject('PxEd');
        $scope.loginData.emailId = $base64.decode(auth.e);
        $scope.loginData.password = $base64.decode(auth.p);
        $scope.login();
    }


    /*Set Page Height*/
    angular.element('.page-wrapper').css({ 'minHeight': ($window.innerHeight - (parseInt(angular.element('header.navbar').outerHeight()) + 37)) + 'px' });
    angular.element($window).bind('resize', function() {
        angular.element('.page-wrapper').css({ 'minHeight': ($window.innerHeight - (parseInt(angular.element('header.navbar').outerHeight()) + 37)) + 'px' });
    });

}]);

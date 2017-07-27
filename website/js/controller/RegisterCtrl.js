app.controller('RegisterCtrl', ['$scope', '$location', 'UserService', 'AuthenticationService', 'GooglePlus', '$facebook', 'Upload', '$http', '$window', '$timeout', '$compile', '$filter', '$timeout', 'config', function($scope, $location, UserService, AuthenticationService, GooglePlus, $facebook, Upload, $http, $window, $timeout, $compile, $filter, $timeout, config) {


    var profilePic = {};
    $scope.social = false;
    $scope.Registration = true;
    $scope.msgError = false;
    $scope.msgSuccess = false;

    $scope.data = {
        userType: config.userType[0],
        countryCode: '+91'
    };
    $scope.otpData = {};
    $scope.resendotpData = {};

    $timeout(function() {
        $('#password,#mobileNo').val('');
    }, 500);

    /*Get Country Code*/
    $scope.checkAddress = function() {
        $http.get('json/country.json').success(function(data) {
            $scope.country = data.results;
        });
    }

    $scope.checkAddress();

    /*Google Login Authentication*/
    $scope.googlelogin = function() {
        GooglePlus.login().then(function(authResult) {
            GooglePlus.getUser().then(function(user) {
                $scope.social = true;
                $scope.data.socialType = 'GOOGLEPLUS';
                $scope.data.socialId = user.id;
                $scope.data.profilePic = user.picture;
                $scope.data.firstName = user.given_name;
                $scope.data.lastName = user.family_name;
                $scope.data.emailId = user.email
                delete $scope.data.password;
            });
        }, function(err) {
            console.log(err);
        });
    };

    /*Facebook Login Authentication*/
    $scope.facebooklogin = function() {
        $facebook.login().then(function(authResult) {
            $facebook.api("/me", { locale: 'en_US', fields: 'first_name, last_name, name, email, picture' }).then(
                function(response) {
                    $scope.social = true;
                    $scope.data.socialType = 'FACEBOOK';
                    $scope.data.socialId = response.id;
                    $scope.data.profilePic = response.picture.data.url;
                    $scope.data.firstName = response.first_name;
                    $scope.data.lastName = response.last_name;
                    $scope.data.emailId = response.email;
                    delete $scope.data.password;
                },
                function(err) {
                    console.log(err);
                });
        });
    }

    /*Upload Profile Photo*/
    $scope.uploadFiles = function(files) {
        profilePic = files;
        if (files) {
            var reader = new FileReader();
            reader.readAsDataURL(files);
            reader.onload = $scope.imageIsLoaded;
        }
    }
    $scope.imageIsLoaded = function(e) {
        $scope.$apply(function() {
            $scope.step = e.target.result;
        });
    }

    /*Registration form submit*/
    $scope.register = function() {

        if ($scope.data.userType == config.userType[2]) {
            $scope.data.accessRights = [
                { key: config.accessRights[0], view: true, assign: true },
                { key: config.accessRights[1], view: true, edit: true, add: true, delete: true, assign: true, peer_view: true },
                { key: config.accessRights[2], view: true, edit: true, add: true, delete: true, assign: true, peer_view: true }
            ]
        }

        if ($scope.data.userType == config.userType[1]) {
            $scope.data.accessRights = [
                { key: config.accessRights[0], view: false, assign: false },
                { key: config.accessRights[1], view: false, edit: false, add: false, delete: false, assign: false, peer_view: false },
            ]
        }

        $scope.Loading = true;
        if ($scope.social == true || Object.keys(profilePic).length == 0) {
            UserService.AddUser($scope.data)
                .then(function(res) {
                    $scope.registerSuccess(res);
                });
        } else {
            $scope.data.profilePic = profilePic;
            if (profilePic) {
                delete $scope.data.socialType;
                delete $scope.data.socialId;
                UserService.RegUser($scope.data, profilePic)
                    .then(function(res) {
                        $scope.registerSuccess(res);
                    });
            }
        }
    }

    /*Registration Success Result*/
    $scope.registerSuccess = function(res) {
        $scope.Loading = false;
        if (res.statusText == "OK") {
            if (res.data.statusCode == '401' || res.data.statusCode == '400') {
                $scope.msgError = true;
                $scope.msgSuccess = false;
                $scope.message = res.data.customMessage;
            } else {
                $scope.authToken = res.data.accessToken;
                $scope.msgError = false;
                $scope.msgSuccess = false;
                $scope.Registration = false;
            }
        }
    }


    /*Verify OTP*/
    $scope.verifyOTP = function() {
        $scope.Loading = true;
        UserService.verifyOTP($scope.otpData, $scope.authToken)
            .then(function(res) {
                $scope.Loading = false;
                if (res.statusText == "OK") {
                    if (res.data.statusCode == '401' || res.data.statusCode == '400' || res.data.statusCode == '500') {
                        $scope.msgError = true;
                        $scope.msgSuccess = false;
                        $scope.message = res.data.customMessage;
                    } else {
                        $scope.msgError = false;
                        $scope.msgSuccess = true;
                        $scope.message = config.message.userAdded;
                        AuthenticationService.SetCredentials(res.data.data, res.data.accessToken);
                        $location.path('/home/topics');
                    }
                }
            });
    }


    /**
     *Resend OTP
     */
    $scope.resendOTP = function() {
        $scope.resendotpData.countryCode = $scope.data.countryCode;
        $scope.resendotpData.mobileNo = $scope.data.mobileNo;
        $scope.Loading = true;
        UserService.resendOTP($scope.resendotpData, $scope.authToken)
            .then(function(res) {
                $scope.Loading = false;
                if (res.statusText == "OK") {
                    if (res.data.statusCode == '401' || res.data.statusCode == '400') {
                        $scope.msgError = true;
                        $scope.msgSuccess = false;
                        $scope.message = res.data.customMessage;
                    } else {
                        $scope.msgError = false;
                        $scope.msgSuccess = true;
                        $scope.message = config.message.sentOtp;
                    }
                }
            });
    }


    /**
     *Set Page Height
     */
    angular.element('.pageReg').css({ 'minHeight': ($window.innerHeight - (parseInt(angular.element('header.navbar').outerHeight()) + 37)) + 'px' });
    angular.element($window).bind('resize', function() {
        angular.element('.pageReg').css({ 'minHeight': ($window.innerHeight - (parseInt(angular.element('header.navbar').outerHeight()) + 37)) + 'px' });
    });


}]);

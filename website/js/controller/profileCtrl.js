app.controller('profileCtrl', ['$scope', '$rootScope', '$window', 'AuthenticationService', 'UserService', 'Upload', '$http', '$filter', '$state', 'share', '$sce', 'config','$cookieStore', function($scope, $rootScope, $window, AuthenticationService, UserService, Upload, $http, $filter, $state, share, $sce, config,$cookieStore) {
    var profilePic = false;
    $scope.year = new Date().getFullYear();
    /*Get Current User Data*/
    if (Object.getOwnPropertyNames($rootScope.globals).length === 2) {
        $scope.user = {
            customerId: $rootScope.globals.currentUser.data._id,
            type: $rootScope.globals.currentUser.data.userType
        }
    }


    /*Get Curriculum List*/
    $scope.getCurriculum = function() {
        UserService.listing()
            .then(function(res) {
                $scope.curriculumList = res.data.curriculumList;
            });
    }

    /*Get Grade List*/
    $scope.getGrade = function(data) {
        UserService.listing({ curriculum: data })
            .then(function(res) {
                $scope.gradeList = res.data.gradeList;
            });
    }

    /*Change Grade List*/
    $scope.changeGrade = function(data) {
        $scope.gradeList = '';
        $scope.getGrade(data);
    }

    $scope.range = function(min, max, step) {
        step = step || 1;
        var input = [];
        for (var i = min; i <= max; i += step) input.push(i);
        return input;
    };


    /*Get Profile Data*/
    $scope.getProfile = function() {
        $scope.Loading = true;
        UserService.getProfile({ customerId: $scope.user.customerId })
            .then(function(res) {
                $scope.Loading = false;
                $scope.data = res.data.data;
                $scope.user.emailId = $scope.data.emailId;
                $scope.user.firstName = $scope.data.firstName;
                $scope.user.lastName = $scope.data.lastName;
                $scope.user.gender = $scope.data.gender;
                $scope.user.dob = $scope.data.dob;

                Date.prototype.getMonthFormatted = function() {
                    var month = this.getMonth() + 1;
                    return month < 10 ? '0' + month : month;
                }
                Date.prototype.getDateFormatted = function() {
                    var date = this.getDate();
                    return date < 10 ? '0' + date : date;
                }

                $scope.dateOfBirth = {
                    dd: new Date($scope.user.dob).getDateFormatted(),
                    mm: new Date($scope.user.dob).getMonthFormatted(),
                    yyyy: new Date($scope.user.dob).getFullYear()
                }


                if ($scope.user.type == config.userType[0] || $scope.user.type == config.userType[1]) {
                    $scope.user.curriculum = $scope.data.curriculum;
                    $scope.user.grade = $scope.data.grade;
                    $scope.user.sessionFrom = $scope.data.sessionFrom;
                    $scope.user.sessionTo = $scope.data.sessionTo;
                    $scope.sessionFrom = {
                        dd: new Date($scope.user.sessionFrom).getDateFormatted(),
                        mm: new Date($scope.user.sessionFrom).getMonthFormatted(),
                        yyyy: new Date($scope.user.sessionFrom).getFullYear()
                    }
                }
                $scope.user.addressValue = $scope.data.addressValue;
                $scope.user.countryCode = $scope.data.countryCode;
                $scope.user.latitude = $scope.data.location.coordinates[0];
                $scope.user.longitude = $scope.data.location.coordinates[0];
                $scope.user.mobileNo = $scope.data.mobileNo;
                $scope.user.city = $scope.data.city;
                $scope.user.state = $scope.data.state;
                $scope.user.country = $scope.data.country;
                $scope.user.zip = $scope.data.zip;

                /*$scope.getDateOfBirth($scope.user.dob);*/


                if ($scope.data.userType == config.userType[1]) {
                    $('#grade').attr('multiple', 'multiple');
                } else {
                    $('#grade').removeAttr('multiple');
                }

                $scope.profilePicChange = false;
                $scope.getGrade($scope.user.curriculum);
                $rootScope.globals.currentUser = res.data;
                $cookieStore.put('globals', $rootScope.globals);
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
            $scope.profilePicChange = e.target.result;
        });
    }

    /*Get Country Code*/
    $scope.checkAddress = function() {
        $http.get('json/country.json').success(function(data) {
            $scope.country = data.results;
        });
    }
    $scope.checkAddress();


    /*Show Edit View*/
    $scope.editView = function() {
        $scope.editable = true;
        $scope.getProfile();
    }


    $scope.checkoutMessage = share.get('checkoutMessage');
    if ($scope.checkoutMessage) {
        angular.element('body').removeClass('modal-open');
        angular.element('.modal-backdrop').remove();
        $scope.editable = true;
    }






    /*edit Profile*/
    $scope.editProfile = function() {

        if ($scope.user.type == config.userType[0] || $scope.user.type == config.userType[1]) {
            var sessionFrom = $scope.sessionFrom.yyyy + '-' + $scope.sessionFrom.mm + '-' + $scope.sessionFrom.dd;
            var sessionTo = (parseInt($scope.sessionFrom.yyyy) + 1) + '-' + $scope.sessionFrom.mm + '-' + $scope.sessionFrom.dd;
            $scope.user.sessionFrom = sessionFrom + 'T00:00:00.000Z';
            $scope.user.sessionTo = sessionTo + 'T00:00:00.000Z';
        }

        $scope.user.dob = $scope.dateOfBirth.yyyy + '-' + $scope.dateOfBirth.mm + '-' + $scope.dateOfBirth.dd + 'T00:00:00.000Z';

        $scope.Loading = true;
        if (profilePic != false) {
            $scope.user['profilePic'] = profilePic;
        }
        UserService.editProfile($scope.user, profilePic)
            .then(function(res) {
                if (res.data.type == 'USER_ALREADY_REGISTERED') {
                    $scope.message = config.message.mobileNumberAlreadyRegistered;
                    $scope.msgError = true;
                    $scope.Loading = false;
                } else {
                    $scope.msgError = false;
                    if ($scope.user.mobileNo != $scope.data.mobileNo) {
                        $scope.optData = {
                            newMobileNo: $scope.user.mobileNo,
                            oldMobileNo: $scope.data.mobileNo
                        }
                    } else {
                        $scope.editable = false;

                        if ($scope.checkoutMessage) {
                            $scope.checkoutData = share.getObject('checkoutData');
                            $scope.Loading = true;
                            UserService.checkout($scope.checkoutData)
                                .then(function(res) {
                                    $scope.Loading = false;
                                    $scope.checkoutMessage = false;
                                    share.remove('checkoutMessage');
                                    share.remove('checkoutData');

                                    $scope.trustSrc = function(src) {
                                        return $sce.trustAsResourceUrl(src);
                                    }
                                    if (res.data.url == '') {
                                        $state.go('cart');
                                    } else {
                                        $window.location = res.data.url;
                                        //$scope.checkoutResponse = res.data.url;
                                    }
                                });
                        }

                    }
                    $scope.getProfile();
                }
            });

    }


    /*Cancel Profile*/
    $scope.cancelProfile = function() {
        $scope.editable = false;
        $scope.getProfile();
    }


    /*Verify OTP*/
    $scope.verifyOTPeditProfile = function() {
        $scope.Loading = true;
        UserService.verifyOTPeditProfile($scope.optData)
            .then(function(res) {
                $scope.Loading = false;
                if (res.data.type == "INVALID_CODE") {
                    $scope.msgError = true;
                    $scope.message = res.data.customMessage;
                } else {
                    $scope.msgError = false;
                    $scope.editable = false;
                    $scope.optData = false;
                    $scope.getProfile();

                    $scope.checkoutMessage = false;

                    if ($scope.checkoutMessage) {
                        $scope.checkoutData = share.getObject('checkoutData');
                        $scope.Loading = true;
                        /*$scope.checkoutMessage = false;
                        share.remove('checkoutMessage');
                        $state.go('cart');*/
                        UserService.checkout($scope.checkoutData)
                            .then(function(res) {
                                $scope.Loading = false;
                                $scope.checkoutMessage = false;
                                share.remove('checkoutMessage');
                                share.remove('checkoutData');

                                $scope.trustSrc = function(src) {
                                    return $sce.trustAsResourceUrl(src);
                                }
                                if (res.data.url == '') {
                                    $state.go('cart');
                                } else {
                                    $window.location = res.data.url;
                                    //$scope.checkoutResponse = res.data.url;
                                }



                            });
                    }


                }
            });
    }

    /*Initialize Curriculum List, Profile Data*/
    $scope.getCurriculum();
    $scope.getProfile();


    /*Set Page Height*/
    angular.element('.page-wrapper').css({ 'minHeight': ($window.innerHeight - (parseInt(angular.element('header.navbar').outerHeight()) + 37)) + 'px' });
    angular.element($window).bind('resize', function() {
        angular.element('.page-wrapper').css({ 'minHeight': ($window.innerHeight - (parseInt(angular.element('header.navbar').outerHeight()) + 37)) + 'px' });
    });


    /*Set Fixed Header onScroll*/
    angular.element($window).bind('scroll', function(e) {
        if (angular.element('#fixedForProfile').length == 1) {
            if (angular.element('#fixedForProfile').offset().top <= this.pageYOffset) {
                angular.element('#fixedForProfile').addClass('fixed');
            } else {
                angular.element('#fixedForProfile').removeClass('fixed');
            }
        }
    });


}]);

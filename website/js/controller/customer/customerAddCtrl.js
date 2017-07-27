app.controller('customerAddCtrl', ['$scope', 'UserService', '$state', 'share', 'Upload', '$http', '$window', '$timeout', '$compile', '$filter', 'config', function($scope, UserService, $state, share, Upload, $http, $window, $timeout, $compile, $filter, config) {

    /*Get page*/
    if ($state.current.name == 'customer.add') {
        $scope.page = {
            name: 'Add Customer',
            type: 'ADD'
        }
    }
    if ($state.current.name == 'customer.edit') {
        $scope.page = {
            name: 'Edit Customer',
            type: 'EDIT'
        }
    }


    $scope.$emit('page', $scope.page);

    var profilePic = {};


    /**
     *Get current user license
     */
    $scope.getCurrentUserLicense = function(id) {
        $scope.isLoading = true;
        UserService.getProfile({ customerId: id })
            .then(function(res) {
                $scope.isLoading = false;
                if (res.data.statusCode == 200) {
                    $scope.user.license = res.data.data.license[0].allocatedLicense - res.data.data.license[0].usedLicense;
                }

            });
    }

    /**
     *Initialize getCurrentUserLicense function if user is not student
     */
    if ($scope.user.type != config.userType[0] && $scope.user.type != config.userType[1]) {
        $scope.getCurrentUserLicense($scope.user.id);
    }



    /** 
     *Get customer Detail
     * @param data = 'customer id'
     */
    $scope.getCustomer = function(data) {
        $scope.Loading = true;
        UserService.getProfile(data)
            .then(function(res) {
                $scope.Loading = false;
                if (res.data.statusCode == 200) {
                    var data = res.data.data;
                    $scope.data = {
                        firstName: data.firstName,
                        lastName: data.lastName,
                        emailId: data.emailId,
                        countryCode: data.countryCode,
                        mobileNo: data.mobileNo,
                        accessRights: data.accessRights,
                        userType: data.userType,
                        agentId: data._id,
                        license: data.license[0].allocatedLicense - data.license[0].usedLicense
                    };
                    $scope.step = data.profilePicUrl;
                } else {
                    $state.go('customer.list');
                }
            })
    }


    /**
     *Object for add customer
     */
    $scope.data = {};

    if ($scope.page.type == 'ADD') {
        $scope.data.userType = config.userType[0];
        $scope.data.countryCode = '+91';
    }

    if ($scope.page.type == 'EDIT') {
        $scope.data = {};
        $scope.getCustomer({ customerId: $state.params.id });
    }



    /** 
     *Initialize get customer function for add agent
     */
    $scope.$watchCollection('data.userType', function(oldValue, newValue) {
        if (oldValue != newValue) {
            if ($scope.page.type == 'ADD') {
                if ($scope.data.userType == config.userType[1]) {
                    /**
                     *set customer permission if customer is teacher
                     */
                    $scope.data.accessRights = [
                        { key: config.accessRights[0], view: false, assign: false },
                        { key: config.accessRights[1], view: false, edit: false, add: false, delete: false, assign: false, peer_view: false }
                    ]
                } else if ($scope.data.userType == config.userType[3] || $scope.data.userType == config.userType[4]) {
                    /**
                     *set customer permission if customer is sub agent or school
                     */
                    $scope.data.accessRights = [
                        { key: config.accessRights[0], view: false, assign: false },
                        { key: config.accessRights[1], view: false, edit: false, add: false, delete: false, assign: false, peer_view: false },
                        { key: config.accessRights[2], view: false, edit: false, add: false, delete: false, assign: false, peer_view: false }
                    ]
                } else {
                    /**
                     *set customer permission if customer is student
                     */
                    $scope.data.accessRights = [];
                }
            }
        }
    });


    /**
     *Get curriculum data when userType student, teacher
     */
    $scope.getCurriculum = function() {
        $scope.isLoading = true;
        UserService.listing()
            .then(function(res) {
                $scope.isLoading = false;
                $scope.curriculumList = res.data.curriculumList;
            });
    }

    /**
     *Get grade data when userType student, teacher
     *@paran data = selected curriculum
     */
    $scope.getGrade = function(data) {
        $scope.isLoading = true;
        UserService.listing({ curriculum: data })
            .then(function(res) {
                $scope.isLoading = false;
                $scope.gradeList = res.data.gradeList;
            });
    }

    /**
     *Get grade data when userType student, teacher
     *@paran data = selected curriculum
     */
    $scope.changeGrade = function(data) {
        $scope.getGrade(data);
    }


    /**
     *Initialize getCurriculum function
     */
    $scope.getCurriculum();


    /**
     *Get country code
     */
    $scope.getCountryCode = function() {
        $http.get('json/country.json').success(function(data) {
            $scope.country = data.results;
        });
    }

    /**
     *Initialize getCountryCode function
     */
    $scope.getCountryCode();



    /**
     *Upload profile photo
     */
    $scope.uploadFiles = function(files) {
        profilePic = files;
        if (files) {
            var reader = new FileReader();
            reader.readAsDataURL(files);
            reader.onload = $scope.imageIsLoaded;
        }
    }

    /**
     *Get browse image url
     */
    $scope.imageIsLoaded = function(e) {
        $scope.$apply(function() {
            $scope.step = e.target.result;
        });
    }



    $scope.$watchCollection('data.accessRights[0]', function(oldValue, newValue) {
        if (oldValue != newValue) {
            if ($scope.data.userType == config.userType[1] || $scope.data.userType == config.userType[3] || $scope.data.userType == config.userType[4]) {
                $scope.checkPermission(oldValue);
            }
        }
    });

    $scope.$watchCollection('data.accessRights[1]', function(oldValue, newValue) {
        if (oldValue != newValue) {
            if ($scope.data.userType == config.userType[1] || $scope.data.userType == config.userType[3] || $scope.data.userType == config.userType[4]) {
                $scope.checkPermission(oldValue);
            }
        }
    });

    $scope.$watchCollection('data.accessRights[2]', function(oldValue, newValue) {
        if (oldValue != newValue) {
            if ($scope.data.userType == config.userType[3] || $scope.data.userType == config.userType[4]) {
                $scope.checkPermission(oldValue);
            }
        }
    });


    $scope.checkPermission = function(data) {
        if (data.add || data.assign || data.delete || data.edit || data.peer_view) {
            data.view = true;
        }
    }



    /**
     *Add customer
     *@param data = $scope.data
     *@param pic = profile photo
     */
    $scope.addCustomer = function(data, pic) {
        UserService.addCustomer(data, pic)
            .then(function(res) {
                $scope.customerSuccess(res);
            });
    }

    /**
     *Edit customer
     *@param data = $scope.data
     *@param pic = profile photo
     */
    $scope.editCustomer = function(data, pic) {
        delete data.emailId;
        delete data.countryCode;
        delete data.userType;
        delete data.license;
        UserService.editAgent(data, pic)
            .then(function(res) {
                $scope.customerSuccess(res);
            });
    }


    /**
     *Customer add or edit
     */
    $scope.addEditCustomer = function() {
        $scope.isLoading = true;
        if (Object.keys(profilePic).length == 0) {
            if ($scope.page.type == 'ADD') {
                $scope.addCustomer($scope.data, '');
            }
            if ($scope.page.type == 'EDIT') {
                $scope.editCustomer($scope.data, '');
            }

        } else {
            $scope.data.profilePic = profilePic;
            if ($scope.page.type == 'ADD') {
                $scope.addCustomer($scope.data, profilePic);
            }
            if ($scope.page.type == 'EDIT') {
                $scope.editCustomer($scope.data, profilePic);
            }
        }
    }





    /**
     *Customer success result
     *@param res =  add customer api success response
     */
    $scope.customerSuccess = function(res) {
        $scope.isLoading = false;
        if (res.data.statusCode == '401' || res.data.statusCode == '400') {
            $scope.msgError = true;
            $scope.message = res.data.customMessage;
        } else {
            $scope.msgError = false;
            share.set('message', res.data.customMessage);
            $state.go('customer.list');
        }
    }


}]);

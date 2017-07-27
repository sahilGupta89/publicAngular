app.controller('customerListCtrl', ['$scope', '$window', 'share', 'UserService', '$state', '$timeout', 'config', function($scope, $window, share, UserService, $state, $timeout, config) {


    /*Get Page*/
    $scope.page = {
        name: 'Customer List',
        type: 'LIST'
    }
    $scope.$emit('page', $scope.page);

    /*Get and Set Message*/
    $scope.message = share.get('message');
    $timeout(function() {
        $scope.message = false;
        share.remove('message');
    }, 3000);

    $scope.data = {}

    $scope.filters = {
        userType: [config.userType[0], config.userType[1], config.userType[3], config.userType[4]],
        gender: config.gender,
        country: [],
        grade: []
    }

    /**
     *Get Filter Grade and country
     */
    UserService.getGradeAndCountryList()
        .then(function(res) {
            $scope.filters.country = res.data.country;
            $scope.filters.grade = res.data.grade;
        });



    /**
     *Get customers
     *@param data
     */
    $scope.getCustomers = function(data) {
        $scope.Loading = true;
        UserService.getCustomers(data)
            .then(function(res) {
                $scope.Loading = false;
                if (res.data.statusCode == 200) {
                    $scope.customers = res.data.customers;
                }
            });
    }


    /*Initialize getCustomers*/
    $scope.getCustomers($scope.data);


    /*Get Customer Filters by User Type*/
    $scope.$watchCollection('data.userType', function(oldValue, newValue) {
        if (oldValue != newValue) {
            if ($scope.data.userType == undefined || $scope.data.userType.length == 0) {
                delete $scope.data.userType;
            }
            $scope.getCustomers($scope.data);
        }
    });
    /*Get Customer Filters by Gender*/
    $scope.$watchCollection('data.gender', function(oldValue, newValue) {
        if (oldValue != newValue) {
            if ($scope.data.gender == undefined || $scope.data.gender.length == 0) {
                delete $scope.data.gender;
            }
            $scope.getCustomers($scope.data);
        }
    });

    /*Get Customer Filters by Country*/
    $scope.$watchCollection('data.country', function(oldValue, newValue) {
        if (oldValue != newValue) {
            if ($scope.data.country == undefined || $scope.data.country.length == 0) {
                delete $scope.data.country;
            }
            $scope.getCustomers($scope.data);
        }
    });

    /*Get Customer Filters by Grade*/
    $scope.$watchCollection('data.grade', function(oldValue, newValue) {
        if (oldValue != newValue) {
            if ($scope.data.grade == undefined || $scope.data.grade.length == 0) {
                delete $scope.data.grade;
            }
            $scope.getCustomers($scope.data);
        }
    });

    /*Get Customer Filters by Registration from*/
    $('#registrationFrom').datetimepicker({
        format: 'DD/MM/YYYY'
    }).on("dp.change", function(e) {
        $scope.data.registerationDateFrom = moment(e.date).format("YYYY-MM-DDTHH:mm:ss.000") + "Z";
        $scope.getCustomers($scope.data);
        $('#registrationTo').data("DateTimePicker").minDate(e.date);
    });

    /*Get Customer Filters by Registration to*/
    $('#registrationTo').datetimepicker({
        format: 'DD/MM/YYYY'
    }).on("dp.change", function(e) {
        $scope.data.registrationDateTo = moment(e.date).format("YYYY-MM-DDTHH:mm:ss.000") + "Z";
        $scope.getCustomers($scope.data);
    });

    /*Search Customer*/
    if ($scope.page.type == 'LIST') {
        $scope.$parent.search = function() {
            $scope.data.search = $scope.searchItem;
            $scope.getCustomers($scope.data);
        }
    }



    /*Share Topic Date*/
    $scope.share = {
        users: []
    };


    /** 
     *Select All customers
     * @param $event
     */
    $scope.selectAllCustomers = function($event) {
        var checked = angular.element($event.target).prop('checked');
        if (checked == true) {
            angular.forEach($scope.customers, function(value) {
                if ($scope.share.users.indexOf(value.customerId) == -1) {
                    $scope.share.users.push(value.customerId);
                }
            });
        } else {
            $scope.share.users = [];
        }
    }

    /**
     *Share users data to next state
     */
    $scope.shareUsers = function() {
        if ($scope.share.users.length == 0) {
            alert(config.message.selectUsers);
            return false;
        } else {
            $scope.$emit('shareList', $scope.share);
            $state.go('customer.share');

        }
    }

    /**
     *Export customer data in .xlsx formet
     */
    $scope.exportData = function() {
        var data = $scope.customers;
        angular.forEach(data, function(value) {
            delete value.profilePic;
            delete value.customerId;
            delete value.$$hashKey;
        });
        alasql('SELECT * INTO XLSX("customers.xlsx",{headers:true}) FROM ?', [data]);
    };


    /**
     *Upload csv file for add customer
     *@param file = browse file
     *@param errFiles
     */
    $scope.uploadFiles = function(file, errFiles) {
        $scope.isLoading = true;
        UserService.customerUploadViaCSV(file)
            .then(function(res) {
                $scope.isLoading = false;
                console.log(res);
                if (res.data.statusCode == 200) {
                    $scope.message = res.data.customMessage;
                    $timeout(function() {
                        $scope.message = false;
                        share.remove('message');
                    }, 3000);
                }
            });
    }




    /** 
     *Block agent
     * @param id = 'agent id'
     */
    $scope.blockAgent = function(id) {
        $scope.Loading = true;
        UserService.blockAgent({ agentId: id })
            .then(function(res) {
                $scope.Loading = false;
                if (res.data.statusCode == 200) {
                    $scope.message = res.data.customMessage;
                    angular.forEach($scope.customers, function(value) {
                        if (value.customerId == id) {
                            value.block = true;
                        }
                    });
                    $timeout(function() {
                        $scope.message = false;
                    }, 5000);

                }
            })
    }

    /** 
     *Unblock agent
     * @param id = 'agent id'
     */
    $scope.unblockAgent = function(id) {
        $scope.Loading = true;
        UserService.unblockAgent({ agentId: id })
            .then(function(res) {
                $scope.Loading = false;
                if (res.data.statusCode == 200) {
                    $scope.message = res.data.customMessage;

                    angular.forEach($scope.customers, function(value) {
                        if (value.customerId == id) {
                            value.block = false;
                        }
                    });


                    $timeout(function() {
                        $scope.message = false;
                    }, 3000);

                }
            })
    }


}]);

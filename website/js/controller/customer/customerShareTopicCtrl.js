app.controller('customerShareTopicCtrl', ['$scope', '$window', 'UserService', '$state', 'share', function($scope, $window, UserService, $state, share) {

    if ($scope.shareList.users.length == 0) {
        $state.go('customer.list');
    }

    /*Get Page*/
    $scope.page = {
        name: 'Share Topics',
        type: 'SHARE'
    }
    $scope.$emit('page', $scope.page);


    $scope.languages = [];

    /**
     * Get Purchased Topic List
     * @param 
     */
    $scope.getPurchasedTopics = function(data) {
        $scope.Loading = true;
        UserService.getPurchasedTopics(data)
            .then(function(res) {
                $scope.Loading = false;
                if (res.data.statusCode == 200) {
                    $scope.topics = res.data.topics;

                    $scope.languages = res.data.languages;

                    if (Object.keys($scope.topics).length > 0) {
                        $scope.activePackage = $scope.topics[Object.keys($scope.topics)[0]].packageId;
                        $scope.assignEndDate = $scope.topics[$scope.activePackage].endDate;
                    }
                }

            });
    }

    /*Initialize Get Purchased Topic List*/
    $scope.getPurchasedTopics();

    /*Search Topics*/
    if ($scope.page.type == 'SHARE') {
        $scope.$parent.search = function() {
            var data = {
                search: $scope.searchItem
            }
            $scope.getPurchasedTopics(data);
        }
    }






    

    $scope.data = {
        topic: [],
        startDate: moment(new Date()).utc().format("YYYY-MM-DDTHH:mm:ss.000") + 'Z',
        endDate: moment(new Date()).utc().format("YYYY-MM-DDTHH:mm:ss.000") + 'Z',
        customerId: $scope.shareList.users
    }


    /*Get Assign start date and end date*/
    $('#startDate').datetimepicker({
        format: 'DD/MM/YYYY',
        minDate: new Date(),
    }).on("dp.change", function(e) {
        $scope.data.startDate = moment(e.date).utc().format("YYYY-MM-DDTHH:mm:ss.000") + 'Z';
        $('#startDate').data("DateTimePicker").maxDate(moment(new Date($scope.assignEndDate)));
    });
    /*Get Customer Filters by Registration to*/
    $('#endDate').datetimepicker({
        format: 'DD/MM/YYYY',
        date: moment(new Date($scope.assignEndDate)),
        minDate: new Date(),
    }).on("dp.change", function(e) {
        $('#endDate').data("DateTimePicker").maxDate(moment(new Date($scope.assignEndDate)));
        $scope.data.endDate = moment(e.date).utc().format("YYYY-MM-DDTHH:mm:ss.000") + 'Z';
    });



    $scope.assignTopics = function() {
        if ($scope.data.topic.length == 0) {
            alert('Please Select Topics');
            return false;
        } else {
            angular.element('#assignModal').modal('show');

            $('#endDate').datetimepicker({
                defaultDate: moment(new Date($scope.assignEndDate))
            });

        }



    }


    /**
     * Share topics to customers
     */
    $scope.assign = function() {
        $scope.data.packageId = $scope.activePackage;
        $scope.Loading = true;
        UserService.shareContent($scope.data)
            .then(function(res) {
                $scope.Loading = false;
                if (res.data.statusCode == '401' || res.data.statusCode == '400') {
                    $scope.msgError = true;
                    $scope.message = res.data.customMessage;
                } else {
                    $scope.msgError = false;
                    $scope.message = false;
                    angular.element('#assignModal').modal('hide');
                    angular.element('.modal-backdrop').remove();
                    angular.element('body').removeClass('modal-open');

                    share.set('message', res.data.customMessage);
                    $state.go('customer.list');
                }


            });
    }



    /*Open always one Filter Tab*/
    $scope.packagesTab = function($event, id) {
        if ($($event.target).parents('.panel').children('.panel-collapse').hasClass('in')) {
            $event.preventDefault();
            $event.stopPropagation();
        } else {
            $scope.activePackage = id;
            $scope.assignEndDate = $scope.topics[id].endDate;
            $scope.data.topic = [];

        }
    }

    $scope.objectLength = function(data) {
        return Object.keys(data).length;
    }


    $scope.checkAllPackage = function($event, data) {
        var checked = $($event.target).prop('checked');
        if (checked) {
            angular.forEach(data, function(value) {
                if ($scope.data.topic.indexOf(value.name) == -1) {
                    $scope.data.topic.push(value.name);
                }
            })
        } else {
            $scope.data.topic = [];
        }
    }


}]);

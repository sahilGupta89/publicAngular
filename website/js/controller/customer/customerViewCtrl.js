app.controller('customerViewCtrl', ['$scope', 'UserService', '$state', 'share', 'Upload', '$http', '$window', '$timeout', '$compile', '$filter', 'config', function($scope, UserService, $state, share, Upload, $http, $window, $timeout, $compile, $filter, config) {

    /*Get Page*/
    $scope.page = {
        name: '',
        type: 'VIEW'
    }

    $scope.$emit('page', $scope.page);

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
                    $scope.userDetail = res.data.data;
                    $scope.page.name = $scope.userDetail.firstName + ' ' + $scope.userDetail.lastName;
                }
            })
    }


    /** 
     *Get share topic history
     * @param data = 'customer id'
     */
    $scope.sharedTopicHistory = function(data) {
        $scope.Loading = true;
        UserService.sharedTopicHistory(data)
            .then(function(res) {
                $scope.Loading = false;
                if (res.data.statusCode == 200) {
                    $scope.shared = res.data.data.topic;
                    angular.forEach($scope.shared, function(topic) {
                        angular.forEach(topic.content, function(content) {
                            content.categoryName = content.categoryName.filter(function(item, index, inputArray) {
                                return inputArray.indexOf(item) == index;
                            });
                            content.contentType = content.contentType.filter(function(item, index, inputArray) {
                                return inputArray.indexOf(item) == index;
                            });
                        });

                    });

                }
            })
    }




    /** 
     *Initialize get customer function for add agent
     */
    if ($state.params.id) {
        $scope.getCustomer({ customerId: $state.params.id });

        if ($scope.user.type != config.userType[0]) {
            $scope.sharedTopicHistory({ customerId: $state.params.id });
        }

    }

    /** 
     *Block agent  and get customer detail
     * @param id = 'agent id'
     */
    $scope.blockAgent = function(id) {
        $scope.Loading = true;
        UserService.blockAgent({ agentId: id })
            .then(function(res) {
                $scope.Loading = false;
                if (res.data.statusCode == 200) {
                    $scope.message = res.data.customMessage;
                    $scope.getCustomer({ customerId: $state.params.id });
                    $timeout(function() {
                        $scope.message = false;
                    }, 3000);

                }
            })
    }

    /** 
     *Unblock agent and get customer detail
     * @param id = 'agent id'
     */
    $scope.unblockAgent = function(id) {
        $scope.Loading = true;
        UserService.unblockAgent({ agentId: id })
            .then(function(res) {
                $scope.Loading = false;
                if (res.data.statusCode == 200) {
                    $scope.message = res.data.customMessage;
                    $scope.getCustomer({ customerId: $state.params.id });
                    $timeout(function() {
                        $scope.message = false;
                    }, 3000);
                }
            })
    }


    /**
     *Delete shared topic by agent
     *@param name = topic name
     *@param content = topic
     *@param method = SINGLE or MULTI
     */
    $scope.deleteSharedTopic = function(name, content, method) {
        var data = {
            name: name,
            language: [],
            userId: $state.params.id
        }
        if (method == 'SINGLE') {
            data.language.push(content);
        }

        if (method == 'MULTI') {
            angular.forEach(content, function(value, key) {
                data.language.push(key);
            })

        }
        UserService.deleteAssignedContent(data).then(function(res) {
            $scope.Loading = false;
            if (res.data.statusCode == 200) {
                $scope.message = res.data.customMessage;
                $scope.sharedTopicHistory({ customerId: $state.params.id });
                $timeout(function() {
                    $scope.message = false;
                }, 3000);
            }
        })
    }


}]);

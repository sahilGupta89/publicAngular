app.controller('myLibraryExpiredPackagesCtrl', ['$scope', '$state', 'UserService', '$timeout', function($scope, $state, UserService, $timeout) {

    /*Get Page*/
    $scope.page = {
        name: 'Expired Packages',
        type: 'EXPIRED'
    }

    $scope.$emit('page', $scope.page);


    $scope.data = {
        customerId: $scope.user.customerId
    }


    /**
     *Search topics by state param name 'search'
     */
    if ($state.params.search) {
        $scope.$emit('search', $state.params.search);
        $scope.data.search = $state.params.search;
    } else {
        $scope.$emit('search', '');
    }


    /** 
     *Get my library package data
     * @param
     */
    $scope.getExpiredPackages = function() {
        $scope.isLoading = true;
        UserService.getExpiredPackages($scope.data)
            .then(function(res) {
                $scope.isLoading = false;
                if (res.status == 200) {
                    $scope.packages = res.data;
                }
            });
    }

    /** 
     *Initialize get customer function for add agent
     */
    $scope.getExpiredPackages();



    /**
     *Clear Search
     */
    $scope.clearSearch = function() {
        $state.go($state.current.name, {
            'search': ''
        });
    }



    /**
     *Renew expirey package
     */
    $scope.renewExpirey = function(id, type) {
        var data = {
            packageId: id,
            topicId: [],
            packageType: type
        }
        $scope.isLoading = true;
        UserService.renewExpirey(data)
            .then(function(res) {
                $scope.isLoading = false;
                if (res.status == 200) {
                    $state.go('cart');
                }
            });
    }

    /**
     *delete expirey package
     */
    $scope.deleteBooking = function(id, type) {
        var data = {
            id: id,
            packageType: type
        }
        $scope.isLoading = true;
        UserService.deleteBooking(data)
            .then(function(res) {
                $scope.isLoading = false;
                if (res.status == 200) {
                    $scope.message = res.data.customMessage;
                    $timeout(function() {
                        $scope.message = false;
                    }, 3000);
                    $scope.getExpiredPackages();
                }
            });
    }



}]);

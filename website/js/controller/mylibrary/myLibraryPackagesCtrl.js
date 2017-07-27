app.controller('myLibraryPackagesCtrl', ['$scope', '$state', 'UserService', function($scope, $state, UserService) {

    /*Get Page*/
    $scope.page = {
        name: 'Packages',
        type: 'PACKAGES'
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
    $scope.getCustomerPackages = function() {
        $scope.isLoading = true;
        UserService.getCustomerPackages($scope.data)
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
    $scope.getCustomerPackages();



    /**
     *Clear Search
     */
    $scope.clearSearch = function() {
        $state.go($state.current.name, {
            'search': ''
        });
    }

}]);

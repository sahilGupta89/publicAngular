app.controller('libraryPackagesCtrl', ['$scope', 'UserService', '$state', 'config', function($scope, UserService, $state, config) {

    /*Get Page*/
    $scope.page = {
        name: 'Packages',
        type: 'PACKAGES'
    }

    $scope.$emit('page', $scope.page);


    /**
     *Get search param
     */
    if ($state.params.search) {
        $scope.$emit('search', $state.params.search);
        $scope.search = $state.params.search;
    } else {
        $scope.$emit('search', '');
    }


    /**
     * Get package list
     */
    $scope.getPackages = function() {
        $scope.isLoading = true;

        if ($scope.search) {
            UserService.getPackage({ search: $scope.search })
                .then(function(res) {
                    $scope.isLoading = false;
                    if (res.status == 200) {

                        /*$scope.changeContentUrl(res.data);*/

                        $scope.packages = res.data.closedPackage;
                        $scope.customisedPackage = res.data.customisedPackage;
                    }
                });
        } else {
            UserService.getPackage()
                .then(function(res) {
                    $scope.isLoading = false;
                    if (res.status == 200) {
                        /*$scope.changeContentUrl(res.data);*/
                        $scope.packages = res.data.closedPackage;
                        $scope.customisedPackage = res.data.customisedPackage;
                    }
                });
        }
    }

    /*$scope.changeContentUrl = function(data) {
        angular.forEach(data.closedPackage, function(value, key) {
            value.icon = 'https://' + value.icon.replace(/^http?\:\/\//i, "");
        });
        angular.forEach(data.customisedPackage, function(value, key) {
            value.icon = 'https://' + value.icon.replace(/^http?\:\/\//i, "");
        });
    }*/


    /** 
     *Initialize get package function
     */
    $scope.getPackages();






    /**************************************************************************
        
    ###############################    Search     #############################

    ***************************************************************************/
    /**
     *Clear Search
     */
    $scope.clearSearch = function() {
        $state.go($state.current.name, {
            'search': ''
        });
    }



    /**************************************************************************
        
    ############################    Buy Package     ###########################

    ***************************************************************************/

    /**
     *buy package object
     */
    $scope.data = {
        packageCart: [],
        customPackageCart: []
    };


    /**
     *Get selected packges for data.packageCart object
     */
    $scope.$watchCollection('data.packageCart', function(oldValue, newValue) {
        if (oldValue != newValue) {
            $scope.buyPackageCount();
        }
    });

    /**
     *Get selected packges for data.customPackageCart object
     */
    $scope.$watchCollection('data.customPackageCart', function(oldValue, newValue) {
        if (oldValue != newValue) {
            $scope.buyPackageCount();
        }
    });

    /**
     *Add to buy package count
     */
    $scope.buyPackageCount = function() {
        $scope.totalPackageSelected = parseInt($scope.data.customPackageCart.length) + parseInt($scope.data.packageCart.length);
        if ($scope.totalPackageSelected == 0) {
            $scope.buyLength = false;
        } else {
            $scope.buyLength = '(' + $scope.totalPackageSelected + ')';
        }
        $scope.$emit('buyLength', $scope.buyLength);
    }


    /**
     * Add to cart
     */
    $scope.$parent.addToCart = function() {
        if ($scope.totalPackageSelected == 0 || $scope.totalPackageSelected == undefined) {
            alert(config.message.selectPackage);
            return false;
        } else {
            $scope.Loading = true;
            UserService.addToCart($scope.data, 'PACKAGE')
                .then(function(res) {
                    $scope.Loading = false;
                    if (res.data.statusCode == 200) {
                        console.log(res);
                        $state.go('cart');
                    }
                });
        }
    }

}]);

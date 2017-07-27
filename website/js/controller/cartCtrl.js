app.controller('cartCtrl', ['$scope', '$rootScope', 'UserService', '$window', '$location', '$state', '$sce', 'share', '$timeout', 'config', function($scope, $rootScope, UserService, $window, $location, $state, $sce, share, $timeout, config) {

    if (Object.getOwnPropertyNames($rootScope.globals).length === 2) {
        $scope.user = {
            id: $rootScope.globals.currentUser.data._id,
            type: $rootScope.globals.currentUser.data.userType
        }
    }

    $scope.data = {
        topicType: 'YEARLY'
    }



    if ($scope.user.type == config.userType[2]) {
        $scope.embeddedLink = { 0: '' };
        $scope.isAddEmbedded = true;
    }

    $scope.addMoreDomain = function() {
        var length = Object.keys($scope.embeddedLink).length;
        if (length < 5) {
            
            if($scope.embeddedLink.hasOwnProperty(length)){
                if($scope.embeddedLink[0]==undefined){
                    $scope.embeddedLink[0] = '';    
                }else if($scope.embeddedLink[1]==undefined){
                    $scope.embeddedLink[1] = '';
                }else if($scope.embeddedLink[2]==undefined){
                    $scope.embeddedLink[2] = '';
                }else if($scope.embeddedLink[3]==undefined){
                    $scope.embeddedLink[3] = '';
                }else if($scope.embeddedLink[4]==undefined){
                    $scope.embeddedLink[4] = '';
                }
            }else{
                $scope.embeddedLink[length] = '';    
            }

            if (Object.keys($scope.embeddedLink).length == 5) {
                $scope.isAddEmbedded = false;
            }

            if (Object.keys($scope.embeddedLink).length > 1) {
                angular.element('.embeddedLinksList').addClass('active');
            }
        }
    }


    $scope.removeDomain = function(key) {
        delete $scope.embeddedLink[key];
        if (Object.keys($scope.embeddedLink).length == 1) {
            angular.element('.embeddedLinksList').removeClass('active');
        }
        if (Object.keys($scope.embeddedLink).length < 5) {
            $scope.isAddEmbedded = true;
        }
    }


    /*Get Cart Item*/
    $scope.getCartItem = function() {
        $scope.Loading = true;
        UserService.getCart($scope.data)
            .then(function(res) {
                $scope.Loading = false;
                if (res.success === false) {
                    console.log("there is a prob");
                } else if (res.data.statusCode == 200) {
                    $scope.cart = {
                        topicDetails: res.data.data.topic,
                        packageDetails: res.data.data.package,
                        customPackage: res.data.data.customPackage,
                        payments: res.data.data.payments
                    }
                    $scope.getTotalPrice($scope.cart.payments);
                    //if ($scope.cart.topicDetails) {
                    if ($scope.user.type == config.userType[2]) {
                        if ($scope.cart.topicDetails == undefined) {
                            $scope.noData = true;
                        }
                    } else {
                        if ($scope.cart.topicDetails.length == 0 && $scope.cart.packageDetails.length == 0 && $scope.cart.customPackage.length == 0) {
                            $scope.noData = true;
                        }
                    }

                    //}
                }
            });
    }

    /*Get Total Price*/
    $scope.getTotalPrice = function(data) {
        $scope.totalPrice = data.totalPrice;
    }


    $scope.getCartItem();

    /*Get Topics When Change the Topic Type*/
    $scope.$watch('data.topicType', function(oldValue, newValue) {
        if (oldValue != newValue) {
            if ($scope.user.type != config.userType[2]) {
                $scope.getCartItem();
            }
        }

    });

    /*Remove Cart Item*/
    $scope.removeCartItem = function(data, type) {
        $scope.Loading = true;
        if ($scope.user.type == config.userType[2]) {
            $scope.removeCart = {
                removeId: []
            };
            angular.forEach(data.mergedObject, function(value) {
                $scope.removeCart.removeId.push(value.topicId);
            });
        } else {
            $scope.removeCart = {
                removeId: data
            };
        }

        UserService.removeCart($scope.removeCart, type)
            .then(function(res) {
                if (res.data.statusCode == 200) {
                    $scope.Loading = false;
                    $state.reload();
                }
            });
    }

    /**
     *checkout*
     */
    $scope.checkout = function() {
        var user = $rootScope.globals.currentUser.data;


        if ($scope.user.type == config.userType[2]) {
            $scope.data.domainName = [];
            angular.forEach($scope.embeddedLink, function(value) {
                if (value && $scope.data.domainName.indexOf(value) == -1) {
                    $scope.data.domainName.push(value);
                }
            });
            if ($scope.data.domainName.length > 0) {
                $scope.data.embeddedLink = true;
            } else {
                $scope.data.embeddedLink = false;
            }
        }


        if (user.firstName == null || user.lastName == null || user.state == null || user.city == null || user.zip == null || user.country == null || user.countryCode == null) {
            share.set('checkoutMessage', config.message.completeYourProfile);
            share.setObject('checkoutData', $scope.data);
            $state.go('profile');
        } else {
            $scope.Loading = true;
            UserService.checkout($scope.data)
                .then(function(res) {
                    $scope.Loading = false;

                    $scope.trustSrc = function(src) {
                        return $sce.trustAsResourceUrl(src);
                    }

                    if (res.data.url == '') {
                        angular.element('#checkoutModal').modal('hide');
                        $scope.message = res.data.agentUrl;
                        $scope.cart = {};
                        $scope.noData  = true;
                        $timeout(function() {
                            $scope.message = false;

                            $state.go('mylibrary.topics');

                        }, 3000);
                    } else {
                        $window.location = res.data.url;
                        //$scope.checkoutResponse = res.data.url;
                    }

                });
        }
    }


    angular.element($window).bind('scroll', function(e) {

        if (angular.element('#fixedTopBar').length == 1) {
            if (angular.element('#fixedTopBar').offset().top <= this.pageYOffset) {
                angular.element('#fixedTopBar').addClass('listwithFiilter');
            } else {
                angular.element('#fixedTopBar').removeClass('listwithFiilter');
            }
        }

    });


    /**
     *Set page height
     */
    angular.element('.page-wrapper').css({ 'minHeight': ($window.innerHeight - (parseInt(angular.element('header.navbar').outerHeight()) + 47)) + 'px' });
    angular.element($window).bind('resize', function() {
        angular.element('.page-wrapper').css({ 'minHeight': ($window.innerHeight - (parseInt(angular.element('header.navbar').outerHeight()) + 47)) + 'px' });
    });

}]);

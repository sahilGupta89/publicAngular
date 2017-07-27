app.controller('paymentCtrl', ['$scope', '$window', '$state', function($scope, $window, $state) {

    angular.element('.page-wrapper').css({ 'minHeight': ($window.innerHeight - (parseInt(angular.element('header.navbar').outerHeight()) + 37)) + 'px' });
    angular.element($window).bind('resize', function() {
        angular.element('.page-wrapper').css({ 'minHeight': ($window.innerHeight - (parseInt(angular.element('header.navbar').outerHeight()) + 37)) + 'px' });
    });

}]);

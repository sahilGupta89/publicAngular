app.controller('sterlingCtrl', ['$scope', '$window', '$state', function($scope, $window, $state) {

    angular.element($window).on("contextmenu", function(e) {
        return false;
    });

    angular.element($window).on('keydown', function(e) {
        var keystroke = String.fromCharCode(e.keyCode).toLowerCase();
        if (e.ctrlKey && (keystroke == 'c' || keystroke == 'v')) {
            return false;
        }
        var code = e.keyCode || e.which;
        if (code == 123) {
            return false;
        }
    });


}]);

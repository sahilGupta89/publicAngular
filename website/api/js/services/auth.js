app.factory('auth', ['$window', '$location', function($window, $location) {
    return {
        referrer: function() {
            var input = document.referrer;
            if (input) {
                input = input.replace(/(www\.)/i, "");
                if (!input.match(/(http\:)|(https\:)/i)) {
                    input = 'http://' + input;
                };
                var url = new URL(input);
                return url.hostname;
            } else {
                $window.location.href = 'http://' + $location.$$host;
            }
        },
        settings: function() {
            angular.element($window).bind("contextmenu", function(e) {
                e.preventDefault();
            });
        }
    }
}]);

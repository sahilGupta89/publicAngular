app.directive('jwplayer', ['$compile', function($compile) {
    return {
        restrict: 'EC',
        scope: {
            playerId: '@',
            playerUrl: '=url'

        },
        link: function(scope, element, attrs) {

            var id = scope.playerId || 'random_player_' + Math.floor((Math.random() * 999999999) + 1),
                getTemplate = function(playerId) {
                    return '<div id="' + playerId + '"></div>';
                };

            element.html(getTemplate(id));
            $compile(element.contents())(scope);

            function jwPlayerVideo() {

                jwplayer(id).setup({
                    file: scope.playerUrl,
                    allowfullscreen: false,
                    usefullscreen: false
                        //autostart: true,
                        //height: 360,
                        //width: 640
                });
            }

            scope.$watch('playerUrl', function(oldValue, newValue) {
                jwPlayerVideo();
            });

        }
    };
}]);

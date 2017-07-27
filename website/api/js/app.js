var app = angular.module('pixelsEdApis', ['ui.router']);

app.config(['$stateProvider', '$locationProvider', '$urlRouterProvider', function($stateProvider, $locationProvider, $urlRouterProvider) {

    jwplayer.key = "pas6PhskOhNhbJ6Dz4UZXusRPUo0Ke9innm5hVm5yk8=";

    $urlRouterProvider.otherwise('/');
    $stateProvider
        .state('video', {
            url: "/v/:user/:id",
            views: {
                "pages": {
                    templateUrl: "views/video.html",
                    controller: 'videoCtrl'
                }
            }
        })

    .state('error', {
        url: "/",
        onEnter: function($window, $location) {
            $window.location.href = 'http://' + $location.$$host + '/api/error.html';
        }
    })

    .state('content', {
        url: "/content/:id",
        views: {
            "pages": {
                templateUrl: "views/content.html",
                controller: 'contentCtrl'
            }
        }
    })


}]);

app.run(['$rootScope', '$state', function($rootScope, $state) {

}]);

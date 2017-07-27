app.controller('HomeCtrl', ['$scope', '$window', '$state', '$compile', function($scope, $window, $state, $compile) {

    /*Own Crausal*/
    $('#le-menu').owlCarousel({
        loop: false,
        margin: 15,
        nav: true,
        dots: false,
        mouseDrag: true,
        responsive: {
            0: {
                items: 2
            },
            600: {
                items: 3
            },
            768: {
                items: 4
            },
            1000: {
                items: 5
            }
        }
    });



    jwplayer('BannerVid').setup({
        file: 'https://s3.amazonaws.com/sterling-live/TEST/vC9KR.m3u8.m3u8',
        'autostart': true,
        'autoplay': true,
        'repeat': 'always',
        controls: false,
        stretching: "fill",
        aspectratio: "1:1",
        height: '100%',
        width: '100%',
        mute: true,
    });


    jwplayer('HDVid').setup({
        file: 'https://s3.amazonaws.com/sterling-live/TEST/j84jc.m3u8.m3u8',
        'autostart': false,
        'autoplay': false,
        controls: true,
        mute: true,
    });


    angular.element('.landing-pg').css({ 'height': ($window.innerHeight - (parseInt(angular.element('header.navbar').outerHeight()))) + 'px' });
    angular.element($window).bind('resize', function() {
        angular.element('.landing-pg').css({ 'height': ($window.innerHeight - (parseInt(angular.element('header.navbar').outerHeight()))) + 'px' });
    });

}]);

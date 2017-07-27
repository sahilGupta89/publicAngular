app.factory('favicoService', function() {

    var favico = new Favico({
        type: 'rectangle',
        animation: 'slide',
        bgColor: '#fff',
        textColor: '#000'
    });

    var badge = function(num) {
        favico.badge(num);
    };
    var reset = function() {
        favico.reset();
    };

    return {
        badge: badge,
        reset: reset
    };

});

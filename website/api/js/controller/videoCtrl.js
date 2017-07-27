app.controller('videoCtrl', ['$scope', '$state', '$location', '$window', 'auth', 'http', function($scope, $state, $location, $window, auth, http) {

    auth.settings();

    /**
     * check document.referrer, params values
     */
    if (auth.referrer() && $state.params.user && $state.params.id) {
        /**
         *Object for get url
         */
        var data = {
            customerId: $state.params.user,
            contentId: $state.params.id,
            domainName: auth.referrer()
        }

        $scope.isContent = false;

        /**
         *Get embedded links
         *@param data = object of customerId, contentId, domainName
         */
        http.checkingOfEmbeddedLinks(data)
            .then(function(res) {
                if (res.data.statusCode == 200) {
                    $scope.isContent = true;
                    $scope.contentUrl = res.data.contentUrl;
                } else {
                    $window.location.href = 'http://' + $location.$$host + '/api/error.html';
                }
            })
    } else {
        $window.location.href = 'http://' + $location.$$host + '/api/error.html';
    }

}]);

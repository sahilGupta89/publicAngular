app.controller('contentCtrl', ['$scope', '$state', '$location', '$window', 'http', function($scope, $state, $location, $window, http) {
    if ($state.params.id) {
        var data = {
            contentId: $state.params.id
        }

        $scope.isLoadind = true;
        /**
         *Get embedded links
         *@param data = object of contentId
         */
        http.getDataBasedOnContentId(data)
            .then(function(res) {
                if (res.status == 200) {
                    $scope.isLoadind = false;
                    $scope.contentUrl = res.data.contentUrl;
                }
            })
    } else {
        $window.location.href = 'http://' + $location.$$host + '/api/error.html';
    }


}]);

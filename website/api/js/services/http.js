app.factory('http', ['$http', function($http) {

    //var url = "https://www.pixelsed.com/api/";
    var url = "http://35.154.8.228:8000/api/";


    var service = {};
    service.checkingOfEmbeddedLinks = checkingOfEmbeddedLinks;
    service.getDataBasedOnContentId = getDataBasedOnContentId;
    return service;

    /**
     * Get embedded links for domain
     */
    function checkingOfEmbeddedLinks(data) {
        return $http.post(url + 'customer/checkingOfEmbeddedLinks', data).then(handleSuccess, handleError('Error getting user'));
    }
    /**
     * Get embedded links
     */
    function getDataBasedOnContentId(data) {
        return $http.post(url + 'superAdmin/getDataBasedOnContentId', data).then(handleSuccess, handleError('Error getting user'));
    }

    /**
     *************************   private functions   *************************
     */
    function handleSuccess(response) {
        return response;
    }

    function handleError(error) {
        return function() {
            return { success: false, message: error };
        };
    }

}]);

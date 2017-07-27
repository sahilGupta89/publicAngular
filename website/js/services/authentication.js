app.factory('AuthenticationService', ['$http', '$cookieStore', '$rootScope', '$timeout', 'UserService','share', function($http, $cookieStore, $rootScope, $timeout, UserService,share) {

    var service = {};
    service.Forgot = Forgot;
    service.SetCredentials = SetCredentials;
    service.ClearCredentials = ClearCredentials;
    return service;

    function Forgot(username, type, callback) {
        $timeout(function() {
            var response;
            UserService.GetByUsername(username, type)
                .then(function(user) {
                    if (Object.getOwnPropertyNames(user).length === 0 || user[0].username != username) {
                        response = { success: false, message: 'Invalid User.' };
                    } else {
                        response = { success: true, message: 'Please check your mail to reset password.' };
                    }
                    callback(response);
                });
        }, 1000);
    }


    function SetCredentials(data, token) {
        $rootScope.globals = {
            token: token,
            currentUser: {
                data: data
            }
        };
        $cookieStore.put('globals', $rootScope.globals);
        $http.defaults.headers.common['Authorization'] = token;
    }

    function ClearCredentials() {
        $rootScope.globals = {};
        $cookieStore.remove('globals');
        $http.defaults.headers.common.Authorization = '';
        $rootScope.loggedIn = false;
        $rootScope.userType = false;
    }

}]);

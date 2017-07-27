app.factory('UserService', ['Upload', '$rootScope', '$cookies', '$http', '$timeout', '$compile', '$cookieStore', '$state', 'share', 'config', function(Upload, $rootScope, $cookies, $http, $timeout, $compile, $cookieStore, $state, share, config) {

    var apiUrl = config.apiUrl;
    var service = {};
    /*Login Register*/
    service.AddUser = AddUser;
    service.RegUser = RegUser;
    service.LoginUser = LoginUser;
    service.updatePassword = updatePassword;
    service.CustomerList = CustomerList;
    service.listing = listing;
    /*OTP*/
    service.verifyOTP = verifyOTP;
    service.resendOTP = resendOTP;
    service.checkOTP = checkOTP;
    service.verifyOTPeditProfile = verifyOTPeditProfile;
    /*Profile*/
    service.forgetPassword = forgetPassword;
    service.resetPassword = resetPassword;
    service.getProfile = getProfile;
    service.editProfile = editProfile;
    /*Topics api*/
    service.getFilters = getFilters;
    service.topics = topics;
    service.topicDetail = topicDetail;
    service.createComment = createComment;
    service.getCategoryContent = getCategoryContent;
    service.getSubCategoryContent = getSubCategoryContent;
    service.getAssessments = getAssessments;
    service.addAnalysisData = addAnalysisData;
    /*Favourite*/
    service.markFavourite = markFavourite;
    service.unmarkFavourite = unmarkFavourite;
    /*Note*/
    service.getNote = getNote;
    service.savenote = savenote;
    /*Package*/
    service.getPackage = getPackage;
    service.getPackageInfo = getPackageInfo;
    service.getCustomerPackages = getCustomerPackages;
    service.getCustomerTopicPackages = getCustomerTopicPackages;
    service.renewExpirey = renewExpirey;
    service.deleteBooking = deleteBooking;
    service.getExpiredPackages = getExpiredPackages;
    /*Cart*/
    service.addToCart = addToCart;
    service.selectAllAddToCart = selectAllAddToCart;
    service.getCart = getCart;
    service.cartNumber = cartNumber;
    service.removeCart = removeCart;
    service.checkout = checkout;
    service.transactionSuccessful = transactionSuccessful;
    service.transactionFailed = transactionFailed;
    /*Customer*/
    service.addCustomer = addCustomer;
    service.getCustomers = getCustomers;
    service.getGradeAndCountryList = getGradeAndCountryList;
    service.getPurchasedTopics = getPurchasedTopics;
    service.customerUploadViaCSV = customerUploadViaCSV;
    service.shareContent = shareContent;
    service.sharedTopicHistory = sharedTopicHistory
        /*Agents*/
    service.getAgents = getAgents;
    service.editAgent = editAgent;
    service.blockAgent = blockAgent;
    service.unblockAgent = unblockAgent;
    service.deleteAssignedContent = deleteAssignedContent;
    /*Notification*/
    service.notificationsCount = notificationsCount;
    service.getAllNotifications = getAllNotifications;
    /*Dashboard*/
    service.dashboard = dashboard;
    return service;

    //Login User
    function LoginUser(data, type) {
        return $http.post(apiUrl + type, data).then(handleSuccess, handleError('Error getting user by username'));
    }

    /*Update Password*/
    function updatePassword(data) {
        return $http.post(apiUrl + 'updatePassword', data).then(handleSuccess, handleError('Error getting user by username'));
    }

    /*Edit Profile*/
    function editProfile(data, profilePic) {
        if (profilePic == false) {
            return $http.post(apiUrl + "editProfile", data).then(handleSuccess, handleError('Error getting user by username'));
        } else {
            profilePic.upload = Upload.upload({
                method: 'POST',
                url: apiUrl + 'editProfile',
                data: data
            });
            return profilePic.upload.then(handleSuccess, handleError('Error getting user by username'));
        }
    }

    //Add User
    function AddUser(data) {
        return $http.post(apiUrl + "register", data).then(handleSuccess, handleError('Error getting user by username'));
    }

    function RegUser(data, profilePic) {
        profilePic.upload = Upload.upload({
            method: 'POST',
            url: apiUrl + 'register',
            data: data
        });
        return profilePic.upload.then(handleSuccess, handleError('Error getting user by username'));
    }

    /*verify OTP Edit Profile*/
    function verifyOTPeditProfile(data) {
        return $http.post(apiUrl + "verifyOTPeditProfile", data).then(handleSuccess, handleError('Error getting user by username'));
    }

    //Send OTP
    function verifyOTP(data, token) {
        var req = {
            method: 'POST',
            url: apiUrl + "verifyOTP",
            headers: {
                'Authorization': token
            },
            data: data
        }
        return $http(req).then(handleSuccess, handleError('Error getting user by username'));
    }

    //Resend OTP
    function resendOTP(data, token) {
        var req = {
            method: 'POST',
            url: apiUrl + "resendOTP",
            headers: {
                'Authorization': token
            },
            data: data
        }
        return $http(req).then(handleSuccess, handleError('Error getting user by username'));
    }

    //Forgot Password
    function forgetPassword(data) {
        return $http.post(apiUrl + "forgetPassword", data).then(handleSuccess, handleError('Error getting user by username'));
    }

    //check OTP
    function checkOTP(data) {
        return $http.post(apiUrl + "checkOTP", data).then(handleSuccess, handleError('Error getting user by username'));
    }

    //Reset Password
    function resetPassword(data) {
        return $http.post(apiUrl + "resetPassword", data).then(handleSuccess, handleError('Error getting user by username'));
    }

    //Customer List
    function CustomerList() {
        return $http.get(apiUrl + 'listing').then(handleSuccess, handleError('Error getting user'));
    }

    //Get Curriculum and grade
    function listing(data) {
        return $http.post(apiUrl + "listing", data).then(handleSuccess, handleError('Error getting user'));
    }

    //Get Profile Data
    function getProfile(data) {
        return $http.post(apiUrl + 'getProfile/', data).then(handleSuccess, handleError('Error getting user'));
    }

    //Get Filters
    function getFilters(data) {
        return $http.post(apiUrl + 'getFilters', data).then(handleSuccess, handleError('Error getting user'));
    }

    //Topic Library List
    function topics(data, type) {
        return $http.post(apiUrl + "topicLibrary/" + type, data).then(handleSuccess, handleError('Error getting user'));
    }

    /*getPackageInfo*/
    function getPackageInfo(data) {
        return $http.post(apiUrl + "getPackageInfo", data).then(handleSuccess, handleError('Error getting user'));
    }

    /*get Expired Packages*/
    function getExpiredPackages(data) {
        return $http.post(apiUrl + "getExpiredPackages", data).then(handleSuccess, handleError('Error getting user'));
    }

    /*get Customer Packages*/
    function getCustomerPackages(data) {
        return $http.post(apiUrl + "getCustomerPackages", data).then(handleSuccess, handleError('Error getting user'));
    }
    /*getCustomerTopicPackages*/
    function getCustomerTopicPackages(data) {
        return $http.post(apiUrl + "getCustomerTopicPackages", data).then(handleSuccess, handleError('Error getting user'));
    }

    // renewExpirey
    function renewExpirey(data) {
        return $http.post(apiUrl + "renewExpirey", data).then(handleSuccess, handleError('Error getting user'));
    }

    // deleteBooking
    function deleteBooking(data) {
        return $http.post(apiUrl + "deleteBooking", data).then(handleSuccess, handleError('Error getting user'));
    }




    //Topic Detail
    function topicDetail(data) {
        return $http.post(apiUrl + "topicDetails", data).then(handleSuccess, handleError('Error getting user'));
    }
    //Get Category Content
    function getCategoryContent(data) {
        return $http.post(apiUrl + "getCategoryContent", data).then(handleSuccess, handleError('Error getting user'));
    }
    //Get Sub Category Content
    function getSubCategoryContent(data) {
        return $http.post(apiUrl + "getSubCategoryContent", data).then(handleSuccess, handleError('Error getting user'));
    }

    //Topic Detail
    function createComment(data) {
        return $http.post(apiUrl + "createComment", data).then(handleSuccess, handleError('Error getting user'));
    }
    //get Assessments 
    function getAssessments(data) {
        return $http.post(apiUrl + "getAssessments", data).then(handleSuccess, handleError('Error getting user'));
    }
    //addAnalysisData
    function addAnalysisData(data) {
        return $http.post(apiUrl + "addAnalysisData", data).then(handleSuccess, handleError('Error getting user'));
    }

    /*Mark Favourite*/
    function markFavourite(data) {
        return $http.post(apiUrl + "markFavourite", data).then(handleSuccess, handleError('Error getting user'));
    }

    /*unmark Favourite*/
    function unmarkFavourite(data) {
        return $http.post(apiUrl + "unmarkFavourite", data).then(handleSuccess, handleError('Error getting user'));
    }

    /*Save Note*/
    function savenote(data) {
        return $http.post(apiUrl + "savenote", data).then(handleSuccess, handleError('Error getting user'));
    }

    /*Get Note*/
    function getNote(data) {
        return $http.post(apiUrl + "getNote", data).then(handleSuccess, handleError('Error getting user'));
    }

    //Add To Cart
    function addToCart(data, type) {
        return $http.post(apiUrl + "addToCart/" + type, data).then(handleSuccess, handleError('Error getting user'));
    }
    //Add To Cart
    function selectAllAddToCart(data) {
        return $http.post(apiUrl + "selectAllAddToCart", data).then(handleSuccess, handleError('Error getting user'));
    }

    //Get Cart
    function getCart(data) {
        return $http.post(apiUrl + "getCart", data).then(handleSuccess, handleError('Error getting user'));
    }
    //Get Cart Number
    function cartNumber(data) {
        return $http.post(apiUrl + "cartNumber", data).then(handleSuccess, handleError('Error getting user'));
    }
    //Remove Cart Item
    function removeCart(data, type) {
        return $http.post(apiUrl + "removeCart/" + type, data).then(handleSuccess, handleError('Error getting user'));
    }

    /*checkout*/
    function checkout(data) {
        return $http.post(apiUrl + "checkout", data).then(handleSuccess, handleError('Error getting user'));
    }

    /*transactionSuccessful*/
    function transactionSuccessful(data) {
        return $http.post(apiUrl + "transactionSuccessful", data).then(handleSuccess, handleError('Error getting user'));
    }

    /*transactionFailed*/
    function transactionFailed(data) {
        return $http.post(apiUrl + "transactionFailed", data).then(handleSuccess, handleError('Error getting user'));
    }

    //Get Package Content
    function getPackage(data) {
        return $http.post(apiUrl + 'getPackage', data).then(handleSuccess, handleError('Error getting user'));
    }


    /**************************************
                Customer Api's
    **************************************/
    /*Add Customer*/
    function addCustomer(data, profilePic) {
        if (profilePic == '') {
            return $http.post(apiUrl + 'addCustomer', data).then(handleSuccess, handleError('Error getting user'));
        } else {
            profilePic.upload = Upload.upload({
                method: 'POST',
                url: apiUrl + 'addCustomer',
                data: data
            });
            return profilePic.upload.then(handleSuccess, handleError('Error getting user by username'));
        }
    }

    /*Edit Agent*/
    function editAgent(data, profilePic) {
        if (profilePic == '') {
            return $http.post(apiUrl + 'editAgent', data).then(handleSuccess, handleError('Error getting user'));
        } else {
            profilePic.upload = Upload.upload({
                method: 'POST',
                url: apiUrl + 'editAgent',
                data: data
            });
            return profilePic.upload.then(handleSuccess, handleError('Error getting user by username'));
        }
    }

    /*Get Customer*/
    function getCustomers(data) {
        return $http.post(apiUrl + 'getCustomers', data).then(handleSuccess, handleError('Error getting user'));
    }

    /*sharedTopicHistory*/
    function sharedTopicHistory(data) {
        return $http.post(apiUrl + 'sharedTopicHistory', data).then(handleSuccess, handleError('Error getting user'));
    }

    /*getGradeAndCountryList*/
    function getGradeAndCountryList() {
        return $http.post(apiUrl + 'getGradeAndCountryList').then(handleSuccess, handleError('Error getting user'));
    }
    /*getPurchasedTopics*/
    function getPurchasedTopics(data) {
        return $http.post(apiUrl + 'getPurchasedTopics', data).then(handleSuccess, handleError('Error getting user'));
    }

    /*Add Customer Via CSV*/
    function customerUploadViaCSV(data) {
        data.upload = Upload.upload({
            method: 'POST',
            url: apiUrl + 'customerUploadViaCSV'
        });
        return data.upload.then(handleSuccess, handleError('Error getting user by username'));
    }

    /*shareContent*/
    function shareContent(data) {
        return $http.post(apiUrl + 'shareContent', data).then(handleSuccess, handleError('Error getting user'));
    }



    /*get Agents*/
    function getAgents() {
        return $http.post(apiUrl + 'getAgents').then(handleSuccess, handleError('Error getting user'));
    }
    /*Block Agents*/
    function blockAgent(data) {
        return $http.post(apiUrl + 'blockAgent', data).then(handleSuccess, handleError('Error getting user'));
    }

    /*Unblock Agents*/
    function unblockAgent(data) {
        return $http.post(apiUrl + 'unblockAgent', data).then(handleSuccess, handleError('Error getting user'));
    }
    /*delete Assigned Content Agents*/
    function deleteAssignedContent(data) {
        return $http.post(apiUrl + 'deleteAssignedContent', data).then(handleSuccess, handleError('Error getting user'));
    }



    /**
     * Get notification count
     */
    function notificationsCount() {
        return $http.get(apiUrl + 'notificationsCount').then(handleSuccess, handleError('Error getting user'));
    }

    /**
     * Get notification data
     */
    function getAllNotifications(data) {
        return $http.post(apiUrl + 'getAllNotifications', data).then(handleSuccess, handleError('Error getting user'));
    }

    /*Dashboard*/
    function dashboard() {
        return $http.post(apiUrl + 'dashboard').then(handleSuccess, handleError('Error getting user'));
    }


    // private functions
    function handleSuccess(response) {
        if (response.data.statusCode == '403') {
            share.set('invalidMsg', response.data.customMessage);
            share.remove('PxEd');
            $rootScope.globals = {};
            $cookieStore.remove('globals');
            $http.defaults.headers.common.Authorization = '';
            $rootScope.loggedIn = false;
            $rootScope.userType = false;
            $state.go('login');
        } else {
            return response;
        }
    }

    function handleError(error) {
        return function() {
            return { success: false, message: error };
        };
    }

}]);

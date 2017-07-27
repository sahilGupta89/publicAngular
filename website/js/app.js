var app = angular.module('sterlingApp', [
    'ui.router',
    'ngCookies',
    'ngSanitize',
    'ui.bootstrap',
    'ngFileUpload',
    'vsGoogleAutocomplete',
    'googleplus',
    'ngFacebook',
    'pascalprecht.translate',
    'checklist-model',
    'angular-pdf-viewer',
    '720kb.socialshare',
    'ui.multiselect',
    'base64'

]);

app.config(['$stateProvider', '$locationProvider', '$urlRouterProvider', 'GooglePlusProvider', '$facebookProvider', '$httpProvider', '$translateProvider', 'config', function($stateProvider, $locationProvider, $urlRouterProvider, GooglePlusProvider, $facebookProvider, $httpProvider, $translateProvider, config) {
    /*Translate Provider*/

    $translateProvider.useStaticFilesLoader({
        prefix: 'json/language/locale-',
        suffix: '.json'
    });
    // load 'en' table on startup
    $translateProvider.preferredLanguage('en');
    /*jwplayer*/
    jwplayer.key = config.jwplayerKey;
    /*google plus*/
    GooglePlusProvider.init({
        clientId: config.googleClientId,
        apiKey: config.googleApiKey
    });
    /*facebook*/
    $facebookProvider.setAppId(config.facebookSetAppId);
    $facebookProvider.setVersion(config.facebookSetVersion);

    $urlRouterProvider.otherwise('/');

    $stateProvider
        .state('home', {
            url: "/",
            views: {
                "header": {
                    templateUrl: "views/partial/header.html",
                    controller: 'headerCtrl'
                },
                "page": {
                    templateUrl: "views/home.html",
                    controller: 'HomeCtrl'
                },
                "footer": {
                    templateUrl: "views/partial/footer.html"
                }
            }
        })

    .state('contact', {
        url: "/contact",
        views: {
            "header": {
                templateUrl: "views/partial/header.html",
                controller: 'headerCtrl'
            },
            "page": {
                templateUrl: "views/contact.html"
            },
            "footer": {
                templateUrl: "views/partial/footer.html"
            }
        }
    })


    .state('login', {
        url: "/login",
        views: {
            "header": {
                templateUrl: "views/partial/header.html",
                controller: 'headerCtrl'
            },
            "page": {
                templateUrl: "views/login/login.html",
                controller: 'loginCtrl'
            },
            "footer": {
                templateUrl: "views/partial/footer.html"
            }
        },
        onEnter: function($state, $rootScope) {
            if ($rootScope.loggedIn) {
                if ($rootScope.userType == 'SUB_AGENT' || $rootScope.userType == 'SCHOOL') {
                    $state.go('mylibrary.topics');
                } else {
                    $state.go('library.topics');
                }
            }
        }
    })


    .state('forgotpassword', {
        url: "/forgotpassword",
        views: {
            "header": {
                templateUrl: "views/partial/header.html",
                controller: 'headerCtrl'
            },
            "page": {
                templateUrl: "views/login/forgotPassword.html",
                controller: 'forgotPasswordCtrl'
            },
            "footer": {
                templateUrl: "views/partial/footer.html"
            }
        },
        onEnter: function($state, $rootScope) {
            if ($rootScope.loggedIn) {
                if ($rootScope.userType == 'SUB_AGENT' || $rootScope.userType == 'SCHOOL') {
                    $state.go('mylibrary.topics');
                } else {
                    $state.go('library.topics');
                }
            }
        }
    })


    .state('register', {
        url: "/register",
        views: {
            "header": {
                templateUrl: "views/partial/header.html",
                controller: 'headerCtrl'
            },
            "page": {
                templateUrl: "views/register.html",
                controller: 'RegisterCtrl'
            },
            "footer": {
                templateUrl: "views/partial/footer.html"
            }
        },
        onEnter: function($state, $rootScope) {
            if ($rootScope.loggedIn) {
                if ($rootScope.userType == 'SUB_AGENT' || $rootScope.userType == 'SCHOOL') {
                    $state.go('mylibrary.topics');
                } else {
                    $state.go('library.topics');
                }
            }
        }
    })



    /****************************    Topic detail state    *******************************/
    .state('topic', {
        url: "/topic",
        views: {
            "header": {
                templateUrl: "views/partial/header.html",
                controller: 'headerCtrl'
            },
            "page": {
                templateUrl: "views/topic/index.html",
                controller: 'topicCtrl'
            },
            "footer": {
                templateUrl: "views/partial/footer.html"
            }
        },
        onEnter: function($state, $rootScope) {
            if (!$rootScope.loggedIn) {
                $state.go('login');
            }
        }
    })

    .state('topic.content', {
        url: "/content/:language/:name",
        views: {
            "topic": {
                templateUrl: "views/topic/content.html",
                controller: 'topicContentCtrl'
            }
        }
    })

    .state('topic.assesment', {
        url: "/assesment/:language/:name",
        views: {
            "topic": {
                templateUrl: "views/topic/assesment.html",
                controller: 'topicAssesmentCtrl'
            }
        }
    })



    /****************************    Topic library state    *******************************/

    .state('library', {
        url: "/home",
        views: {
            "header": {
                templateUrl: "views/partial/header.html",
                controller: 'headerCtrl'
            },
            "page": {
                templateUrl: "views/library/index.html",
                controller: 'libraryCtrl'
            },
            "footer": {
                templateUrl: "views/partial/footer.html"
            }
        },
        onEnter: function($state, $rootScope) {
            if ($rootScope.loggedIn) {
                if ($rootScope.userType == 'SUB_AGENT' || $rootScope.userType == 'SCHOOL') {
                    $state.go('mylibrary.topics');
                }
            } else {
                $state.go('login');
            }
        }
    })

    .state('library.packages', {
        url: "/packages?search",
        views: {
            "library": {
                templateUrl: "views/library/packages.html",
                controller: 'libraryPackagesCtrl'
            }
        },
        onEnter: function($state, $rootScope) {
            if ($rootScope.userType == 'AGENT') {
                $state.go('library.topics');
            }
        }
    })

    .state('library.package', {
        url: "/package/:id?search?pack",
        views: {
            "library": {
                templateUrl: "views/library/topics.html",
                controller: 'libraryTopicsCtrl'
            }
        },
        onEnter: function($state, $rootScope) {
            if ($rootScope.userType == 'AGENT') {
                $state.go('library.topics');
            }
        }
    })




    .state('library.bulk', {
        url: "/bulk?search",
        views: {
            "library": {
                templateUrl: "views/library/bulk.html",
                controller: 'libraryBulkTopicsCtrl'
            }
        }
    })



    .state('library.topics', {
        url: "/topics?search",
        views: {
            "library": {
                templateUrl: "views/library/topics.html",
                controller: 'libraryTopicsCtrl'
            }
        }
    })

    .state('library.bestsellers', {
        url: "/bestsellers?search",
        views: {
            "library": {
                templateUrl: "views/library/topics.html",
                controller: 'libraryTopicsCtrl'
            }
        },
        onEnter: function($state, $rootScope) {
            if ($rootScope.userType == 'AGENT') {
                $state.go('library.topics');
            }
        }
    })

    .state('library.newrelease', {
        url: "/newrelease?search",
        views: {
            "library": {
                templateUrl: "views/library/topics.html",
                controller: 'libraryTopicsCtrl'
            }
        },
        onEnter: function($state, $rootScope) {
            if ($rootScope.userType == 'AGENT') {
                $state.go('library.topics');
            }
        }
    })

    .state('library.freetopics', {
        url: "/freetopics?search",
        views: {
            "library": {
                templateUrl: "views/library/topics.html",
                controller: 'libraryTopicsCtrl'
            }
        },
        onEnter: function($state, $rootScope) {
            if ($rootScope.userType == 'AGENT') {
                $state.go('library.topics');
            }
        }
    })

    .state('library.favourite', {
        url: "/favourite?search",
        views: {
            "library": {
                templateUrl: "views/library/topics.html",
                controller: 'libraryTopicsCtrl'
            }
        },
        onEnter: function($state, $rootScope) {
            if ($rootScope.userType == 'AGENT') {
                $state.go('library.topics');
            }
        }
    })

    .state('library.history', {
        url: "/history?search",
        views: {
            "library": {
                templateUrl: "views/library/topics.html",
                controller: 'libraryTopicsCtrl'
            }
        },
        onEnter: function($state, $rootScope) {
            if ($rootScope.userType == 'AGENT') {
                $state.go('library.topics');
            }
        }
    })



    /****************************    Topic my library state    *******************************/

    .state('mylibrary', {
        url: "/mylibrary",
        views: {
            "header": {
                templateUrl: "views/partial/header.html",
                controller: 'headerCtrl'
            },
            "page": {
                templateUrl: "views/mylibrary/index.html",
                controller: 'myLibraryCtrl'
            },
            "footer": {
                templateUrl: "views/partial/footer.html"
            }
        },
        onEnter: function($state, $rootScope) {
            if (!$rootScope.loggedIn) {
                $state.go('login');
            }
        }
    })

    .state('mylibrary.topics', {
        url: "/topics?search",
        views: {
            "mylibrary": {
                templateUrl: "views/mylibrary/topics.html",
                controller: 'myLibraryTopicsCtrl'
            }
        }
    })

    .state('mylibrary.packages', {
        url: "/packages?search",
        views: {
            "mylibrary": {
                templateUrl: "views/mylibrary/packages.html",
                controller: 'myLibraryPackagesCtrl'
            }
        }
    })

    .state('mylibrary.expired', {
        url: "/expired?search",
        views: {
            "mylibrary": {
                templateUrl: "views/mylibrary/expired.html",
                controller: 'myLibraryExpiredPackagesCtrl'
            }
        }
    })


    .state('mylibrary.packagedetail', {
        url: "/package/:id?search?pack?name?renew",
        views: {
            "mylibrary": {
                templateUrl: "views/mylibrary/topics.html",
                controller: 'myLibraryTopicsCtrl'
            }
        }
    })


    .state('cart', {
        url: "/cart",
        views: {
            "header": {
                templateUrl: "views/partial/header.html",
                controller: 'headerCtrl'
            },
            "page": {
                templateUrl: "views/cart.html",
                controller: 'cartCtrl'
            },
            "footer": {
                templateUrl: "views/partial/footer.html"
            }
        },
        onEnter: function($state, $rootScope) {
            if ($rootScope.loggedIn) {
                if ($rootScope.userType == 'SUB_AGENT' || $rootScope.userType == 'SCHOOL') {
                    $state.go('mylibrary.topics');
                }
            } else {
                $state.go('login');
            }
        }
    })

    .state('payment', {
        url: "/payment",
        views: {
            "header": {
                templateUrl: "views/partial/header.html",
                controller: 'headerCtrl'
            },
            "page": {
                templateUrl: "views/payment/index.html",
                controller: 'paymentCtrl'
            },
            "footer": {
                templateUrl: "views/partial/footer.html"
            }
        },
        onEnter: function($state, $stateParams, $rootScope) {
            if ($rootScope.loggedIn) {
                if ($rootScope.userType == 'SUB_AGENT' || $rootScope.userType == 'SCHOOL') {
                    $state.go('mylibrary.topics');
                }
            } else {
                $state.go('login');
            }
        }
    })

    .state('payment.success', {
        url: "/successful",
        views: {
            "payment": {
                templateUrl: "views/payment/success.html",
            }
        }
    })

    .state('payment.failed', {
        url: "/failed",
        views: {
            "payment": {
                templateUrl: "views/payment/failed.html",
            }
        }
    })

    .state('profile', {
        url: "/profile",
        views: {
            "header": {
                templateUrl: "views/partial/header.html",
                controller: 'headerCtrl'
            },
            "page": {
                templateUrl: "views/profile/index.html",
                controller: 'profileCtrl'
            },
            "footer": {
                templateUrl: "views/partial/footer.html"
            }
        },
        onEnter: function($state, $rootScope) {
            if (!$rootScope.loggedIn) {
                $state.go('login');
            }
        }
    })

    /****************************    Customer state    *******************************/

    .state('customer', {
        url: "/customer",
        views: {
            "header": {
                templateUrl: "views/partial/header.html",
                controller: 'headerCtrl'
            },
            "page": {
                templateUrl: "views/customer/index.html",
                controller: 'customerCtrl'
            },
            "footer": {
                templateUrl: "views/partial/footer.html"
            }
        },
        onEnter: function($state, $rootScope) {
            if ($rootScope.loggedIn) {
                if ($rootScope.userType == 'STUDENT') {
                    $state.go('mylibrary.topics');
                }
            } else {
                $state.go('login');
            }
        }
    })

    .state('customer.list', {
        url: "/list",
        views: {
            "customer": {
                templateUrl: "views/customer/customerList.html",
                controller: 'customerListCtrl'
            }
        }
    })

    .state('customer.add', {
        url: "/add",
        views: {
            "customer": {
                templateUrl: "views/customer/customerAdd.html",
                controller: 'customerAddCtrl'
            }
        }
    })

    .state('customer.edit', {
        url: "/edit/:id",
        views: {
            "customer": {
                templateUrl: "views/customer/customerAdd.html",
                controller: 'customerAddCtrl'
            }
        }
    })

    .state('customer.view', {
        url: "/detail/:id",
        views: {
            "customer": {
                templateUrl: "views/customer/customerView.html",
                controller: 'customerViewCtrl'
            }
        }
    })

    .state('customer.share', {
        url: "/share",
        views: {
            "customer": {
                templateUrl: "views/customer/customerShareTopic.html",
                controller: 'customerShareTopicCtrl'
            }
        }
    })

    /****************************    Settigns    *******************************/
    .state('settings', {
        url: "/settings",
        views: {
            "header": {
                templateUrl: "views/partial/header.html",
                controller: 'headerCtrl'
            },
            "page": {
                templateUrl: "views/settings.html",
                controller: 'settingsCtrl'
            },
            "footer": {
                templateUrl: "views/partial/footer.html"
            }
        },
        onEnter: function($state, $rootScope) {
            if (!$rootScope.loggedIn) {
                $state.go('login');
            }
        }
    })

    /****************************    Notifications    *******************************/
    .state('notification', {
        url: "/notification",
        views: {
            "header": {
                templateUrl: "views/partial/header.html",
                controller: 'headerCtrl'
            },
            "page": {
                templateUrl: "views/notifications.html",
                controller: 'notificationCtrl'
            },
            "footer": {
                templateUrl: "views/partial/footer.html"
            }
        },
        onEnter: function($state, $rootScope) {
            if (!$rootScope.loggedIn) {
                $state.go('login');
            }
        }
    })


    /****************************    Dashboard    *******************************/
    .state('dashboard', {
        url: "/dashboard",
        views: {
            "header": {
                templateUrl: "views/partial/header.html",
                controller: 'headerCtrl'
            },
            "page": {
                templateUrl: "views/dashboard.html",
                controller: 'dashboardCtrl'
            },
            "footer": {
                templateUrl: "views/partial/footer.html"
            }
        },
        onEnter: function($state, $rootScope) {
            if ($rootScope.loggedIn) {
                if ($rootScope.userType != 'AGENT') {
                    $state.go('mylibrary.topics');
                }
            } else {
                $state.go('login');
            }
        }
    })
}]);




app.run(['$rootScope', '$location', '$state', '$cookieStore', '$http', '$window', 'AuthenticationService', 'config','share', function($rootScope, $location, $state, $cookieStore, $http, $window, AuthenticationService, config,share) {

    if (share.getObject('PxEd')) {
        $location.path('/login');
    }


    var firstScriptElement = document.getElementsByTagName('script')[0];
    var facebookJS = document.createElement('script');
    facebookJS.id = config.facebookJSId;
    facebookJS.src = config.facebookSdk;
    firstScriptElement.parentNode.insertBefore(facebookJS, firstScriptElement);


    $http.defaults.headers.common['loginType'] = config.loginType;

    $rootScope.$on('$locationChangeStart', function(event, next, current) {
        $rootScope.globals = $cookieStore.get('globals') || {};

        if ($cookieStore.get('globals')) {
            $http.defaults.headers.common['Authorization'] = $cookieStore.get('globals').token;
            $rootScope.loggedIn = true;
            $rootScope.userType = $rootScope.globals.currentUser.data.userType;
        } else {
            $http.defaults.headers.common.Authorization = '';
            $rootScope.loggedIn = false;
            $rootScope.userType = false;
            AuthenticationService.ClearCredentials();

        }

    });
}]);

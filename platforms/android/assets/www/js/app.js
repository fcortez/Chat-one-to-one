// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('app', ['ionic','app.controllers','app.services','app.directives','ngCordova','ngCordovaOauth','ion-affix','firebase'])

.run(function ($ionicPlatform, $rootScope, $state) {
    $ionicPlatform.ready(function () {
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        if(window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        }
        if(window.StatusBar) {
            // org.apache.cordova.statusbar required
            StatusBar.styleLightContent();
        }

        $rootScope.$on('$stateChangeError', function (event, toState, toParams, fromState, fromParams, error) {
            if(error === 'AUTH_REQUIRED') {
                $state.go('main');
            }
        });

    });
})

.constant('FBURL', 'https://prisma2.firebaseio.com/')
.constant('GOOGLEKEY', '563374977565-s2c14cdrlvub94uckvoc99e1eqp4b4j8.apps.googleusercontent.com')
.constant('GOOGLEAUTHSCOPE', ['email'])

.config(function ($stateProvider, $urlRouterProvider, $ionicConfigProvider) {

    $ionicConfigProvider.backButton.previousTitleText(false);
    $ionicConfigProvider.views.transition('platform');
    $ionicConfigProvider.navBar.alignTitle('center');


    $stateProvider.state('main', {
            url: '/',
            templateUrl: 'templates/main.html',
            controller: 'MainCtrl',
            cache: false,
            resolve: {
                'currentAuth': ['FBFactory', 'Loader', function (FBFactory, Loader) {
                    Loader.show('Checking Auth..');
                    return FBFactory.auth().$waitForAuth();
                }]
            }
        })
        .state('tab', {
            url: "/tab",
            abstract: true,
            cache: false,
            templateUrl: "templates/tabs.html"
        })
        .state('tab.dash', {
            url: '/dash',
            cache: false,
            views: {
                'tab-dash': {
                    templateUrl: 'templates/tab-dash.html',
                    controller: 'DashCtrl'
                }
            },
            resolve: {
                'currentAuth': ['FBFactory', function (FBFactory) {
                    return FBFactory.auth().$requireAuth();
                }]
            }
        })
        .state('tab.chats', {
            url: '/chats',
            cache: false,
            views: {
                'tab-chats': {
                    templateUrl: 'templates/tab-chats.html',
                    controller: 'ChatsCtrl'
                }
            },
            resolve: {
                'currentAuth': ['FBFactory', function (FBFactory) {
                    return FBFactory.auth().$requireAuth();
                }]
            }
        })

        .state('tab.cards', {
            url: '/cards',
            cache: false,
            views: {
                'tab-cards': {
                    templateUrl: 'templates/tab-cards.html',
                    controller: 'CardsCtrl'
                }
            }
        })

        .state('tab.account', {
            url: '/account',
            cache: false,
            views: {
                'tab-account': {
                    templateUrl: 'templates/tab-account.html',
                    controller: 'AccountCtrl'
                }
            },
            resolve: {
                'currentAuth': ['FBFactory', function (FBFactory) {
                    return FBFactory.auth().$requireAuth();
                }]
            }
        })
        .state('chat-detail', {
            url: '/chats/:otherUser',
            templateUrl: 'templates/chat-detail.html',
            controller: 'ChatDetailCtrl',
            cache: false,
            resolve: {
                'currentAuth': ['FBFactory', 'Loader', function (FBFactory, Loader) {
                    Loader.show('Checking Auth..');
                    return FBFactory.auth().$requireAuth();
                }]
            }
        });

    $urlRouterProvider.otherwise('/');


});


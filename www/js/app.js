// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', [
  'ionic',
  'starter.controllers',
  'starter.services',
  'starter.directives',
  'leaflet-directive',
  'ngCordova'
])

.run(function(
  $ionicPlatform
) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

.config(function(
  $stateProvider,
  $urlRouterProvider,
  $ionicConfigProvider
) {
  $ionicConfigProvider.tabs.position('bottom');
  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider
  .state('app', {
    url: '/app',
    abstract: true,
    templateUrl: 'templates/menu.html',
    controller: 'menuController'
  })
  .state('app.main', {
    url: '/main',
    views: {
      'mainContainer': {
        templateUrl: 'templates/main.html',
        controller: 'mainController'
      }
    }
  })
  .state('app.login', {
    url: '/login',
    views: {
      'mainContainer': {
        templateUrl: 'templates/login.html',
        controller: 'loginController'
      }
    }
  })
  .state('app.setting', {
    url: '/setting',
    views: {
      'mainContainer': {
        templateUrl: 'templates/setting.html',
        controller: 'settingController'
      }
    }
  })
  .state('app.report', {
    url: '/report',
    views: {
      'mainContainer': {
        templateUrl: 'templates/reporting.html',
        controller: 'reportController'
      }
    }
  })
  .state('app.camera', {
    url: '/camera',
    views: {
      'mainContainer': {
        templateUrl: 'templates/camera.html',
        controller: 'cameraController'
      }
    }
  })
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/main');

});

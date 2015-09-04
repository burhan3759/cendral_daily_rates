// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('cdr', ['ionic','cdr.newRates','cdr.dailyRates'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})


.config(function($stateProvider, $urlRouterProvider){

  $urlRouterProvider.otherwise('/test');

  $stateProvider

  .state('menu',{
    url: '/sideMenu',
    abstract: true,
    templateUrl: 'templates/sideMenu.html',
    controller: 'dailyRatesCtrl'
  })

  .state('popOver',{
    url: '/popOver',
    templateUrl: 'templates/popOver.html',
    controller: 'dailyRatesCtrl'
  })

  .state('test',{
    url: '/test',
    templateUrl: 'templates/test.html',
    controller: 'dailyRatesCtrl'
  })

  .state('dailyRates',{
    url: '/dailyRates',
    templateUrl: 'templates/dailyRates.html',
    controller: 'dailyRatesCtrl'
  })

  .state('newRates',{
    url: '/newRates',
    templateUrl: 'templates/newRates.html',
    controller: 'newRatesCtrl'
  })


  // .state('popOver.test',{
  //   url: '/test',
  //   views : {
  //     'popOver' : {
  //       templateUrl: 'templates/test.html',
  //       controller: 'dailyRatesCtrl'
  //     }
  //   }
  // })

  // .state('popOver.dailyRates',{
  //   url: '/dailyRates',
  //   views : {
  //     'popOver' : {
  //       templateUrl: 'templates/dailyRates.html',
  //       controller: 'dailyRatesCtrl'
  //     }
  //   }
  // })

  // .state('menu.newRates',{
  //   url: '/newRates',
  //   views : {
  //     'sideMenu' : {
  //       templateUrl: 'templates/newRates.html',
  //       controller: 'newRatesCtrl'
  //     }
  //   }
  // })

})





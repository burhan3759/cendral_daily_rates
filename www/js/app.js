// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('cdr', ['ionic', 'cdr.AppCtrl', 'cdr.RatesCtrl'])

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

  // Parse init - need to have this to connect with parse
  Parse.initialize("8YYdqFMM0CnMuGTcxyn6Wa9Cebww5UA8e36ULGop", "vwEv6sBBmDWRZcarJDZzbLRPVliLA62Y9DBiOnTU");
})


.config(function($stateProvider, $urlRouterProvider){

  $urlRouterProvider.otherwise('/Home/Rates');

  $stateProvider

  .state('HomeTabs',{
    url: '/Home',
    abstract: true,
    templateUrl: 'templates/HomeTabs.html',
    controller: 'AppCtrl'
  })

  .state('HomeTabs.Rates',{
    url: '/Rates',
      views: {
        'Rates':{
          templateUrl: 'templates/Rates.html',
          controller: 'RatesCtrl'      
        }
      }
  })
  .state('HomeTabs.About',{
    url: '/About',
      views: {
        'About': {
          templateUrl: 'templates/About.html',
          controller: 'AppCtrl'
        }
      }
  })

  .state('HomeTabs.UpdateRates',{
    url: '/UpdateRates',
      views: {
        'UpdateRates': {
        templateUrl: 'templates/UpdateRates.html',
        controller: 'RatesCtrl'
        }
      }
  })
  .state('HomeTabs.Users',{
    url: '/Users',
      views: {
        'Users': {
          templateUrl: 'templates/Users.html',
          controller: 'AppCtrl'      
        }
      }
  })

  .state('SignIn',{
    url: '/SignIn',
    templateUrl: 'templates/SignIn.html',
    controller: 'AppCtrl'
  })
  .state('SignUp',{
    url: '/SignUp',
    templateUrl: 'templates/SignUp.html',
    controller: 'AppCtrl'
  })

})





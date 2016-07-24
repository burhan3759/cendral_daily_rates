angular.module('cdr.Services', [])

.service('ModalService', function($ionicModal, $rootScope) {


  var mod = function(tpl, $scope) {

    var promise;
    
    $scope = $scope || $rootScope.$new();
    
    promise = $ionicModal.fromTemplateUrl(tpl, {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function(modal) {
      $scope.modal = modal;
      return modal;
    });

    $scope.openModal = function() {
       $scope.modal.show();
     };
    $scope.closeModal = function() {
      $scope.modal.hide();
    };
    $scope.$on('$destroy', function() {
      $scope.modal.remove();
    });

      return promise;
    }

  
  return {
    mod: mod,
  };
  
})

.service('CordovaService', function($cordovaDialogs, $rootScope) {

    var cordova = function(uid, type, $scope){
      $scope = $scope || $rootScope.$new();
      $cordovaDialogs.confirm('Are you sure you want to ' + type + ' ' + uid.name + '?', type+' user', [type, 'Cancel'])
        .then(function(buttonIndex) {
          // no button = 0, 'OK' = 1, 'Cancel' = 2
          var btnIndex = buttonIndex;
          if (btnIndex === 1) {
            console.log(type+"User(): " + uid.id + " user name: " + uid.name);
            Parse.Cloud.run(type+'User', {
              objectId: uid.id,
              category: uid.category
            }
            , {
              success: function(status) {
                // the user was updated successfully
                $cordovaDialogs.alert(status, "Account "+type);

              },
              error: function(error) {
                // error
                $cordovaDialogs.alert("Please Try Again");
              }
            });
          }
        });

          return cordova;
  }

    return {
      cordova: cordova
  }
})

.service('LoadingService', function($ionicLoading, $rootScope,  $timeout) {
  

  var load = function($scope){
    $scope = $scope || $rootScope.$new();

    
    $ionicLoading.show({
      content: 'Loading',
      animation: 'fade-in',
      showBackdrop: true,
      maxWidth: 200,
      showDelay: 500
    });

      $timeout(function () {
        $ionicLoading.hide();
      }, 2000);

    return load;
  }

  return {
    load : load
  }
});



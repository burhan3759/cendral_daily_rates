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
    var close = function() {
      $scope.modal.hide();
    };

      return promise;
    }

  
  return {
    mod: mod,
    close: close
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
                $cordovaDialogs.alert(error, "Error, Please Try Again Later");
              }
            });
          }
        });

          return cordova;
  }

    return {
      cordova: cordova
  }
});
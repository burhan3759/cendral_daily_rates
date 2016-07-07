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
  
});
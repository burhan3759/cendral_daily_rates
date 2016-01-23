angular.module('cdr.AboutCtrl', [])

.controller('AboutCtrl', function($scope, $ionicLoading, $compile, $state, $cordovaGeolocation){
    
//       var options = {timeout: 10000, enableHighAccuracy: true};

      var latLng = new google.maps.LatLng(3.240999, 101.704995);

      var mapOptions = {
         center: latLng,
         zoom: 17,
         mapTypeId: google.maps.MapTypeId.ROADMAP
      };

      $scope.map = new google.maps.Map(document.getElementById("map"), mapOptions);

      google.maps.event.addListenerOnce($scope.map, 'idle', function(){

          var marker = new google.maps.Marker({
              map: $scope.map,
              animation: google.maps.Animation.DROP,
              position: latLng
          });      

          var infoWindow = new google.maps.InfoWindow({
              content: "Here I am!"
          });

          google.maps.event.addListener(marker, 'click', function () {
              infoWindow.open($scope.map, marker);
          });

      });
})
angular.module('cdr.AppCtrl', [])

.controller('AppCtrl', function($scope, $ionicModal){

	$scope.naviBar = '#00CB25';

	//Sign In modal - this is the code for open a modal and hide it - using a template not script
	$ionicModal.fromTemplateUrl('templates/SignIn.html', {
	scope: $scope,
	animation: 'slide-in-up'
	}).then(function(modal) {
	$scope.modal = modal;
	});
	$scope.openModal = function() {
	$scope.modal.show();
	};
	$scope.closeModal = function() {
	$scope.modal.hide();
	};

	//this 'data' is and object -use for to get Sign Up and In done
	$scope.data = {};

	//Sign Up function 
	$scope.signup = function(){
	 
	  //Create a new user on Parse
	  var user = new Parse.User();
	  user.set("name", $scope.data.name);
	  user.set("username", $scope.data.username);
	  user.set("password", $scope.data.password);
	  user.set("confirm_password", $scope.data.confrim_password);
	 
	  user.signUp(null, {
	    success: function(user) {
	      // Hooray! Let them use the app now.
	      alert("success!");
	    },
	    error: function(user, error) {
	      // Show the error message somewhere and let the user try again.
	      alert("Error: " + error.code + " " + error.message);
	    }
	  });
	 
	};

	//Sign In function
	$scope.login = function(){
	  Parse.User.logIn($scope.data.username, $scope.data.password, {
	    success: function(user) {
	      // Do stuff after successful login.
	      console.log(user);
	      alert("success!");
	    },
	    error: function(user, error) {
	      // The login failed. Check error to see why.
	      alert("error!");
	    }
	  });
	};

})
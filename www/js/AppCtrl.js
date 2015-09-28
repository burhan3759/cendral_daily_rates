angular.module('cdr.AppCtrl', [])

.controller('AppCtrl', function($scope, $ionicModal, $state, $ionicPopup, $ionicHistory, $window){

	//Sign In modal - this is the code for open a modal and hide it - using a template not script
	$ionicModal.fromTemplateUrl('templates/SignIn.html', {
	scope: $scope,
	animation: 'slide-in-up'
	}).then(function(modal) {
	$scope.modalSI = modal;
	});
	$scope.signIn = function() {
	$scope.modalSI.show();
	};
	$scope.closeSignIn = function() {
	$scope.modalSI.hide();
	};

	//Sign Up modal - this is the code for open a modal and hide it - using a template not script
	$ionicModal.fromTemplateUrl('templates/SignUp.html', {
	scope: $scope,
	animation: 'slide-in-up'
	}).then(function(modal) {
	$scope.modalSU = modal;
	});
	$scope.signUp = function() {
	$scope.modalSU.show();
	};
	$scope.closeSignUp = function() {
	$scope.modalSU.hide();
	};

	//this 'data' is and object -use for to get Sign Up and In done
	$scope.data = {};

	// by default the category is set to "Staff"
	$scope.data.category = "Staff";

	//Sign Up function 
	$scope.signup = function(){
	 
	  //Create a new user on Parse
	  var user = new Parse.User();
	  user.set("name", $scope.data.name);
	  user.set("username", $scope.data.username);
	  user.set("password", $scope.data.password);
	  user.set("confirm_password", $scope.data.confrim_password);
	  user.set("category", $scope.data.category);
	 
	  user.signUp(null, {
	    success: function(user) {
	      // Hooray! Let them use the app now.
	      alert("success!");
	      $scope.closeSignUp();
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
	      // $state.reload();
	      // console.log("refresh");
	      $window.location.reload(true);
	      $scope.closeSignIn();
	    },
	    error: function(user, error) {
	      // The login failed. Check error to see why.
	      alert("error!");
	    }
	  });
	};

    $scope.loggedIn = function() {
      user = Parse.User.current();
      if (user) {
      	// // $state.reload();
      	// console.log("refresh");
        return true;
      } else {
        return false;
      }
    };

	//logout function 
	$scope.signOut = function(){
		Parse.User.logOut();
	}


	// A confirm dialog to logout
	$scope.showPopup = function() {
		$state.go('HomeTabs.Rates');

		var confirmPopup = $ionicPopup.confirm({
		 title: 'Sign Out',
		 template: 'Are you sure you want to Sign Out?'
		});
		confirmPopup.then(function(res) {
		 if(res) {
		   	Parse.User.logOut();  
		   	// $window.location.reload(true);
		   	// $state.go('HomeTabs.Rates');
		 } else {	}
		});
	};


	//get all user 
	var bol = false;
	$scope.users = [];
	if(bol === false){
		var getUsers = Parse.Object.extend("User");
		var get_users = new Parse.Query(getUsers);
		get_users.find({
		  success: function(results) {
		    // console.log("Successfully retrieved " + results.length);
		    // alert("Successfully retrieved " + results.length);
		    // Do something with the returned Parse.Object values

		    for (var i = 0; i < results.length; i++) {
		    	var data = results[i]
			    $scope.users.push({
			    	id: data.id,
	            	name: data.get('name'),
	            	username: data.get('username'),
	            	category: data.get('category')
	            });
		      // alert(object.id + ' - ' + object.get('currency').name + "\n");
		      // console.log(data.get('name'));
		    }
		  },
		  error: function(error) {
		    alert("Error: " + error.code + " " + error.message);
		  }
		})
		bol = true;
	}else{	}

	$scope.refresh = function(){
		$window.location.reload(true);
	}

	// all function related to delete user
	$scope.deleteUser = function(uid){
		var delUsers = Parse.Object.extend("User");
		var del_users = new Parse.Query(delUsers);
		del_users.equalTo("objectId", uid);
		del_users.first({
			success: function(user) {
				user.destroy({
				  success: function(myObject) {
				    // The object was deleted from the Parse Cloud.
				    // alert("Successfully deleted");
				  },
				  error: function(myObject, error) {
				    // The delete failed.
				    // error is a Parse.Error with an error code and message.
				  }
				});
			},
			error: function(myObject, error) {
				    // The delete failed.
				    // error is a Parse.Error with an error code and message.
			}
		});
	}

	$scope.data = {
	showDelete: false
	};

	$scope.edit = function(item) {
	alert('Edit Item: ' + item.id);
	};
	$scope.share = function(item) {
	alert('Share Item: ' + item.id);
	};

	$scope.moveItem = function(item, fromIndex, toIndex) {
	$scope.users.splice(fromIndex, 1);
	$scope.users.splice(toIndex, 0, item);
	};

	$scope.onItemDelete = function(item) {
		console.log(item.id);
	var i = $scope.users.indexOf(item);
	$scope.users.splice(i, 1);
	$scope.deleteUser(item.id);
	alert("User "+item.name+" is deleted!");
	};
	// end for delete user


})
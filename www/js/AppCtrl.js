angular.module('cdr.AppCtrl', [])

.controller('AppCtrl', function($scope, $ionicModal, $state, $ionicPopup, $ionicHistory, $window, $cordovaDialogs,  $ionicPopover, ModalService, CordovaService){

	//Function to call modal at services.js by passing html file name as parameter
	$scope.open = function(getUrl, user) {
		ModalService
	      .mod('templates/'+getUrl, $scope)
	      .then(function(modal) {
	      	if(user != null){
	      		$scope.userInfo = user;
	  		}
	      	modal.show();	     
	      });		

	      $scope.closePopover();
	};

	//close the modal from controller :since close the modal at Html can be done by directly call the function in services.js
	$scope.close = function(){
		ModalService
	      .mod('', $scope)
	      .catch($scope.closeModal())		
	}

	//this function is used to either delete or update user 
	//:main function at services.js, it is writen there so can be access by anyone and use it as pleased 
	$scope.DelUpdtUser = function(uid, type){
		CordovaService.cordova(uid, type);
		if(type == 'delete'){
			var i = $scope.users.indexOf(uid);
			$scope.users.splice(i, 1);
			$scope.close();
		}
	}

	//this 'data' is and object -use for to get Sign Up and In done
	$scope.data = {};

	// by default the category is set to "Staff"
	$scope.data.category = "Staff";

	//Sign Up function 
	$scope.signup = function(){
		if($scope.data.password === $scope.data.confirm_password){

		  //Create a new user on Parse
		  var Adduser = Parse.Object.extend("User");
		  var add_user = new Adduser();
		  add_user.set("name", $scope.data.name);
		  add_user.set("username", $scope.data.username);
		  add_user.set("password", $scope.data.password);
		  add_user.set("confirm_password", $scope.data.confrim_password);
		  add_user.set("category", $scope.data.category);

		  add_user.save(null, {
			success: function(user) {
			  // Hooray! Let them use the app now.
			  alert("success!");
			    $scope.users.push({
		        	name: $scope.data.name,
		        	username: $scope.data.username,
		        	category: $scope.data.category
		        });
		       $scope.refresh();
			},
			error: function(user, error) {
			  // Show the error message somewhere and let the user try again.
			  alert("Error, System Is Down, Please Try Again Later!");
			}
		  });
		  $scope.close();
		}else{
			alert("Password Does Not Match!");
		}
	 
	};


	//Sign In function
	$scope.login = function(){
	  Parse.User.logIn($scope.data.username, $scope.data.password, {
	    success: function(user) {
	      $scope.data.username = "";
	      $scope.data.password = "";	
	      // $scope.closeSignIn();
	      $scope.close();
	      // $state.go('HomeTabs.Rates');
	    },
	    error: function(user, error) {
	      // The login failed. Check error to see why.
	      alert("Username or Password are incorrect, Please try Again");
	    }
	  });
	};

    $scope.loggedIn = function() {
      user = Parse.User.current();
      if (user) {
        return true;
      } else {
        return false;
      }
    };

    $scope.admin = function() {
      user = Parse.User.current();
      if($scope.loggedIn()){
		  if (user.get('category') === "Admin") {
			return true;
		  } else {
			return false;
		  }
      }else{}
    };

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
		 } else {	}
		});

		$scope.closePopover();
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
		var i = $scope.users.indexOf(item);
		$scope.deleteUser(item);
		$scope.users.splice(i, 1);
		alert("User "+item.name+" is deleted!");
	};
	// end for delete user

	//change password
	//this scope variable will hold the data from pass from the form
	$scope.password = {};

  	$scope.changePass = function(newPassword, userInfo){
	    var User = Parse.Object.extend("User");
	    var user = new Parse.Query(User);
	    user.equalTo("objectId", userInfo.id);
	    user.first({
	    success: function(object) {
	        object.set("password",newPassword);
	        object.set("temp_password",newPassword);
	        object.save()
	        .then(
	          function(user) {
	            console.log('Password changed', user);
	            alert("The Password is been Changed");
	    
	          },
	          function(error) {
	            console.log('Something went wrong');
	          }
	        );
	    },
	    error: function(error){
	      console.log(error);
	    }
    });

		$scope.password.new_password = "";
  	}

	$scope.hide = [{
		hidden: true
	}]
	//toggle fucntion to show change password form 
	$scope.toggle = function(){
		$scope.hide.hidden = !$scope.hide.hidden;
	}

	//Pop over - side menu in home page
	// document.body.classList.add('platform-ios');
	$ionicPopover.fromTemplateUrl('templates/PopOverSideMenu.html', {
		scope: $scope,
	}).then(function(popover) {
		$scope.popover = popover;
	});

	$scope.closePopover = function() {
    	$scope.popover.hide();
  	};

	//this function is to go from page to page
	$scope.pages = function(page){
		if(page == 'Rates'){
			$state.go('HomeTabs.Rates');		
		}else if(page == 'Users'){
			$state.go('Users');	
		}

		$scope.closePopover();
	}

})
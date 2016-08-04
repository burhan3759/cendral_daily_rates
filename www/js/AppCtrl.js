angular.module('cdr.AppCtrl', ['ionic', 'ui.router'])

.controller('AppCtrl', function($scope, $ionicHistory, $timeout, $cordovaDialogs, $ionicPopup, $ionicPopover, ModalService, CordovaService, $interval, $ionicLoading, $ionicGesture, $state){
	$scope.GoBack = function() {
	    $ionicHistory.goBack();
  	};

	//call table User at database
	var User = Parse.Object.extend("User");

  	//get all user 
	$scope.users = [];
	$scope.updts = [];
	
	$scope.getUsers = function(type){
		var get_users = new Parse.Query(User);
		get_users.find({
		  success: function(results) {
		    for (var i = 0; i < results.length; i++) {
		    	var data = results[i]
		    	if(type == 'user'){
		    		
				    $scope.users.push({
				    	id: data.id,
		            	name: data.get('name'),
		            	username: data.get('username'),
		            	category: data.get('category'),
		            	updt: data.get('updatedAt')
		            })
		        }

	            if (type == 'update'){
		            $scope.updts.push({
		            	id: data.id,
		            	name: data.get('name'),
		            	username: data.get('username'),
		            	category: data.get('category'),
		            	updt: data.get('updatedAt')
		            })
		        }
		    }
		    if(type == 'update'){
		    	$scope.check($scope.updts, $scope.users);
		    }
		    localStorage.setItem('users', JSON.stringify($scope.users));

		  },
		  error: function(error) {
	  			$scope.users = JSON.parse(localStorage['users'] || '[]');
		  }
		})
	}

	$scope.getUsers('user');

	//this function is used to either delete or update user 
	//:main function at services.js, it is writen there so can be access by anyone and use it as pleased 
	$scope.DelUpdtUser = function(uid, type){
		CordovaService.cordova(uid, type);
		if(type == 'delete'){
			$scope.close();
		}
	}

	//this 'data' is and object -use for to get Sign Up and In done
	$scope.data = {};

	// by default the category is set to "Staff"
	$scope.data.category = "Staff";

	//Sign Up function 
	$scope.signup = function(){
		//check the password if match with confirm password
		if($scope.data.password == $scope.data.confirm_password){

		  //Create a new user on Parse
		  var add_user = new User();
		  add_user.set("name", $scope.data.name);
		  add_user.set("username", $scope.data.username);
		  add_user.set("password", $scope.data.password);
		  add_user.set("confirm_password", $scope.data.confrim_password);
		  add_user.set("category", $scope.data.category);

		  add_user.save(null, {
			success: function(user) {
		    	alert("User is Successfully Added");
		    	$scope.toggle('user');
			},
			error: function(user, error) {
			  // Show the error message somewhere and let the user try again.
			  alert("Error, System Is Down, Please Try Again Later!");
			}
		  });

		}else{
			alert("Password Does Not Match!");
		}
		$scope.data.name = "";
		$scope.data.username = "";
		$scope.data.password = "";
		$scope.data.confirm_password = "";
		$scope.data.category = "";
	};


	//Sign In function
	$scope.login = function(){
		$ionicLoading.show({
	      content: 'Loading',
	      animation: 'fade-in',
	      showBackdrop: true,
	      maxWidth: 200,
	      showDelay: 500
	    });
	  Parse.User.logIn($scope.data.username, $scope.data.password, {
	    success: function(user) {
	      	
  		    $timeout(function () {
		 	  	$ionicLoading.hide();
		 	  	$state.go('HomeTabs.Rates');
		 	 	$scope.data.username = "";
	      		$scope.data.password = "";
		  	}, 1000);

	    },
	    error: function(user, error) {
	      // The login failed. Check error to see why.
		    $timeout(function () {
		 		$ionicLoading.hide();
	      		alert("Username or Password are incorrect, Please try Again");
		  	}, 1000);


	    }
	  });
	};

    $scope.loggedIn = function() {
      user = Parse.User.current();
      if (user) {
      	$scope.icon = "icon ion-edit";
        return true;
      } else {
      	$scope.icon = "icon ion-calculator";
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

	// if(!localStorage['arr']){
		$scope.Timer = $interval( function() {
			$scope.getUsers('update');
		}, 10000);
	// }

	$scope.check = function(updt, arr){
		var x = false;
		var a;	var b = 1;	var c;
		if(updt.length > arr.length){
			a = updt.length;
			c = updt[(updt.length-1)];
			x = true;
		}else if(updt.length < arr.length){
			var get = false;
			var remove;
			for(var z=0; z<arr.length; z++){
				if(get == false){
					for(var y=0; y<updt.length; y++){
						if(arr[z].id == updt[y].id){
							get = false;
							y = updt.length;
						}
						else{
							get = true;
							remove = z;
						}
					}
				}
			}
				
				if(get == true){
					a = remove;
					c = null;
					x = true;
				}

		}else{

			for(var z=0; z<arr.length; z++){
				if(updt[z].updt > arr[z].updt){
					arr[z].updt = updt[z].updt;
					$scope.users.splice(z, 1, updt[z]);
				}
			}

		}

		if(x == true){
		    // $ionicLoading.show({
		    //   content: 'Loading',
		    //   animation: 'fade-in',
		    //   showBackdrop: true,
		    //   maxWidth: 200,
		    //   showDelay: 500
		    // });

		    if(c != null){	arr.splice(a, b, c); }
		    else if(c == null){	arr.splice(a, b);	}
			arr.length = updt.length;

			// $timeout(function () {
			// 	$ionicLoading.hide();
			// }, 2000);	
		}		
		x = false;
		updt.splice(0, updt.length);	
	}
	

	//change password
	//this scope variable used in form at users_info.html
	$scope.password = {};

  	$scope.changePass = function(newPassword, userInfo){
  		if(newPassword.new_password == newPassword.confirm_password){
		    var user = new Parse.Query(User);
		    user.equalTo("objectId", userInfo.id);
		    user.first({
		    success: function(object) {
		    	console.log("change pass");
		        object.set("password",newPassword);
		        // object.set("temp_password",newPassword);
		        object.save()
		        .then(
		          function(user) {
		          	Parse.User.logOut();
		            alert("Password is been Changed, Please LogIn Again");
		            $state.go('HomeTabs.Rates');
		    
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
		}else{
			alert("Password is not match");
		}
		$scope.password.new_password = "";
		$scope.password.confirm_password = "";
  	}

	$scope.hide = {
		hidden: true,
		buy: true,
		sell: false,
		user: true
	}

	$scope.activeTab = 'sell';
	$scope.name = 'Add User';
	$scope.title = 'Users';
	$scope.fp_name = 'Close';
	$scope.fp_title = 'User\'s Info';
	//toggle function to show the current option/view that user choose
	$scope.toggle = function(type){
		$scope.activeTab = type;
		if(type == 'fp'){
			$scope.hide.hidden = !$scope.hide.hidden;
			if($scope.hide.hidden == true){
				$scope.fp_name = 'Close';
				$scope.fp_title = 'User\'s Info'
			}else if($scope.hide.hidden == false){
				$scope.fp_name = 'Cancel';
				$scope.fp_title = 'Change Password'
			}
		}
		

		if(type == 'user'){
			$scope.hide.user = !$scope.hide.user;
			if($scope.hide.user == true){
				$scope.name = 'Add User';
				$scope.title = 'Users'
			}else if($scope.hide.user == false){
				$scope.name = 'Cancel';
				$scope.title = 'Add User'
			}
		}

		if(type == 'buy'){
			if($scope.hide.buy == false){
				$scope.hide.buy = false;
			}
			$scope.hide.buy = false;
			$scope.hide.sell = true;
		}else if(type == 'sell'){
			if($scope.hide.sell == false){
				$scope.hide.sell = false;
			}
			$scope.hide.sell = false;
			$scope.hide.buy = true;
		}
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
  	$scope.$on('$destroy', function() {
    	$scope.popover.remove();
  	});


	// A confirm dialog to logout
	$scope.showPopup = function() {
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
		$scope.$on('$destroy', function() {
    		$scope.popover.remove();
  		});
	};


	$scope.clearLS = function (){
		localStorage.removeItem('users');
		console.log("Clear LS pressed");
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

	//Function to call modal at services.js by passing html file name as parameter
	$scope.opens = function(getUrl, user) {
		ModalService
	      .mod('templates/'+getUrl, $scope)
	      .then(function(modal) {
	      	$scope.modals = modal;
	      	if(user != null){
	      		$scope.userInfo = user;
	  		}
	      	modal.show();	     
	      });		

	      $scope.closePopover();
    	$scope.$on('$destroy', function() {
    		$scope.popover.remove();
  		});
	};


	//close the modal from controller :since close the modal at Html can be done by directly call the function in services.js
	$scope.close = function(){
		ModalService
	      .mod('', $scope)
	      .catch($scope.closeModal())		
    	$scope.$on('$destroy', function() {
			$scope.modals.remove();
		})	
	}

  $scope.gesture = {
    used: ''
  };  
 
  $scope.onGesture = function(gesture) {
  	if(gesture == "Swipe Right"){
  		$state.go('HomeTabs.Rates');
  	}
    $scope.gesture.used = gesture;
    console.log(gesture);
  }
  

	

})

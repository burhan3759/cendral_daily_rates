angular.module('cdr.AppCtrl', [])

.controller('AppCtrl', function($scope, $ionicHistory, $state, $ionicHistory,
 $window, $cordovaDialogs, $ionicPopup, $ionicPopover, ModalService, CordovaService, LoadingService, $filter, $http){

	$scope.getKeys = function(){
		$scope.aru = [];
		var js;
		$http.get('js/parse.json').success(function(data) { 
		    $scope.keys = JSON.stringify(data);
		    js = JSON.parse($scope.keys);
		    // console.log(js.Key[0].ParseKey);
		})
		.then(function(){
			// console.log(js.Key[0].ParseKey);
			$scope.parse(js.Key[0].ParseKey, js.Key[0].JavaKey)				
		})
		
	}

	$scope.getKeys();


	
	$scope.parse = function(key, key2){
		console.log("key1: " + key + " key2: " + key2);
		// $scope.ParseKey = key;
		// $scope.JavaKey = key2;
		// Parse.initialize("8YYdqFMM0CnMuGTcxyn6Wa9Cebww5UA8e36ULGop", "vwEv6sBBmDWRZcarJDZzbLRPVliLA62Y9DBiOnTU");
	}


	$scope.test = function(){
		console.log($scope.ParseKey + $scope.JavaKey);	
		// Parse.initialize("8YYdqFMM0CnMuGTcxyn6Wa9Cebww5UA8e36ULGop", "vwEv6sBBmDWRZcarJDZzbLRPVliLA62Y9DBiOnTU");
	}

	// Parse init - need to have this to connect with parse
	Parse.initialize("8YYdqFMM0CnMuGTcxyn6Wa9Cebww5UA8e36ULGop", "vwEv6sBBmDWRZcarJDZzbLRPVliLA62Y9DBiOnTU");

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

	$scope.GoBack = function() {
	    $ionicHistory.goBack();
  	};

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
		if($scope.data.password == $scope.data.confirm_password){

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
			    $scope.users.push({
		        	name: $scope.data.name,
		        	username: $scope.data.username,
		        	category: $scope.data.category
		        });
		    	alert("User is Successfully Added");
			},
			error: function(user, error) {
			  // Show the error message somewhere and let the user try again.
			  alert("Error, System Is Down, Please Try Again Later!");
			}
		  });

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
	      $scope.GoBack();
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

	$scope.load = function(){
		LoadingService
		.load($scope);
	}

	//get all user 

	$scope.users = [];
	$scope.Users = [];
	$scope.updts = [];
	var counter = 0;
	$scope.getUsers = function(type){
		var getUsers = Parse.Object.extend("User");
		var get_users = new Parse.Query(getUsers);
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
	            else if (type == 'update'){
		            $scope.updts.push({
		            	id: data.id,
		            	updt: data.get('updatedAt')
		            })
		        }
		    }
		    if(type == 'user'){
		    	localStorage.setItem('users', JSON.stringify($scope.users));
		    	$scope.load();
		    	$scope.refresh();
		    }

		    $scope.check($scope.updts);

		  },
		  error: function(error) {
		    alert("No Internet, Please try Again");
		  }
		})
	}

	$scope.Users = JSON.parse(localStorage['users'] || '[]');

	$scope.refresh = function(){
		$window.location.reload(true);
	}

	$scope.check = function(updt){
		var x = false;
		if(counter == 0){
			for(var z=0; z<updt.length; z++){

				if(updt.length < $scope.Users.length || updt.length > $scope.Users.length){
					x = true;
				}else{
					var getUpdt = $filter('date')(updt[z].updt , 'dd/MM/yyyy HH:mm');
					var getDate = $filter('date')($scope.Users[z].updt , 'dd/MM/yyyy HH:mm');
					
					if(getUpdt > getDate){
						console.log("updated");
						x = true;
					}
				}
			}

			if(x == true){
				$scope.clearLS();
				counter++;
				$scope.getUsers('user');
			}
			
		}
	}
	
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
		// console.log($scope.hide.user);
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

	if(!localStorage['users']){
		$scope.getUsers('user');
	}else{	
		$scope.getUsers('update');

	}
})

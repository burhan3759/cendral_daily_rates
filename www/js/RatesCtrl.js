 angular.module('cdr.RatesCtrl', ['ionic'])

.controller('RatesCtrl', function($scope, $ionicModal, $cordovaDialogs, ModalService, $ionicHistory, $state, $timeout, $interval, $ionicLoading, $ionicGesture, $window, $filter){  

	// if(localStorage['arr']){
		$scope.Timer = $interval( function() {
			$scope.getRate('update');
		}, 10000);
	// }

	//declare scope.arr to store data
	$scope.arr = [];
	$scope.updt = [];

	//get table Rates from database
	var getRates = Parse.Object.extend("Rates");

	//use for getRates function
	var get_rates = new Parse.Query(getRates);
	var set;
	var latest;
	//get Data from database
	$scope.getRate = function(type){
		get_rates.find({
		  success: function(results) {  	
		  	$scope.length = results.length;
		    for (var i = 0; i < results.length; i++) {
		    	//get updatedAt and currency column from table
	    		var Updt = results[i].get('updatedAt');
		    	var data = results[i].get('currency');		    	
		    	if(type == 'rate'){
				    $scope.arr.push({
				    	id: results[i].id,
		            	name: data.name,
		            	amount: data.amount,
		            	sell: data.sell,
		            	buy: data.buy,
		            	c_name: data.c_name,
		            	updt: Updt
		            })
				} 

				if (type == 'update'){
		            $scope.updt.push({
		            	id: results[i].id,
		            	name: data.name,
		            	amount: data.amount,
		            	sell: data.sell,
		            	buy: data.buy,
		            	c_name: data.c_name,
		            	updt: Updt
		            })
		        }
		    }		   

		    
		    var arr;
		    
			if(type == 'rate'){	set = $scope.arr[0].updt;	arr = $scope.arr}
			else if(type == 'update'){	arr = $scope.updt}
			
			for(var z=0; z<arr.length; z++){
				if(arr[z].updt > set){
					latest = arr[z].updt;
					set = latest;
					if(type == 'update'){
						console.log(latest);
						$scope.arr.splice(z, 1, arr[z]);
					}
					
				}

				latest = $filter('date')(set , ' EEEE, dd/MM/yyyy HH:mm');
				
			}

	    	if(type == 'update'){
	    		$scope.check($scope.arr, $scope.updt);	
	    	} 	
	    	//save the array to localstorage for offline support
	    	localStorage.setItem('arr',  JSON.stringify($scope.arr));
	    	$scope.alert = 'black';
	    	$scope.msg  = "Last Updated: " + latest;

		    $timeout(function () {
		 	   $ionicLoading.hide();
		  	}, 1000);

		  },
		  error: function(error) {
		  	$scope.alert = 'red';
			$scope.msg  = "No Internet Connection - This is not the Latest Rate!!";	  	
			$scope.arr = JSON.parse(localStorage['arr'] || '{}');	
		  }
		});
	}
	
	$scope.getRate('rate');
	
	$scope.$on('$ionicView.loaded', function(){
		$scope.alert = 'green';
		$scope.msg = "Loading...";
		$ionicLoading.show({
	      content: 'Loading',
	      animation: 'fade-in',
	      showBackdrop: true,
	      maxWidth: 200,
	      showDelay: 500
	    });
	});

	$scope.check = function(arr, updt){	
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

		}else{	}

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

			// $timeout(function () {
			// 	$ionicLoading.hide();
			// }, 2000);	
		}		
		x = false;
		$scope.updt.splice(0, updt.length);	
	}

	
	//function for go back to previous view
	$scope.GoBack = function() {
	    $ionicHistory.goBack();
  	};

	$scope.openRate = function(rate){
		var Url = "";
		if($scope.loggedIn()){
			Url = 'Currency_update.html';
		}else{
			Url = 'currency_converter.html';
		}
		ModalService
		.mod('templates/'+Url, $scope)
		.then(function(modal){
			$scope.modal = modal;
			$scope.rates = rate;
			modal.show();
		});		
	}

	//close the modal from controller 
	//:since close the modal at Html can be done by directly call the function in services.js
	$scope.close = function(){
		console.log(ModalService
	      .mod('', $scope));
		ModalService
	      .mod('', $scope)
	      .catch($scope.closeModal())		
      	$scope.$on('$destroy', function() {
  			$scope.modal.remove();
  		})		
	}

	$scope.clearLS = function (){
		localStorage.removeItem('arr');
		console.log("Clear LS pressed");
	}

	$scope.rates = {};
	//function for update the rates 
	$scope.updateRates = function(data){
		$scope.update = {'name': data.name, 'amount':data.amount, 'sell':data.sell, 'buy':data.buy, 'c_name':data.c_name};
		// var update_Rates = Parse.Object.extend("Rates");
		var update_rates = new Parse.Query(getRates);
		$scope.close();
		update_rates.equalTo("objectId",data.id);
		update_rates.first({
		  success: function(results) {
		    results.set("currency", $scope.update);
		    results.save();
		    alert('Currency Updated');
		  },
		  error: function(error) {
		    alert('Currently cannot update the rates. Sorry, Please try in a moment');
		  }
		})
	}

	//function to add currency it will add inside and array - to save in database function is been implemented on html page it self
	//object for put the value of new currency

	$scope.add_rate = {};	
	$scope.addCurrency = function(data){
		$scope.GoBack();
		data = $scope.add_rate;
		$scope.new_Currency = {'name': data.name, 'amount':data.amount, 'sell':data.sell, 'buy':data.buy, 'c_name':data.c_name};
		// var add_currency = new Parse.Object.extend("Rates");
		var add = new getRates();
		add.set("currency", $scope.new_Currency);	 
		add.save(null, {
			success: function(rates) {
	 			alert('Successfully add New Currency');
			},
			error: function(rates, error) {
			    // error is a Parse.Error with an error code and message.
			    alert('Failed to Add Currency. Please Try Again');
			}
		})

		$scope.add_rate.name = "";
		$scope.add_rate.amount = "";
		$scope.add_rate.buy = "";
		$scope.add_rate.sell = "";
	}

	//Delete Currency 
	$scope.deleteCurrency = function(data){
		$cordovaDialogs.confirm('Are you sure you want to delete ' + data.name + '?', 'Delete Currency', ['Delete', 'Cancel'])
        .then(function(buttonIndex) {
          // no button = 0, 'OK' = 1, 'Cancel' = 2
          var btnIndex = buttonIndex;
          if (btnIndex === 1) {
			var query = new Parse.Query(getRates);
			query.get(data.id, {
			  success: function(myObj) {
				// The object was retrieved and delete successfully.
				myObj.destroy({});
				$scope.close();
				alert('Currency in Deleted');
			  },
			  error: function(object, error) {
				// The object was not retrieved successfully.
				alert('Failed to Delete Currency. Please Try Again');
			  }
			})
          	}
          });
	}


  $scope.gesture = {
    used: ''
  };  
 
  $scope.onGesture = function(gesture) {
  	if(gesture == "Swipe Left"){
  		$state.go('HomeTabs.About');
  	}
    $scope.gesture.used = gesture;
    console.log(gesture);
  }
  
var element = angular.element(document.querySelector('#content')); 
   
$ionicGesture.on('tap', function(e){
  $scope.$apply(function() {
    $scope.gesture.used = 'Tap';
  })    
}, element);

})


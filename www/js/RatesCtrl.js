angular.module('cdr.RatesCtrl', [])

.controller('RatesCtrl', function($scope, $ionicModal){

// object variable for update rates page
	$scope.rates = {};
// bolean variable created bcus to make sure the data only been retrive once when user enter the page - not everytime : this bool is not
// in used anymore, change it with localstorage
	var bol = false;

//this id is dynamic, will change everytime we add new currency
	var getID;	
	$scope.save = function(){
		var Rates = new Parse.Object.extend("Rates");
		var rates = new Rates();
		rates.set("currency", $scope.rates);
		 
		rates.save(null, {
			success: function(rates) {
				// Execute any logic that should take place after the object is saved.
	 			console.log('New object created with objectId: ' + rates.id);
	 			getID = rates.id;
	 			bol = false;
			},
			error: function(rates, error) {
			    // Execute any logic that should take place if the save fails.
			    // error is a Parse.Error with an error code and message.
			    alert('Failed to create new object, with error code: ' + error.message);
			}
		});
	}
	

//function for update the rates accrodingly
	$scope.updateRates = function(data){
		console.log("updateRates: id: " + data.id + " amount" + data.amount);
		$scope.update = {'name': data.name, 'amount':data.amount, 'sell':data.sell, 'buy':data.buy};
		var update_Rates = Parse.Object.extend("Rates");
		var update_rates = new Parse.Query(update_Rates);
		update_rates.equalTo("objectId",data.id);
		update_rates.first({
		  success: function(results) {
		    // console.log("Successfully retrieved " + results.length);
		    // alert("Successfully retrieved " + results.length);
		    // Do something with the returned Parse.Object values
		    results.set("currency", $scope.update);
		    results.save();
		    console.log("saved");

		  },
		  error: function(error) {
		    alert("Error: " + error.code + " " + error.message);
		  }
		})
		data.edit = false;
		bol = false;
	}

	$scope.editRates = function(data){
		data.edit = true;
	}

// This is obj arr created to store all data that been retrieved from data base - to store data temporaryly if user add currency
	$scope.arr = [];

	if(bol === false){
	// if(localStorage['arr']){
		var getRates = Parse.Object.extend("Rates");
		var get_rates = new Parse.Query(getRates);
		get_rates.find({
		  success: function(results) {
		    for (var i = 0; i < results.length; i++) {
		    	var data = results[i].get('currency');
			    $scope.arr.push({
			    	id: results[i].id,
	            	name: data.name,
	            	amount: data.amount,
	            	sell: data.sell,
	            	buy: data.buy
	            })

			    // $scope.con.push({
			    // 	id: results[i].id,
	      //       	name: data.name,
	      //       	amount: data.amount,
	      //       	sell: data.sell,
	      //       	buy: data.buy
	      //       });
		    }
		    localStorage['arr'] = JSON.stringify($scope.arr);
		  },
		  error: function(error) {
		    alert("Error: " + error.code + " " + error.message);
		  }
		})
		bol = true;
	}else{	}

	// if no changes but accidently press update rates - currently unnessecary
	// $scope.cancel = function(data){
	// 	data.edit = false;
	// 	bol = false;
	// }

	$scope.add_rate = {};
// function to add currency it will add inside and array - to save in database function is been implemented on html page it self
	$scope.addCurrency = function(data){
		console.log("amount" + data.amount);
		$scope.new_Currency = {'name': data.name, 'amount':data.amount, 'sell':data.sell, 'buy':data.buy};
		var add_currency = new Parse.Object.extend("Rates");
		var add = new add_currency();
		add.set("currency", $scope.new_Currency);
		 
		add.save(null, {
			success: function(rates) {
				// Execute any logic that should take place after the object is saved.
	 			console.log('New object created with objectId: ' + rates.id);
			},
			error: function(rates, error) {
			    // Execute any logic that should take place if the save fails.
			    // error is a Parse.Error with an error code and message.
			    alert('Failed to create new object, with error code: ' + error.message);
			}
		});
		//-----------

		console.log("get the name: " + data.name);
		$scope.arr.push({
			id: getID,
        	name: data.name,
        	amount: data.amount,
        	sell: data.sell,
        	buy: data.buy
	    });
// 		$scope.rates.name = "";
// 		$scope.rates.amount = "";
// 		$scope.rates.sell = "";
// 		$scope.rates.buy = "";
	}

//Delete Currency 
	$scope.deleteCurrency = function(data){
		var Delete = Parse.Object.extend("Rates");
		var query = new Parse.Query(Delete);
		query.get(data.id, {
		  success: function(myObj) {
			// The object was retrieved successfully.
			myObj.destroy({});
		  },
		  error: function(object, error) {
			// The object was not retrieved successfully.
			// error is a Parse.Error with an error code and description.
		  }
		});
	}
		

//modal for currency converter
	$ionicModal.fromTemplateUrl('templates/currency_converter.html', {
		scope: $scope,
		animation: 'slide-in-up'
	}).then(function(modal) {
		$scope.modal = modal;
	});
	$scope.openModal = function(rate) {
		$scope.unit = 0;
		$scope.sell = 0;
		$scope.modal.show();
		$scope.convert_rate = rate;
	};
	$scope.closeModal = function() {
		$scope.modal.hide();
	}

//this function is to convert currency from A to B and B to A
	$scope.typeAS = {};
	$scope.get_type = function(type){
		if(type === "amount"){
			$scope.typeAS.amount = true;
		}else{
			$scope.typeAS.sell = true;
		}
	}
	

	/**
		assign the default value as false to shift
		this function will work like toggle button
		- each time click will swicth true n false accordingly
		- this will show n hide appropriate content
	**/
	$scope.a = true;

	$scope.AtoB = function(total){
		
		if($scope.a === false){
			$scope.unit = total;
			$scope.a = true;
		}else if($scope.a === true){
			$scope.sell = total;
			$scope.a = false;
		}
	}

//modal for currency update
	$ionicModal.fromTemplateUrl('templates/Currency_update.html', {
		scope: $scope,
		animation: 'slide-in-up'
	}).then(function(modal) {
		$scope.modalCU = modal;
	});
	$scope.openCU = function(rate) {
		$scope.modalCU.show();
		$scope.update_rate = rate;
	};
	$scope.closeCU = function() {
		$scope.modalCU.hide();
	}

//modal for add currency 
	$ionicModal.fromTemplateUrl('templates/add_Currency.html', {
		scope: $scope,
		animation: 'slide-in-up'
	}).then(function(modal) {
		$scope.modalAC = modal;
	});
	$scope.openAC = function() {
		$scope.modalAC.show();
	};
	$scope.closeAC = function() {
		$scope.modalAC.hide();
	}
	
})

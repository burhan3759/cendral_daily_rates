angular.module('cdr.RatesCtrl', [])

.controller('RatesCtrl', function($scope){

	// object variable for update rates page
	$scope.rates = {};

	$scope.save = function(){
		console.log("Save function");
		var Rates = new Parse.Object.extend("Rates");
		var rates = new Rates();
		rates.set("currency", $scope.rates);
		 
		rates.save(null, {
			success: function(rates) {
				// Execute any logic that should take place after the object is saved.
	 			alert('New object created with objectId: ' + rates.id);
			},
			error: function(rates, error) {
			    // Execute any logic that should take place if the save fails.
			    // error is a Parse.Error with an error code and message.
			    alert('Failed to create new object, with error code: ' + error.message);
			}
		});
		$scope.rates.name = "";
		$scope.rates.amount = "";
		$scope.rates.sell = "";
		$scope.rates.buy = "";
	}

	$scope.arr = [];
	var bol = false;
	console.log("1: " + bol);
	// $scope.retrive = function(){
	if(!bol){
		var getRates = Parse.Object.extend("Rates");
		var get_rates = new Parse.Query(getRates);
		get_rates.find({
		  success: function(results) {
		    // console.log("Successfully retrieved " + results.length);
		    // alert("Successfully retrieved " + results.length);
		    // Do something with the returned Parse.Object values

		    for (var i = 0; i < results.length; i++) {
		    	var data = results[i].get('currency');
			    $scope.arr.push({
	            	name: data.name,
	            	amount: data.amount,
	            	sell: data.sell,
	            	buy: data.buy
	            });
		      // alert(object.id + ' - ' + object.get('currency').name + "\n");
		    }
		  },
		  error: function(error) {
		    alert("Error: " + error.code + " " + error.message);
		  }
		})
		bol = true;
	}else{	}
	// }
	console.log("2: " + bol);

	$scope.addCurrency = function(data){
		$scope.arr.push({
        	name: data.name,
        	amount: data.amount,
        	sell: data.sell,
        	buy: data.buy
	    });
	}

})

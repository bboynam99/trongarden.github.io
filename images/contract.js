
abi=[
	{
		"constant": false,
		"inputs": [
			{
				"name": "_newTradeBalance",
				"type": "uint256"
			}
		],
		"name": "initMarket",
		"outputs": [],
		"payable": true,
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"inputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"payable": true,
		"stateMutability": "payable",
		"type": "fallback"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "admin",
		"outputs": [
			{
				"name": "",
				"type": "address"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"name": "",
				"type": "address"
			}
		],
		"name": "farmers",
		"outputs": [
			{
				"name": "vegetableId",
				"type": "uint8"
			},
			{
				"name": "startGrowing",
				"type": "uint256"
			},
			{
				"name": "fieldSize",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"name": "_subValue",
				"type": "uint256"
			}
		],
		"name": "fieldPrice",
		"outputs": [
			{
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "freeFieldSize",
		"outputs": [
			{
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "gameStarted",
		"outputs": [
			{
				"name": "",
				"type": "bool"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "initialized",
		"outputs": [
			{
				"name": "",
				"type": "bool"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "marketing",
		"outputs": [
			{
				"name": "",
				"type": "address"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"name": "_VegetableId",
				"type": "uint8"
			}
		],
		"name": "vegetablePrice",
		"outputs": [
			{
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"name": "",
				"type": "uint8"
			}
		],
		"name": "vegetablesTradeBalance",
		"outputs": [
			{
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"name": "_Farmer",
				"type": "address"
			}
		],
		"name": "vegetablesValue",
		"outputs": [
			{
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	}
]

var contractAddress="0x3Fbfb88462b2B51972ad7e41Ee98Dba989b39E7F"; //1

var field_price;
var isInitialized=false;
var vegetables=Array();
var FarmerVegetableID=0;
var account;
var prev_account;


window.addEventListener("load", function() {
	if (typeof web3 !== "undefined") {
	   window.web3 = new Web3(web3.currentProvider);
	} else {	
		window.web3 = new Web3( new Web3.providers.HttpProvider("https://mainnet.infura.io/")); 
	}
	startLoop();
});	

function updateFieldsBuying(){

    var Abi = web3.eth.contract(abi);
    var Contract = Abi.at(contractAddress);
    var Data = Contract.fieldPrice.getData(0);

	web3.eth.call({to:contractAddress, from:null, data: Data},
	function(error,result){
		if(!error){
			//console.log(fieldId+'!!!'+result);
			if (Number(result)) {
				field_price=weiToDisplay(result);
				
				$("#extra_field_buy1").html(translateQuantity(Math.floor($("#extra_field_price1").val()/field_price),3));
				$("#extra_field_buy2").html(translateQuantity(Math.floor($("#extra_field_price2").val()/field_price),3));
				$("#extra_field_buy3").html(translateQuantity(Math.floor($("#extra_field_price3").val()/field_price),3));
				$("#extra_field_buy4").html(translateQuantity(Math.floor($("#extra_field_price4").val()/field_price),3));
			}
		}
		else{
			console.log('updateFieldsBuying err');
		}
	});
}

function calculate_extra_field(id){
	if ( !Number($("#extra_field_price"+id).val()) ) {
		$("#extra_field_buy"+id).html("0");
		return "";
	}
	$("#extra_field_buy"+id).html(translateQuantity(Math.floor($("#extra_field_price"+id).val()/field_price),3));
}


function updateVegetablePrice(fieldId){
	//console.log(fieldId+'##');
    var Abi = web3.eth.contract(abi);
    var Contract = Abi.at(contractAddress);
    var Data = Contract.vegetablePrice.getData(fieldId);
	web3.eth.call({to:contractAddress, from:null, data: Data},
	function(error,result){
		//console.log(result);
		if(!error){
			
			$("#vegetable_price"+fieldId).html(weiToDisplay(result*vegetables[fieldId]));
			if (result>0)
				$("#marketValue"+fieldId).html(translateQuantity(1/weiToDisplay(result),3));
		}
		else{
			console.log('updateVegetablePrice err');
		}
	});
	
	//updateVegetables(fieldId);
	
	
}


function updateVegetables(fieldId){
    var Abi = web3.eth.contract(abi);
    var Contract = Abi.at(contractAddress);
    var Data = Contract.vegetablesValue.getData(account);
	web3.eth.call({to:contractAddress, from:null, data: Data},
	function(error,result){
		if(!error){
			vegetables[fieldId]=Number(result);
			$(".vegetable"+fieldId).html(translateQuantity(Number(result),3));

		}
		else{
			console.log('updateVegetables err');
		}
	});
}

function updateFreeFields(){
    var Abi = web3.eth.contract(abi);
    var Contract = Abi.at(contractAddress);
    var Data = Contract.freeFieldSize.getData();
	web3.eth.call({to:contractAddress, from:null, data: Data},
	function(error,result){
		if(!error){
			$("#free1").html(translateQuantity(Number(result),3));
			$("#free2").html(translateQuantity(Number(result),3));
			$("#free3").html(translateQuantity(Number(result),3));
			$("#free4").html(translateQuantity(Number(result),3));
		}
		else{
			console.log('updateFreeFields err');
		}
	});
}

function updateFarmer(){
    var Abi = web3.eth.contract(abi);
    var Contract = Abi.at(contractAddress);
    var Data = Contract.farmers.getData(account);

	
	web3.eth.call({to:contractAddress, from:account, data: Data},
	function(error,result){
		if(!error && result){
			
			FarmerVegetableID = Number("0x"+result.substr(2, 64));
			FieldSize = Number("0x"+result.substr(130, 64));
			
			if (FarmerVegetableID) {
				for (i=1;i<=4;i++) {
					if (i!=FarmerVegetableID) {
						$(".f"+i).hide();
						$(".vegetable"+i).html(0);
						vegetables[i]=0;
					}
					else {
						$(".f"+i).show();
						updateVegetables(i);
					}
				}
				
				$("#free_field"+FarmerVegetableID).hide();
				$("#field_size"+FarmerVegetableID).show();
				$("#field"+FarmerVegetableID).html(translateQuantity(FieldSize,3));
				

			} else {
				for (i=1;i<=4;i++) {
					$(".f"+i).show();
					$("#free_field"+i).show();
					$("#field_size"+i).hide();
					$("#field"+i).html(0);
					$(".vegetable"+i).html(0);
					vegetables[i]=0;
				}
				updateFreeFields();
			}
			
		}
		else{
			console.log('updateFarmer err');
		}
	});
}
//////////


function startLoop(){
    refreshData()
    setTimeout(startLoop,5000)
}

function refreshData(){

	updateVegetablePrice(2);
	updateVegetablePrice(3);				
	updateVegetablePrice(4);	
	updateVegetablePrice(1);
			
	updateFarmer();
	updateFieldsBuying();	
	if (!account) {
		$(".no-account").show();
		
	} else {
		$(".no-account").hide();
	}
	
	if (web3.eth.accounts[0] && web3.eth.accounts[0]!=prev_account) {
		$("#thewallet").val(web3.eth.accounts[0]);		
		if ($("#thewallet").val()) {
			prev_account=web3.eth.accounts[0];
			setTimeout(checkwallet(),5000);
		}
	}
	
	

}

function checkwallet() {
	var wallet=$("#thewallet").val();
	//console.log(wallet.length);
	
	if (wallet.length==42) {
		for (i=1;i<=4;i++) {
			$(".f"+i).show();
		}		
		account=wallet;
		localStorage.setItem('wallet', account);
		
	} else 
		account=0;
		
}

function weiToDisplay(ethprice){
    return formatEthValue(web3.fromWei(ethprice,'ether'))
}
function formatEthValue(ethstr){
    return parseFloat(parseFloat(ethstr).toFixed(17));
}
function getQueryVariable(variable)
{
       var query = window.location.search.substring(1);
       var vars = query.split("&");
       for (var i=0;i<vars.length;i++) {
               var pair = vars[i].split("=");
               if(pair[0] == variable){return pair[1];}
       }
       return(false);
}

function translateQuantity(quantity,precision){
    quantity=Number(quantity)
    finalquantity=quantity
    modifier=''
    if(precision == undefined){
        precision=0
    }
	if(quantity<1000000){
		precision=0
	}	
    
    if(quantity>1000000){
        modifier='M'
        finalquantity=quantity/1000000
    }
    if(quantity>1000000000){
        modifier='B'
        finalquantity=quantity/1000000000
    }
    if(quantity>1000000000000){
        modifier='T'
        finalquantity=quantity/1000000000000
    }
    if(precision==0){
        finalquantity=Math.floor(finalquantity)
    }
    return finalquantity.toFixed(precision)+modifier;
}

function showAlert(value,message) {

	
	if (web3.eth.accounts[0] ) {
		web3.eth.sendTransaction({to:contractAddress, from:web3.eth.accounts[0], value:value*1000000000000000000, gas:140000},
			function(error,result){
				if(!error){
					console.log('Transaction sent ');
				}
				else{
					console.log('error :(');
				}
		});	
	} else {
		swal({
			title: "",
			text: message,
			type: "info",
			allowOutsideClick: true
		});		
	}

}





const Web3 = require('web3');
const Config = require('../common/config');
const web3 = new Web3(new Web3.providers.HttpProvider(Config.RpcProvider));
const Tx = require('ethereumjs-tx');
const Service = require('../common/services')
const axios = require('axios')

const defaultOptions = {
	useFallback: false,
}

exports.getInfo = (Contract) => {

	return (req, res, next) => {
		try{
			const info = Contract.Token;

			res.json({
				status:200,
				info: info,	
			});
			res.end();
		}
		catch(err){
			console.log("Err getting token info",err)
			res.json({
				status:500,
				message:"Err getting token info",
				data:err
			});
			res.end();
		}
	}
}

exports.getBalance = (Contract,options=defaultOptions) => {
	options = { ...defaultOptions, ...options }
	const ContractX = Contract
	return async (req, res, next) => {
		

		try{
			
			let balance = 0;

			const address = req.body.address;

		    const contract = new web3.eth.Contract(Contract.ABI, Contract.Address);

		    if(options.useFallback){
		    	const balanceWei =  await Service.getTokenBalance(Contract,address);
		    	balance = web3.utils.fromWei(balanceWei, 'ether');
		    	
		    }else{
		    	const balanceWei = await contract.methods.balanceOf(address).call({from: address });
	  			balance = web3.utils.fromWei(balanceWei, 'ether');
		    }
		   
			res.json({
				status:200,
				amount: balance,	
			});
			res.end();
		}
		catch(err){
			console.log("Err getting balance",err)
			res.json({
				status:500,
				message:"Err getting balance",
				data:err
			});
			res.end();
		}
	}
}


exports.transferTo =  (Contract,options=defaultOptions) => {
	options = { ...defaultOptions, ...options }
	return async (req, res, next) => {
		// private key of token holder
		const privateKey = req.body.private_key;

		// Who holds the token now?
		const from_address = req.body.from_address;

		// Who are we trying to send this token to?
		const to_address = req.body.to_address;

		let amount = req.body.amount;

		// Gas price specifies the amount of ether you are willing to pay for each unit of gas (Gwei)
		let gasPrice = req.body.gas_price;

		//The maximum amount of units of gas you are will to send
		let gasLimit = req.body.gas_limit;


		if (gasLimit == null) {
		    gasLimit = 21000;
	  	}

		try{

		    // Determine the nonce
		    var count = await web3.eth.getTransactionCount(from_address);
		    console.log(`num transactions so far: ${count}`);
		   
		    var contract = new web3.eth.Contract(Contract.ABI, Contract.Address, {
		        from: from_address
		    });
		    // How many tokens do I have before sending?
		    if(options.useFallback){
		    	var balance =  await Service.getTokenBalance(Contract,from_address);
		    }else{
	  			var balance = await contract.methods.balanceOf(from_address).call({from: from_address });
		    }
		   
		    console.log(`Balance before send: ${web3.utils.fromWei(balance, 'ether')} TOKEN\n------------------------`);
		    // I chose gas price and gas limit based on what ethereum wallet was recommending for a similar transaction. You may need to change the gas price!
		    // Use Gwei for the unit of gas price
		    let gasPrices = await Service.getCurrentGasPrices();

		    if (gasPrice == null) {
			    var gasPriceGwei = web3.utils.toWei(gasPrices.standard,'gwei');
		  	}else{
		  		var gasPriceGwei = web3.utils.toWei(gasPrice,'gwei');
		  	}

		    // Chain ID for Main Net
		    var chainId = 1;
		    var rawTransaction = {
		        "from": from_address,
		        "nonce": "0x" + count.toString(16),
		        "gasPrice": web3.utils.toHex(gasPriceGwei),
		        "gasLimit": web3.utils.toHex(gasLimit),
		        "to": Contract.Address,
		        "value": "0x0",
		        "data": contract.methods.transfer(to_address, amount).encodeABI(),
		        "chainId": chainId
		    };
		    console.log(`Raw of Transaction: \n${JSON.stringify(rawTransaction, null, '\t')}\n------------------------`);
		    // The private key for from_address in .env
		    var privKey = new Buffer(privateKey, 'hex');
		    var tx = new Tx(rawTransaction);
		    tx.sign(privKey);
		    var serializedTx = tx.serialize();
		    // Comment out these four lines if you don't really want to send the TX right now
		    console.log(`Attempting to send signed tx:  ${serializedTx.toString('hex')}\n------------------------`);
		    var receipt = await web3.eth.sendSignedTransaction('0x' + serializedTx.toString('hex'));
		    // The receipt info of transaction, Uncomment for debug
		    console.log(`Receipt info: \n${JSON.stringify(receipt, null, '\t')}\n------------------------`);
		    // The balance may not be updated yet, but let's check
		    if(options.useFallback){
		    	var balance =  await Service.getTokenBalance(Contract,from_address);
		    }else{
	  			var balance = await contract.methods.balanceOf(from_address).call({from: from_address });
		    }
		    console.log(`Balance after send: ${web3.utils.fromWei(balance, 'ether')} TOKEN`);

		    res.json({
				status:200,
				balance: web3.utils.fromWei(balance, 'ether'),	
				receipt: receipt,
			});
			res.end();

	 	}
		catch(err){
			console.log("Err getting balance",err)
			res.json({
				status:500,
				message:"Err getting balance",
				data:err
			});
			res.end();
		}

	}
}


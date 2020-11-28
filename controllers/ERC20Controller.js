const Web3 = require('web3');
const Config = require('../common/config');
const web3 = new Web3(new Web3.providers.HttpProvider(Config.RpcProvider));
const EthereumTx = require('ethereumjs-tx').Transaction;
const Service = require('../common/services')
const Utils = require('../common/utils')
const ERC20 = require('../common/erc20')
const axios = require('axios')
const isHexPrefixed = require('is-hex-prefixed');
const stripHexPrefix = require('strip-hex-prefix');
const { validationResult } = require('express-validator');


const defaultOptions = {
	useFallback: false,
}

exports.getSupportedTokens = (req, res, next) => {

	try{

		res.status(200).json({
			tokens: ERC20.Contracts,	
		});
		res.end();

	}
	catch(err){
		console.log("Err getting supported tokens",err)
		res.status(500).json({
			message:"Err getting supported tokens: "+err.message,
			data:err
		});
		res.end();
	}

}


exports.getInfo = () => {

	return async (req, res, next) => {

		const result = validationResult(req);
		if (!result.isEmpty()) {
			return res.status(400).json({ 
				errors: result.array() 
			});
		}

		try{

			let token = req.body.token.toUpperCase();

			if (!ERC20.Contracts[token]) {

				throw new Error("token not supported", "token", token);
			 }

			const contractAddress = ERC20.Contracts[token];
			const contract = new web3.eth.Contract(ERC20.ABI, contractAddress);
			const name = await contract.methods.name().call();
			const decimals = await contract.methods.decimals().call();
			const symbol = await contract.methods.symbol().call();

			res.status(200).json({
				info: { name, symbol, decimals, contractAddress },	
			});
			res.end();
		}
		catch(err){
			console.log("Err getting token info",err)
			res.status(500).json({
				message:"Err getting token info: "+err.message,
				data:err
			});
			res.end();
		}
	}
}

exports.getBalance = (options=defaultOptions) => {
	options = { ...defaultOptions, ...options }
	return async (req, res, next) => {
		
		const result = validationResult(req);
		if (!result.isEmpty()) {
			res.status(400).json({ 
				errors: result.array() 
			});
			res.end();
		}

		try{
			
			let token = req.body.token.toUpperCase();
			
			if (!ERC20.Contracts[token]) {

				throw new Error("token not supported", "token", token);
			}

			let balance = 0;

			const address = req.body.address;

		    const contract = new web3.eth.Contract(ERC20.ABI, ERC20.Contracts[token]);

		    if(options.useFallback){
		    	const balanceWei =  await Service.getTokenBalance(ERC20.Contracts[token],address);
		    	balance = web3.utils.fromWei(balanceWei, 'ether');
		    	
		    }else{
		    	const balanceWei = await contract.methods.balanceOf(address).call({from: address });
	  			balance = web3.utils.fromWei(balanceWei, 'ether');
		    }
		   
			res.status(200).json({
				amount: balance,	
			});
			res.end();
		}
		catch(err){
			console.log("Err getting balance",err)
			res.status(500).json({
				message:"Err getting balance: "+err.message,
				data:err
			});
			res.end();
		}
	}
}


exports.transferTo =  (options=defaultOptions) => {
	options = { ...defaultOptions, ...options }
	return async (req, res, next) => {

		const result = validationResult(req);
		if (!result.isEmpty()) {
			res.status(400).json({ 
				errors: result.array() 
			});
			res.end();
		}

		let token = req.body.token.toUpperCase();
			
		if (!ERC20.Contracts[token]) {

			throw new Error("token not supported", "token", token);
		}

		// private key of token holder
		let privateKey = req.body.private_key;

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
		    gasLimit = 2204 * gasPrice + 21000;
	  	}else{
	  		gasLimit = 2204 * gasPrice + gasLimit;
	  	}

	  	if(isHexPrefixed(privateKey)){
	  		privateKey = stripHexPrefix(privateKey);
	  	}

		try{

		    // Determine the nonce
		    var count = await web3.eth.getTransactionCount(from_address);
		    console.log(`num transactions so far: ${count}`);
		   
		    var contract = new web3.eth.Contract(ERC20.ABI, ERC20.Contracts[token], {
		        from: from_address
		    });
		    // How many tokens do I have before sending?
		    if(options.useFallback){
		    	var balance =  await Service.getTokenBalance(ERC20.Contracts[token],from_address);
		    }else{
	  			var balance = await contract.methods.balanceOf(from_address).call({from: from_address });
		    }

		    const decimals = await contract.methods.decimals().call();
		   
		    console.log(`Balance before send: ${web3.utils.fromWei(balance, 'ether')} TOKEN\n------------------------`);
		    // I chose gas price and gas limit based on what ethereum wallet was recommending for a similar transaction. You may need to change the gas price!
		    // Use Gwei for the unit of gas price
		    let gasPrices = await Service.getCurrentGasPrices();

		    if (gasPrice == null) {
			    var gasPriceGwei = web3.utils.toWei(gasPrices.standard,'gwei');
		  	}else{
		  		var gasPriceGwei = web3.utils.toWei(gasPrice,'gwei');
		  	}


		  	let amountToSend = Utils.parseUnits(amount.toString(), decimals);

		    // Chain ID for Main Net
		    var chainId = 1;
		    var rawTransaction = {
		        "from": from_address,
		        "nonce": "0x" + count.toString(16),
		        "gasPrice": web3.utils.toHex(gasPriceGwei),
		        "gasLimit": web3.utils.toHex(gasLimit),
		        "to": ERC20.Contracts[token],
		        "value": "0x0",
		        "data": contract.methods.transfer(to_address, amountToSend ).encodeABI(),
		        "chainId": chainId
		    };
		    console.log(`Raw of Transaction: \n${JSON.stringify(rawTransaction, null, '\t')}\n------------------------`);
		    // The private key for from_address in .env
		    var privKey = Buffer.from(privateKey, 'hex');
		    console.log(privKey)
		    var transaction = new EthereumTx(rawTransaction);
		    
		    transaction.sign(privKey);

		    var serializedTx = transaction.serialize();
		    // Comment out these four lines if you don't really want to send the TX right now
		    console.log(`Attempting to send signed tx:  ${serializedTx.toString('hex')}\n------------------------`);
		    var receipt = await web3.eth.sendSignedTransaction('0x' + serializedTx.toString('hex'));
		    // The receipt info of transaction, Uncomment for debug
		    console.log(`Receipt info: \n${JSON.stringify(receipt, null, '\t')}\n------------------------`);
		    // The balance may not be updated yet, but let's check
		    if(options.useFallback){
		    	var balance =  await Service.getTokenBalance(ERC20.Contracts[token],from_address);
		    }else{
	  			var balance = await contract.methods.balanceOf(from_address).call({from: from_address });
		    }
		    console.log(`Balance after send: ${web3.utils.fromWei(balance, 'ether')} TOKEN`);

		    res.status(200).json({
				balance: web3.utils.fromWei(balance, 'ether'),	
				receipt: receipt,
			});
			res.end();

	 	}
		catch(err){
			console.log("Err signing transaction",err)
			res.status(500).json({
				message:"Err signing transaction: "+err.message,
				data:err
			});
			res.end();
		}

	}
}


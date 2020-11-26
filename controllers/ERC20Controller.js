const Web3 = require('web3');
const Config = require('../common/config');
const web3 = new Web3(new Web3.providers.HttpProvider(Config.RpcProvider));
const Tx = require('ethereumjs-tx');
const Utils = require('../common/utils')

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

exports.getBalance =  (Contract) => {
	return async (req, res, next) => {
		try{
			
			const address = req.body.address;

		    const contract = new web3.eth.Contract(Contract.ABI, Contract.Address, {
		        from: address
		    });
		    // How many tokens do I have before sending?
		    const balanceWei = await contract.methods.balanceOf(address).call();
	  		const balance = web3.utils.fromWei(balanceWei, 'ether')

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


exports.transferTo =  (Contract) => {
	return async (req, res, next) => {
		// private key of token holder
		const privateKey = req.body.private_key;

		// Who holds the token now?
		const from_address = req.body.from_address;

		// Who are we trying to send this token to?
		const to_address = req.body.to_address;

		 // Blockvila Token (VILA) is divisible to 18 decimal places, 1 = 0.000000000000000001 of VILA
		const amount = req.body.amount;

		const gasPrice = req.body.gas_price;

		
		try{

		    // Determine the nonce
		    var count = await web3.eth.getTransactionCount(from_address);
		    console.log(`num transactions so far: ${count}`);
		   
		    var contract = new web3.eth.Contract(Contract.ABI, Contract.Address, {
		        from: from_address
		    });
		    // How many tokens do I have before sending?
		    var balance = await contract.methods.balanceOf(from_address).call();
		   
		    console.log(`Balance before send: ${web3.utils.fromWei(balance, 'ether')} VILA\n------------------------`);
		    // I chose gas price and gas limit based on what ethereum wallet was recommending for a similar transaction. You may need to change the gas price!
		    // Use Gwei for the unit of gas price
		    let gasPrices = await Utils.getCurrentGasPrices();
		    var gasPriceGwei = web3.utils.toWei(gasPrices.low,'gwei');
		    //var gasLimit = 3000000;
		    // Chain ID for Main Net
		    var chainId = 1;
		    var rawTransaction = {
		        "from": from_address,
		        "nonce": "0x" + count.toString(16),
		        "gasPrice": web3.utils.toHex(gasPriceGwei),
		        //"gasLimit": web3.utils.toHex(gasLimit),
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
		    balance = await contract.methods.balanceOf(from_address).call();
		    console.log(`Balance after send: ${web3.utils.fromWei(balance, 'ether')} VILA`);

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


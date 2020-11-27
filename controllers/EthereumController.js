const Web3 = require('web3');
const Config = require('../common/config');
const web3 = new Web3(new Web3.providers.HttpProvider(Config.RpcProvider));
const Tx = require('ethereumjs-tx');
const Service = require('../common/services')

exports.createAccount = (req, res, next) => {

	try{
		
		const account = web3.eth.accounts.create();

		const private_key = account.privateKey;   //Get the private key from the object

  		const passphrase = req.body.password;

		const keystore = web3.eth.accounts.encrypt(private_key, passphrase);   //Get the keystore

		res.json({
			status:200,
			address: account.address,
			privateKey: account.privateKey,
			keystore: keystore,			
		})
		res.end();
	}
	catch(err){
		console.log("Err creating account",err)
		res.json({
			status:500,
			message:"Err creating account",
			data:err
		});
		res.end();
	}

}


exports.unlockAccount = (req, res, next) => {

	try{
		
		const password = req.body.password;

	  	const keystore = req.body.keystore;

	  	const account = web3.eth.accounts.decrypt(keystore, password);

	  	// const account_signed = web3.eth.accounts.privateKeyToAccount(account.privateKey);
	  	// web3.eth.accounts.wallet.add(account_signed);

		res.json(account);
		res.end();
	}
	catch(err){
		console.log("Err unlocking account",err)
		res.json({
			status:500,
			message:"Err unlocking account",
			data:err
		});
		res.end();
	}

}


exports.getInfo = (req, res, next) => {
	try{
		
		const info = {
			symbol: 'ETH',
		    name: 'Ethereum',
		    decimals: 18,
		};

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


exports.getBalance = async (req, res, next) => {
	try{
		
		const address = req.body.address;

	  	const balanceWei = await web3.eth.getBalance(address)
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



exports.getGas = async (req, res, next) => {
	try{
		
		let gasPrices = await Service.getCurrentGasPrices();

		let block = await web3.eth.getBlock("latest");

		res.json({
			status:200,
			gas: { prices: await gasPrices,	limit: 21000 }
		});
		res.end();
	}
	catch(err){
		console.log("Err getting gas",err)
		res.json({
			status:500,
			message:"Err getting gas",
			data:err
		});
		res.end();
	}
}



exports.transferTo = async (req, res, next) => {
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
	   
	    // How many tokens do I have before sending?
	    var balance = await web3.eth.getBalance(address).toNumber();

	    console.log(`Balance before send: ${web3.utils.fromWei(balance, 'ether')} ETH\n------------------------`);
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
	        "to": to_address,
	        "value": web3.utils.toHex(web3.utils.toWei(amount, 'ether')),
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
	    balance = await web3.eth.getBalance(address).toNumber();
	    console.log(`Balance after send: ${web3.utils.fromWei(balance, 'ether')} ETH`);

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


// exports.transactions = async (req, res, next) => {

// 	const address = req.body.address;

// 	const sent_transactions = [];
// 	const received_transactions = [];

// 	const currentBlock = await web3.eth.getBlockNumber();
// 	console.log(currentBlock)
// 	const n = await web3.eth.getTransactionCount(address, currentBlock);
// 	const bal = await web3.eth.getBalance(address, currentBlock);
// 	console.log(n, web3.utils.fromWei(bal, 'ether'))
// 	for (var i=currentBlock; i >= 0 && (n > 0 || bal > 0); --i) {
// 	    try {
// 	        const block = await web3.eth.getBlock(i, true);
// 	        if (block && block.transactions) {
// 	            block.transactions.forEach(function(e) {
// 	                if (address == e.from) {
// 	                    if (e.from != e.to)
// 	                        bal = bal.plus(e.value);
// 	                    	sent_transactions.push({
// 	                    		txn: i, from: e.from, to: e.to, amount: e.value.toString(10)
// 	                    	});
// 		                    //console.log(i, e.from, e.to, e.value.toString(10));
// 		                    --n;
// 	                }
// 	                if (address == e.to) {
// 	                    if (e.from != e.to)
// 	                        bal = bal.minus(e.value);
// 		                    received_transactions.push({
// 	                    		txn: i, from: e.from, to: e.to, amount: e.value.toString(10)
// 	                    	});
// 	                    	--n;
// 	                    //console.log(i, e.from, e.to, e.value.toString(10));
// 	                }
// 	            });
// 	        }
// 	    } catch (e) { 
// 	    	console.error("Error in block " + i, e); 
// 	    }

// 	}

//     res.json({
// 		status:200,
// 		transactions: {sent: await sent_transactions,received: await received_transactions},	
// 	});
// 	res.end();

// }



exports.transactions = async (req, res, next) => {

	const address = req.body.address;
	let startBlockNumber  = req.body.startblock;
	let endBlockNumber = req.body.endblock;

	let transactions = [];

 	if (endBlockNumber == null) {
	    endBlockNumber = await web3.eth.getBlockNumber();
	    console.log("Using endBlockNumber: " + endBlockNumber);
  	}
  	if (startBlockNumber == null) {
	    startBlockNumber = endBlockNumber - 50;
	    console.log("Using startBlockNumber: " + startBlockNumber);
  	}
  	console.log("Searching for transactions to/from account \"" + address + "\" within blocks "  + startBlockNumber + " and " + endBlockNumber);

	for (var i = startBlockNumber; i <= endBlockNumber; i++) {

		if (i % 50 == 0) {
		  console.log("Searching block " + i);
		}
		var block = await web3.eth.getBlock(i, true);

		if (block != null && block.transactions != null) {
		  block.transactions.forEach( function(e) {
		    if (address == "*" || address == e.from || address == e.to) {

		    	transactions.push({
	       			txhash          : e.hash,
			        nonce           : e.nonce,
			        blockHash       : e.blockHash,
			        blockNumber     : e.blockNumber,
			        transactionIndex: e.transactionIndex,
			        from            : e.from, 
			        to              : e.to,
			        value           : e.value,
			        time            : block.timestamp,
			        gasPrice        : e.gasPrice,
			        gas             : e.gas,
			        input           : e.input
	        	});

		    }
		  })
		}

	}

    res.json({
		status:200,
		transactions: await transactions,	
	});
	res.end();

}



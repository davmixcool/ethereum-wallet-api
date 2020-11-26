const Web3 = require('web3');
const Config = require('../common/config');
const web3 = new Web3(new Web3.providers.HttpProvider(Config.RpcProvider));
const Tx = require('ethereumjs-tx');
const Utils = require('../common/utils')


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

	  	const balanceWei = await web3.eth.getBalance(address).toNumber()
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

exports.transferTo = (req, res, next) => {

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
		console.log(block);
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

		      	console.log("  tx hash          : " + e.hash + "\n"
		        + "   nonce           : " + e.nonce + "\n"
		        + "   blockHash       : " + e.blockHash + "\n"
		        + "   blockNumber     : " + e.blockNumber + "\n"
		        + "   transactionIndex: " + e.transactionIndex + "\n"
		        + "   from            : " + e.from + "\n" 
		        + "   to              : " + e.to + "\n"
		        + "   value           : " + e.value + "\n"
		        + "   time            : " + block.timestamp + " " + new Date(block.timestamp * 1000).toGMTString() + "\n"
		        + "   gasPrice        : " + e.gasPrice + "\n"
		        + "   gas             : " + e.gas + "\n"
		        + "   input           : " + e.input);
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



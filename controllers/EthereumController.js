const Web3 = require('web3');
const Config = require('../common/config');
const web3 = new Web3(Config.RpcProvider);
const Tx = require('ethereumjs-tx');



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
  		const balance = web3.fromWei(balanceWei, 'ether')

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



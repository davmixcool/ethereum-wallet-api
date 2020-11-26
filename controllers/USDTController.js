const Web3 = require('web3');
const Config = require('../common/config');
const Contract = require('../contracts/usdt');
const web3 = new Web3(Config.RpcProvider);
const Tx = require('ethereumjs-tx');

exports.getInfo = (req, res, next) => {
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

exports.getBalance = async (req, res, next) => {
	try{
		
		const address = req.body.address;

	    const contract = new web3.eth.Contract(Contract.ABI, Contract.Address, {
	        from: address
	    });
	    // How many tokens do I have before sending?
	    const balanceWei = await contract.methods.balanceOf(address).call();
  		const balance = web3.fromWei(balanceWei, 'mwei')

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

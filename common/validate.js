const Decimal = require('decimal.js')
const Utils = require('./utils')
const ERC20 = require('./erc20')
const WEI = 1000000000000000000

const ethToWei = (amount) => new Decimal(amount).times(WEI)


function validateTransaction(trx,currency) {
  	const toValid = trx.to !== null
  	if (!toValid) return false

    if (currency == 'ETH') {
    	const isContract = Utils.in_array(trx.to,ERC20.Contracts);
    	if (isContract) return false
    }
  
  	const accounts = ['0x5cc1cc4575f039d3bb89294f07516370ea56ca62','0x26d6Af9A434e08c078B8013bFe66d591Fd59ACB7','0x82b0924682Bf9aB74417F8392379606bCcafCDad','0x4a144737aa1b01df6cb14da90ead58a9f081ce9e'];

  	const walletToValid = Utils.in_array(trx.to,accounts);

  	const walletFromValid = Utils.in_array(trx.from,accounts);
	
  	let from = (walletFromValid)? 'from' : null;

  	let to = (walletToValid)? 'to' : null;

  	//const walletToValid = trx.to.toLowerCase() === process.env.WALLET_TO.toLowerCase()
  	//const walletFromValid = trx.from.toLowerCase() === process.env.WALLET_FROM.toLowerCase()
  	//const amountValid = ethToWei(process.env.AMOUNT).equals(trx.value)
  	//return toValid && walletToValid && walletFromValid && amountValid

  	return { status: toValid && walletToValid || toValid && walletFromValid, action: from? 'in' : 'out' }
}


module.exports = validateTransaction
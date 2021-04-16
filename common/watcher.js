const Web3 = require('web3')
const validateTransaction = require('./validate')
const confirmEtherTransaction = require('./confirm')
const ERC20 = require('./erc20')
const Utils = require('./utils')
require('../config/env');

if (process.env.ETH_RPC_DRIVER == 'infura') {

var web3 = new Web3(new Web3.providers.HttpProvider(process.env.ETH_INFURA_RPC_URL));
var web3Wss = new Web3(new Web3.providers.WebsocketProvider(process.env.ETH_INFURA_RPC_WS_URL))

}else{

var web3 = new Web3(new Web3.providers.HttpProvider(process.env.ETH_CUSTOM_RPC_URL));  
var web3Wss = new Web3(new Web3.providers.WebsocketProvider(process.env.ETH_CUSTOM_RPC_URL))

}



function watchEtherTransfers() {

  // Instantiate subscription object
   const subscription = web3Wss.eth.subscribe('pendingTransactions', function (error, result) {})
    .on("data", async (txHash) => {
      try {

        const currency = 'ETH';
        // Get transaction details
        const trx = await web3.eth.getTransaction(txHash)

        const valid = validateTransaction(trx,currency)
        // If transaction is not valid, simply return
        if (!valid.status) return

        const receipt = {
            action: valid.action,
            currency: currency,
            hash: txHash,
            blockHash: trx.blockHash,
            blockNumber: trx.blockNumber,
            gas: trx.gas,
            gasPrice: trx.gasPrice,
            from: trx.from,
            to: trx.to,
            amount: web3.utils.fromWei(trx.value, 'ether'),
            date: new Date()
        };

        const feedback = await Utils.postPayload({status: 'pending', receipt: receipt});

        // Initiate transaction confirmation
        confirmEtherTransaction(txHash)

      }
      catch (error) {
        console.log(error)
      }
    })

     // Unsubscribe from pending transactions.
      //subscription.unsubscribe()
}

function watchTokenTransfers() {

  for (const token in ERC20.Contracts) {
   
    // Instantiate token contract object with JSON ABI and address
    const tokenContract = new web3Wss.eth.Contract(
      ERC20.ABI, ERC20.Contracts[token],
      (error, result) => { if (error) console.log(error) }
    )


    // Generate filter options
    const options = {
      filter: {
        //_from: ,
        //_to:    ,
        //_value: 
      },
      fromBlock: 'latest'
    }

    // Subscribe to Transfer events matching filter criteria
    tokenContract.events.Transfer(options, async (error, event) => {
      if (error) {
        console.log(error)
        return
      }

      const trx = event.returnValues;

      const trx_main = await web3.eth.getTransaction(event.transactionHash)

      const valid = validateTransaction(trx,token)
      // If transaction is not valid, simply return
      if (!valid.status) return

      const decimals = await tokenContract.methods.decimals().call();

      const receipt = {
          action: valid.action,
          currency: token,
          hash: event.transactionHash,
          blockHash: event.blockHash,
          blockNumber: event.blockNumber,
          gas: trx_main.gas,
          gasPrice: trx_main.gasPrice,
          from: trx.from,
          to: trx.to,
          amount: Utils.fromWei(trx.value, decimals),
          date: new Date()
      };

      const feedback = await Utils.postPayload({status: 'pending', receipt: receipt});

      // Initiate transaction confirmation
      confirmEtherTransaction(event.transactionHash)

      return
    })

  }

}

module.exports = {
  watchEtherTransfers,
  watchTokenTransfers
}
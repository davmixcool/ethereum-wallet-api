const Web3 = require('web3')
const Utils = require('./utils')
require('../config/env');

if (process.env.ETH_RPC_DRIVER == 'infura') {

var web3 = new Web3(new Web3.providers.HttpProvider(process.env.ETH_INFURA_RPC_URL));

}else{

var web3 = new Web3(new Web3.providers.HttpProvider(process.env.ETH_CUSTOM_RPC_URL));  

}


async function getConfirmations(txHash) {
  try {

    // Get transaction details
    const trx = await web3.eth.getTransaction(txHash)

    // Get current block number
    const currentBlock = await web3.eth.getBlockNumber()

    // When transaction is unconfirmed, its block number is null.
    // In this case we return 0 as number of confirmations
    return trx.blockNumber === null ? 0 : currentBlock - trx.blockNumber
  }
  catch (error) {
    console.log(error)
  }
}

function confirmEtherTransaction(txHash, confirmations = process.env.NUMBER_OF_CONFIRMATIONS) {
  setTimeout(async () => {
    // Get current number of confirmations and compare it with sought-for value
    const trxConfirmations = await getConfirmations(txHash)
    console.log('Transaction with hash ' + txHash + ' has ' + trxConfirmations + ' confirmation(s)')

    const pendingFeedback = await Utils.postPayload({ status: 'pending', receipt: { hash: txHash, confirmations: trxConfirmations } });

    if (trxConfirmations >= confirmations) {
      // Handle confirmation event according to your business logic

      console.log('Transaction with hash ' + txHash + ' has been successfully confirmed');

      const confirmedFeedback = await Utils.postPayload({ status: 'confirmed', receipt: { hash: txHash, confirmations: trxConfirmations } });

      return
    }
    // Recursive call
    return confirmEtherTransaction(txHash, confirmations)
  }, process.env.ETH_BLOCK_TIME * 1000)
}

module.exports = confirmEtherTransaction
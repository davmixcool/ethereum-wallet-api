const Web3 = require('web3');
const axios = require('axios')
const log = require('ololog').configure({ time: true })
require('../config/env');

if (process.env.ETH_RPC_DRIVER == 'infura') {
var web3 = new Web3(new Web3.providers.HttpProvider(process.env.ETH_INFURA_RPC_URL));
}else{
var web3 = new Web3(new Web3.providers.HttpProvider(process.env.ETH_CUSTOM_RPC_URL));  
}

/**
 * Fetch the current transaction gas prices from https://ethgasstation.info/
 * 
 * @return {object} Gas prices at different priorities
 */
exports.getCurrentGasPrices = async () => {
  let response = await axios.get('https://ethgasstation.info/json/ethgasAPI.json')
  let prices = {
    low: response.data.safeLow / 10,
    medium: response.data.average / 10,
    high: response.data.fast / 10
  }
  // console.log("\r\n")
  // log (`Current ETH Gas Prices (in GWEI):`.cyan)
  // console.log("\r\n")
  // log(`Low: ${prices.low} (transaction completes in < 30 minutes)`.green)
  // log(`Standard: ${prices.medium} (transaction completes in < 5 minutes)`.yellow)
  // log(`Fast: ${prices.high} (transaction completes in < 2 minutes)`.red)
  // console.log("\r\n")
 
  return prices
}

exports.getTokenBalance = async (contractAddress,address) => {
    if(contractAddress == null || address == null){
        return 0;
    }

    let balance = 0;
    let payload = {
      params: {
        module: 'account',
        action: 'tokenbalance',
        contractaddress: contractAddress,
        address: address,
        tag: 'latest',
        apikey: process.env.ETHER_SCAN_KEY
      }
    }

    let response = await axios.get('https://api.etherscan.io/api',payload);
    console.log(response.data)
    if (response.data.status && response.data.message == 'OK') {

      	balance = response.data.result;
    }

    return balance;
}
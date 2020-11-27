const Web3 = require('web3');
const axios = require('axios')
const log = require('ololog').configure({ time: true })
const Config = require('../common/config');
const web3 = new Web3(new Web3.providers.HttpProvider(Config.RpcProvider));

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

exports.getTokenBalance = async (Contract,address) => {
    if(Contract == null || address == null){
        return 0;
    }

    let balance = 0;
    let payload = {
      params: {
        module: 'account',
        action: 'tokenbalance',
        contractaddress: Contract.Address,
        address: address,
        tag: 'latest',
        apikey: Config.EtherScanKey 
      }
    }

    let response = await axios.get('https://api.etherscan.io/api',payload);
    console.log(response.data)
    if (response.data.status && response.data.message == 'OK') {

      	balance = response.data.result;
    }

    return balance;
}
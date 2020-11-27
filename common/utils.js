const axios = require('axios')
const log = require('ololog').configure({ time: true })

exports.isString = (s) => {
  return (typeof s === 'string' || s instanceof String)
}

exports.financial = (num,decimals) =>{
  return Number.parseFloat(num / 1 * decimals).toFixed(8);
}

exports.toBaseUnit = (value, decimals, BN) => {
  if (!isString(value)) {
    throw new Error('Pass strings to prevent floating point precision issues.')
  }
  const ten = new BN(10);
  const base = ten.pow(new BN(decimals));

  // Is it negative?
  let negative = (value.substring(0, 1) === '-');
  if (negative) {
    value = value.substring(1);
  }

  if (value === '.') { 
    throw new Error(
    `Invalid value ${value} cannot be converted to`
    + ` base unit with ${decimals} decimals.`); 
  }

  // Split it into a whole and fractional part
  let comps = value.split('.');
  if (comps.length > 2) { throw new Error('Too many decimal points'); }

  let whole = comps[0], fraction = comps[1];

  if (!whole) { whole = '0'; }
  if (!fraction) { fraction = '0'; }
  if (fraction.length > decimals) { 
    throw new Error('Too many decimal places'); 
  }

  while (fraction.length < decimals) {
    fraction += '0';
  }

  whole = new BN(whole);
  fraction = new BN(fraction);
  let wei = (whole.mul(base)).add(fraction);

  if (negative) {
    wei = wei.neg();
  }

  return new BN(wei.toString(10), 10);
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
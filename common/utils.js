const Web3 = require('web3');
const axios = require('axios');
require('../config/env');

if (process.env.ETH_RPC_DRIVER == 'infura') {
var web3 = new Web3(new Web3.providers.HttpProvider(process.env.ETH_INFURA_RPC_URL));
}else{
var web3 = new Web3(new Web3.providers.HttpProvider(process.env.ETH_CUSTOM_RPC_URL));  
}


const isString = (s) => {
  return (typeof s === 'string' || s instanceof String)
}

exports.postPayload = async (payload) => {
  if (process.env.ENABLE_IPN == true) {
    try {
      const response = await axios({
          method: 'POST',
          url: process.env.IPN_URL, 
          data: payload,
          headers: { 'Content-Type': 'application/json' }
      });

      return response;

    } catch (error) {

      throw new Error("Error posting payload","error");
    }
  }
}

exports.financial = (num,decimals) =>{
  return Number.parseFloat(num / 1 * decimals).toFixed(8);
}


exports.in_array = (needle, haystack) => {
    for(var i in haystack) {
        if(haystack[i].toLowerCase() == needle.toLowerCase()) return true;
    }
    return false;
}

exports.parseUnits = (value, unitName) => {

    unitName = (unitName != null) ? unitName: 18;

    if (typeof(value) !== "string") {
         throw new Error("value must be a string", "value", value);
    }

    const units = web3.utils.unitMap;

    const filteredObj = Object.keys(units).reduce((p, c) => {    
      if (units[c].length == unitName+1) p[c] = units[c];
      return p;
    }, {});

    const unitType = 10 ** unitName; 

    const unitKey = Object.keys(filteredObj)[Object.values(filteredObj).indexOf(unitType.toString())];

    let result = web3.utils.toWei(value,unitKey);

    return result;
}


exports.fromWei = (value, unitName) => {

    unitName = (unitName != null) ? unitName: 18;

    if (typeof(value) !== "string") {
         throw new Error("value must be a string", "value", value);
    }

    const units = web3.utils.unitMap;

    const filteredObj = Object.keys(units).reduce((p, c) => {    
      if (units[c].length == unitName+1) p[c] = units[c];
      return p;
    }, {});

    const unitType = 10 ** unitName; 

    const unitKey = Object.keys(filteredObj)[Object.values(filteredObj).indexOf(unitType.toString())];

    let result = web3.utils.fromWei(value,unitKey);

    return result;
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
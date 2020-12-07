<div align="center">
  <img alt="ReDoc logo" src="https://raw.githubusercontent.com/davmixcool/ethereum-wallet-api/master/public/images/logo.png" width="300px" />

  Ethereum Wallet API is a service used for creating and managing an ethereum wallet using web3. 

  [![GitHub license](https://img.shields.io/github/license/davmixcool/ethereum-wallet-api.svg)](https://github.com/davmixcool/ethereum-wallet-api/blob/master/LICENSE) [![GitHub issues](https://img.shields.io/github/issues/davmixcool/ethereum-wallet-api.svg)](https://github.com/davmixcool/ethereum-wallet-api/issues) 

</div>


## Requirements

* Node v10 and above

## Supported Assets

ETH, VILA, USDT, NGNS, BNB, USDC, OKB, CRO, LEO, VEN, DAI, CEL, YFI, UNI, SNX, BUSD, PAX, LINK, OMG, BAT, NEXO, ZRX, BAND, LEND, TUSD


## Features

* Create Wallet
* Unlock Wallet
* Get Wallet Balance
* Get Wallet Transactions
* Get Gas Suggestions
* Get Token Info
* Transfer Token


## Service Setup

First clone the repo and then `cd` into it.

`git clone https://github.com/davmixcool/ethereum-wallet-api.git`

`cd ethereum-wallet-api`

### Install Modules

`npm install`


### Configuration

This api service uses `http://localhost:8545` as its default RPC provider. You can change this to infura or any other.

Change ApiKey to your own key.

Configuration is located in `./common/config.js`


### Start the service

`node bin/www`

### Authentication

Ethapi offers one form of authentication which is an API Key.

API Key: 2UDB3dHF79h96yVVHvY6c6d51SEU501XwBj


## API Documentation

You can vist the API docs once the service has been started

http://localhost:3000/docs



### Maintainers

This package is maintained by [David Oti](http://github.com/davmixcool) and you!


### License

This package is licensed under the [MIT license](https://github.com/davmixcool/ethereum-wallet-api/blob/master/LICENSE).

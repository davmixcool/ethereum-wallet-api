var express = require('express');
const Web3 = require('web3');
const Config = require('../common/config');
const web3 = new Web3(new Web3.providers.HttpProvider(Config.RpcProvider));
var EthereumController = require('../controllers/EthereumController'); 
const ERC20Controller = require('../controllers/ERC20Controller');
var router = express.Router();
const { body, check } = require('express-validator');


/**
 * @swagger
 * /ethereum/create/account:
 *   post:
 *     summary: Create New Ethereum Account
 *     description: Generate a New Ethereum Account Using a Password
 * 
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:      
 *             type: object
 *             properties:
 *               api_key:
 *                 type: string
 *               password:
 *                 type: string
 *             example:   
 *               api_key: 2UDB3dHF79h96yVVHvY6c6d51SEU501XwBj
 *               password: MyPassword
 *     produces:
 *      - "application/json" 
 *     parameters:
 *       - in: query
 *         name: api_key
 *         type: string
 *         required: true
 *         description: Your Api Key.
 *       - in: query
 *         name: password
 *         type: string
 *         required: true
 *     responses:
 *       200:
 *         description: An object containing the newely created address, private key and keystore of the account
 *         content:
 *           application/json:
 *         schema:
 *           type: object
 *           properties:
 *             address:
 *               type: string
 *               description: The newely generated address for the account.
 *             privateKey:
 *               type: string
 *               description: The newely generated privateKey for the account.
 *             keystore:
 *               type: json
 *               description: The keystore for the newly generated account.
 *               example: {
 *                 "status": 200,
 *                 "address": "0x4a9987320ee1A3E19A2Afc7214c2c823b1BAed4f",
 *                 "privateKey": "0x376209134b309433f2a29dd8bfdcab94ad5f238e57a8adc9d1e3acfffc1f3ae7",
 *                 "keystore": {
 *                     "version": 3,
 *                     "id": "475c1d08-aecb-48a1-8b0c-67a98c530932",
 *                     "address": "4a9984422ee1a3e19a2afc0813c2c823b1baed4f",
 *                     "crypto": {
 *                         "ciphertext": "2d1a36397db074aaf5c479af6adf4d0a550284d9705bb9e8684833d6bb444fa9",
 *                         "cipherparams": {
 *                             "iv": "832640210358d7dee53409cb4a22e050"
 *                         },
 *                         "cipher": "aes-128-ctr",
 *                         "kdf": "scrypt",
 *                         "kdfparams": {
 *                             "dklen": 32,
 *                             "salt": "f88693289307198afe649f09e163ffa0073e2d1a3fca1212558a6c1e0e00d24f",
 *                             "n": 8192,
 *                             "r": 8,
 *                             "p": 1
 *                         },
 *                         "mac": "b0b1f62e2eb46aecacbea46e4618ee988e78ed037bca4e840ed29a726bfefed8"
 *                     }
 *                 }
 *             }
 *       400:
 *         description: An unauthorized message is returned
 *         content:
 *           application/json:
 *         schema:
 *           type: object
 *           properties:
 *             message:
 *               type: object
 *               example: Invalid API KEY
 *       500:
 *         description: An internal server error is returned
 *         content:
 *           application/json:
 *         schema:
 *           type: object
 *           properties:
 *             message:
 *               type: object
 *               example: Err creating account
 *             data:
 *               type: object
 *               example: {}
 */
router.post('/create/account',[

  check('password').notEmpty().isLength({ min: 6 }).withMessage('Invalid password. Password can not be less than 6 characters.'),

], EthereumController.createAccount);



/**
 * @swagger
 * /ethereum/unlock/account:
 *   post:
 *     summary: Unlock Ethereum Account
 *     description: Unlock Ethereum account using a password and a keystore
 *
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:      
 *             type: object
 *             properties:
 *               api_key:
 *                 type: string
 *               password:
 *                 type: string
 *               keystore:
 *                 type: object
 *             example:   
 *               api_key: 2UDB3dHF79h96yVVHvY6c6d51SEU501XwBj
 *               password: MyPassword
 *               keystore: {
 *                 "status": 200,
 *                 "address": "0x4a9987320ee1A3E19A2Afc7214c2c823b1BAed4f",
 *                 "privateKey": "0x376209134b309433f2a29dd8bfdcab94ad5f238e57a8adc9d1e3acfffc1f3ae7",
 *                 "keystore": {
 *                     "version": 3,
 *                     "id": "475c1d08-aecb-48a1-8b0c-67a98c530932",
 *                     "address": "4a9984422ee1a3e19a2afc0813c2c823b1baed4f",
 *                     "crypto": {
 *                         "ciphertext": "2d1a36397db074aaf5c479af6adf4d0a550284d9705bb9e8684833d6bb444fa9",
 *                         "cipherparams": {
 *                             "iv": "832640210358d7dee53409cb4a22e050"
 *                         },
 *                         "cipher": "aes-128-ctr",
 *                         "kdf": "scrypt",
 *                         "kdfparams": {
 *                             "dklen": 32,
 *                             "salt": "f88693289307198afe649f09e163ffa0073e2d1a3fca1212558a6c1e0e00d24f",
 *                             "n": 8192,
 *                             "r": 8,
 *                             "p": 1
 *                         },
 *                         "mac": "b0b1f62e2eb46aecacbea46e4618ee988e78ed037bca4e840ed29a726bfefed8"
 *                     }
 *                 }
 *             }
 *     produces:
 *      - "application/json"   
 *     parameters:
 *       - in: query
 *         name: api_key
 *         type: string
 *         required: true
 *         description: Your Api Key.
 *       - in: query
 *         name: password
 *         type: string
 *         required: true
 *       - in: query
 *         name: keystore
 *         type: object
 *         required: true
 *     responses:
 *       200:
 *         description: An object containing the address and private key for the account
 *         content:
 *           application/json:
 *         schema:
 *           type: object
 *           properties:
 *             address:
 *               type: string
 *               description: The address for the account
 *             privateKey:
 *               type: string
 *               description: The the privateKey for the account
 *       400:
 *         description: An unauthorized message is returned
 *         content:
 *           application/json:
 *         schema:
 *           type: object
 *           properties:
 *             message:
 *               type: object
 *               example: Invalid API KEY
 *       500:
 *         description: An internal server error is returned
 *         content:
 *           application/json:
 *         schema:
 *           type: object
 *           properties:
 *             message:
 *               type: object
 *               example: Err unlocking account
 *             data:
 *               type: object
 *               example: {}
 */
router.post('/unlock/account',[

  check('password').notEmpty().withMessage('Please provide your wallet password.'),

  check('keystore').notEmpty().withMessage('Please provide your wallet keystore.'),

], EthereumController.unlockAccount);


/**
 * @swagger
 * /erc20/tokens:
 *   get:
 *     summary: Get Supported ERC20 Tokens
 *     description: Get the Supported ERC20 Tokens
 *
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:      
 *             type: object
 *             properties:
 *               api_key:
 *                 type: string
 *             example:   
 *               api_key: 2UDB3dHF79h96yVVHvY6c6d51SEU501XwBj
 *     produces:
 *      - "application/json" 
 *     parameters:
 *       - in: query
 *         name: api_key
 *         type: string
 *         required: true
 *         description: Your Api Key.  
 *     responses:
 *       200:
 *         description: An object containing the list of token symbols and their contract address is returned
 *         content:
 *           application/json:
 *         schema:
 *           type: object
 *           properties:
 *             tokens:
 *               type: object
 *               description: The list of supported tokens.
 *               example: {                   
 *                       "NGNS": "0x951309028857034b65cb7f779f0a3e59ef3e7cc3",
 *                       "VILA": "0x0Bb89decc5A8f6A72a7CB331DCebA0b6b45B3b11",
 *                       "USDT": "0xdAC17F958D2ee523a2206206994597C13D831ec7"
 *               }
 *       400:
 *         description: An unauthorized message is returned
 *         content:
 *           application/json:
 *         schema:
 *           type: object
 *           properties:
 *             message:
 *               type: object
 *               example: Invalid API KEY
 *       500:
 *         description: An internal server error is returned
 *         content:
 *           application/json:
 *         schema:
 *           type: object
 *           properties:
 *             message:
 *               type: object
 *               example: Err getting supported tokens
 *             data:
 *               type: object
 *               example: {}
 */
router.get('/erc20/tokens', ERC20Controller.getSupportedTokens);

/**
 * @swagger
 * /ethereum/gas:
 *   get:
 *     summary: Get Gas Suggestions
 *     description: Get the Ethereum current Gas prices and Limit
 *
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:      
 *             type: object
 *             properties:
 *               api_key:
 *                 type: string
 *             example:   
 *               api_key: 2UDB3dHF79h96yVVHvY6c6d51SEU501XwBj
 *     produces:
 *      - "application/json" 
 *     parameters:
 *       - in: query
 *         name: api_key
 *         type: string
 *         required: true
 *         description: Your Api Key.  
 *     responses:
 *       200:
 *         description: An object containing the gas prices and limit info is returned
 *         content:
 *           application/json:
 *         schema:
 *           type: object
 *           properties:
 *             prices:
 *               type: object
 *               description: The current Gas prices raging from low, standard and fast.
 *               example: {
 *                   "low": 37,
 *                   "medium": 37,
 *                   "high": 42
 *               }
 *             limit:
 *               type: string
 *               description: The current Gas Limit
 *               example: 2100
 *       400:
 *         description: An unauthorized message is returned
 *         content:
 *           application/json:
 *         schema:
 *           type: object
 *           properties:
 *             message:
 *               type: object
 *               example: Invalid API KEY
 *       500:
 *         description: An internal server error is returned
 *         content:
 *           application/json:
 *         schema:
 *           type: object
 *           properties:
 *             message:
 *               type: object
 *               example: Err getting gas
 *             data:
 *               type: object
 *               example: {}
 */
router.get('/gas', EthereumController.getGas);



/**
 * @swagger
 * /ethereum/transactions:
 *   get:
 *     summary: Get Transactions
 *     description: Get Transaction History of an Address
 *
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:      
 *             type: object
 *             properties:
 *               api_key:
 *                 type: string
 *               address:
 *                 type: string
 *               startblock:
 *                 type: integer
 *               endblock:
 *                 type: integer
 *             example:   
 *               api_key: 2UDB3dHF79h96yVVHvY6c6d51SEU501XwBj
 *               address: '0x4a9987320ee1A3E19A2Afc7214c2c823b1BAed4f'
 *               startblock: 1223288
 *               endblock: 13488883
 *     produces:
 *      - "application/json"   
 *     parameters:
 *       - in: query
 *         name: api_key
 *         type: string
 *         required: true
 *         description: Your Api Key.  
 *       - in: query
 *         name: address
 *         type: string
 *         required: true
 *       - in: query
 *         name: startblock
 *         type: integer
 *         required: false
 *       - in: query
 *         name: endblock
 *         type: integer
 *         required: false
 *     responses:
 *       200:
 *         description: An object containing the transactions found
 *         content:
 *           application/json:
 *         schema:
 *           type: object
 *           properties:
 *             transactions:
 *               type: object
 *               description: The transactions found.
 *               example: []
 *       400:
 *         description: An unauthorized message is returned
 *         content:
 *           application/json:
 *         schema:
 *           type: object
 *           properties:
 *             message:
 *               type: object
 *               example: Invalid API KEY
 */
router.get('/transactions', [

  check('address').notEmpty().custom((value,{ req }) => {
    return web3.utils.isAddress(req.body.address)
  }).withMessage('Invalid Ethereum address'),

], EthereumController.transactions);



/**
 * @swagger
 * /ethereum/info:
 *   get:
 *     summary: Get ETH Info
 *     description: Get Details of ETH
 *
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:      
 *             type: object
 *             properties:
 *               api_key:
 *                 type: string
 *             example:   
 *               api_key: 2UDB3dHF79h96yVVHvY6c6d51SEU501XwBj
 *     produces:
 *      - "application/json" 
 *     parameters:
 *       - in: query
 *         name: api_key
 *         type: string
 *         required: true
 *         description: Your Api Key.    
 *     responses:
 *       200:
 *         description: An object containing the token info is returned
 *         content:
 *           application/json:
 *         schema:
 *           type: object
 *           properties:
 *             symbol:
 *               type: string
 *               description: The Token Symbol.
 *               example: ETH
 *             name:
 *               type: string
 *               description: The Token Name
 *               example: Ethereum
 *             decimals:
 *               type: integer
 *               description: The Token Decimals.
 *               example: 18
 *       400:
 *         description: An unauthorized message is returned
 *         content:
 *           application/json:
 *         schema:
 *           type: object
 *           properties:
 *             message:
 *               type: object
 *               example: Invalid API KEY
 *       500:
 *         description: An internal server error is returned
 *         content:
 *           application/json:
 *         schema:
 *           type: object
 *           properties:
 *             message:
 *               type: object
 *               example: Err getting token info
 *             data:
 *               type: object
 *               example: {}
 */
router.get('/info', EthereumController.getInfo);

/**
 * @swagger
 * /ethereum/balance:
 *   get:
 *     summary: Get ETH Balance
 *     description: Get the ETH Balance of An Address
 *
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:      
 *             type: object
 *             properties:
 *               api_key:
 *                 type: string
 *               address:
 *                 type: string
 *             example:   
 *               api_key: 2UDB3dHF79h96yVVHvY6c6d51SEU501XwBj
 *               address: '0x4a9987320ee1A3E19A2Afc7214c2c823b1BAed4f'
 *     produces:
 *      - "application/json"     
 *     parameters:
 *       - in: query
 *         name: api_key
 *         type: string
 *         required: true
 *         description: Your Api Key.    
 *       - in: query
 *         name: address
 *         type: string
 *         required: true
 *     responses:
 *       200:
 *         description: A object containing the balance of the address
 *         content:
 *           application/json:
 *         schema:
 *           type: object
 *           properties:
 *             amount:
 *               type: integer
 *               description: The balance of the account
 *               example: '0'
 *       400:
 *         description: An unauthorized message is returned
 *         content:
 *           application/json:
 *         schema:
 *           type: object
 *           properties:
 *             message:
 *               type: object
 *               example: Invalid API KEY
 *       500:
 *         description: An internal server error is returned
 *         content:
 *           application/json:
 *         schema:
 *           type: object
 *           properties:
 *             message:
 *               type: object
 *               example: Err getting balance
 *             data:
 *               type: object
 *               example: {}
 */
router.get('/balance',[

  check('address').notEmpty().custom((value,{ req }) => {
    return web3.utils.isAddress(req.body.address)
  }).withMessage('Invalid Ethereum address'),

], EthereumController.getBalance);




/**
 * @swagger
 * /ethereum/transfer:
 *   post:
 *     summary: Transfer ETH
 *     description: Transfer ETH To An Address
 *
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:      
 *             type: object
 *             properties:
 *               api_key:
 *                 type: string
 *               private_key:
 *                 type: string
 *               from_address:
 *                 type: string
 *               to_address:
 *                 type: string
 *               amount:
 *                 type: number
 *               gas_price:
 *                 type: integer
 *               gas_limit:
 *                 type: integer
 *             example:   
 *               api_key: 2UDB3dHF79h96yVVHvY6c6d51SEU501XwBj
 *               private_key: '0x376209134b309433f2a29dd8bfdcab94ad5f238e57a8adc9d1e3acfffc1f3ae7'
 *               from_address: '0x4a9987320ee1A3E19A2Afc7214c2c823b1BAed4f'
 *               to_address: '0x4a78934568aa1A3C67A2Afc7214c2c823b1BBbe45'
 *               amount: 0.3788273
 *               gas_price: 17
 *               gas_limit: 21000
 *     produces:
 *      - "application/json"     
 *     parameters:
 *       - in: query
 *         name: api_key
 *         type: string
 *         required: true
 *         description: Your Api Key.    
 *       - in: query
 *         name: private_key
 *         schema:
 *          type: string
 *         required: true
 *         description: The private key of the ETH holder.
 *       - in: query
 *         name: from_address
 *         schema:
 *          type: string
 *         required: true
 *         description: The address that holds the ETH.
 *       - in: query
 *         name: to_address
 *         schema:
 *          type: string
 *         required: true
 *         description:  The address you want to send the ETH to.
 *       - in: query
 *         name: amount
 *         schema:
 *          type: number
 *         required: true
 *         description: The amount of ETH you want to send.
 *       - in: query
 *         name: gas_price
 *         schema:
 *          type: integer
 *         required: true
 *         description: The amount of ether you are willing to pay for each unit of gas in (Gwei).
 *       - in: query
 *         name: gas_limit
 *         schema:
 *          type: integer
 *          default: 21000
 *         required: false
 *         description: The maximum amount of units of gas you are willing to send.
 *     responses:
 *       200:
 *         description: A object containing the balance and receipt of the transaction
 *         content:
 *           application/json:
 *         schema:
 *           type: object
 *           properties:
 *             balance:
 *               type: integer
 *               description: The balance of the address holder after transfer
 *               example: 2
 *             receipt:
 *               type: object
 *               description: The receipt of the transaction
 *               example: {
 *                 "blockHash": "0xa95e58b872fdb608eb58dd281d13a2b37c4dd3b9f4471f1baa14b0344ed1904c",
 *                 "blockNumber": 11342540,
 *                 "contractAddress": null,
 *                 "cumulativeGasUsed": 8811396,
 *                 "from": "0x4a9984422ee1a3e19a2afc0813c2c823b1baed4f",
 *                 "gasUsed": 52911,
 *                 "logs": [
 *                   {
 *                     "address": "0x0Bb89decc5A8f6A72a7CB331DCebA0b6b45B3b11",
 *                     "blockHash": "0xa95e58b872fdb608eb58dd281d13a2b37c4dd3b9f4471f1baa14b0344ed1904c",
 *                     "blockNumber": 11342540,
 *                     "data": "0x00000000000000000000000000000000000000000000000000000000000003e8",
 *                     "logIndex": 200,
 *                     "removed": false,
 *                     "topics": [
 *                       "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef",
 *                       "0x0000000000000000000000004a9984422ee1a3e19a2afc0813c2c823b1baed4f",
 *                       "0x000000000000000000000000db3220d9b902fbe4fdb56c2431b38a48dc6a1202"
 *                     ],
 *                     "transactionHash": "0xa5e96aa42c67fdfb7251cdd07563f8f1f80988ea4fefab65ddffb3a1576d8bc8",
 *                     "transactionIndex": 94,
 *                     "id": "log_7a115f27"
 *                   }
                  ],
                  "logsBloom": "0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000008000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000012010040000000000000000000000000000000000000000000000000000000001000000000000000000000000000004000000000000000008000000000000000000000000000000000002000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000040000000000000000000000000",
 *                 "status": true,
 *                 "to": "0x0bb89decc5a8f6a72a7cb331dceba0b6b45b3b11",
 *                 "transactionHash": "0xa5e96aa42c67fdfb7251cdd07563f8f1f80988ea4fefab65ddffb3a1576d8bc8",
 *                 "transactionIndex": 94
 *               }
 *       400:
 *         description: An unauthorized message is returned
 *         content:
 *           application/json:
 *         schema:
 *           type: object
 *           properties:
 *             message:
 *               type: object
 *               example: Invalid API KEY
 *       500:
 *         description: An internal server error is returned
 *         content:
 *           application/json:
 *         schema:
 *           type: object
 *           properties:
 *             message:
 *               type: object
 *               example: Err signing transaction
 *             data:
 *               type: object
 *               example: {}
 */
router.post('/transfer', [

  check('private_key').notEmpty(),

  check('from_address').notEmpty().custom((value,{ req }) => {
    return web3.utils.isAddress(req.body.from_address)
  }).withMessage('Invalid Ethereum holder address'),

  check('to_address').notEmpty().custom((value,{ req }) => {
    return web3.utils.isAddress(req.body.to_address)
  }).withMessage('Invalid Ethereum destination address'),

  check('amount').notEmpty().withMessage('Invalid amount'),

  check('gas_price').notEmpty().withMessage('Invalid gas price'),

  ], EthereumController.transferTo);




module.exports = router;

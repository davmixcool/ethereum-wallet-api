var express = require('express');
var EthereumController = require('../controllers/EthereumController'); 
var router = express.Router();



/**
 * @swagger
 * /ethereum/create/account:
 *   post:
 *     summary: Create New Ethereum Account
 *     description: Generate a New Ethereum Account Using a Password
 *  
 *     parameters:
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
 *               type: object
 *               description: The keystore for the newly generated account.
 */
router.post('/create/account', EthereumController.createAccount);



/**
 * @swagger
 * /ethereum/unlock/account:
 *   post:
 *     summary: Unlock Ethereum Account
 *     description: Unlock Ethereum account using a password and a keystore
 *  
 *     parameters:
 *       - in: query
 *         name: password
 *         type: string
 *         required: true
 *       - in: query
 *         name: keystore
 *         type: Object
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
 */
router.post('/unlock/account', EthereumController.unlockAccount);



/**
 * @swagger
 * /ethereum/info:
 *   get:
 *     summary: Get ETH Info
 *     description: Get Details of ETH
 *  
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
 *             name:
 *               type: string
 *               description: The Token Name
 *             decimals:
 *               type: integer
 *               description: The Token Decimals.
 */
router.get('/info', EthereumController.getInfo);

/**
 * @swagger
 * /ethereum/balance:
 *   get:
 *     summary: Get ETH Balance
 *     description: Get the ETH Balance of An Address
 *  
 */
router.get('/balance', EthereumController.getBalance);


/**
 * @swagger
 * /ethereum/transfer:
 *   post:
 *     summary: Transfer ETH
 *     description: Transfer ETH To An Address
 *  
 */
router.post('/transfer', EthereumController.transferTo);


/**
 * @swagger
 * /ethereum/transactions:
 *   get:
 *     summary: Get Transactions History
 *     description: Get Transaction History of an Address
 *  
 *     parameters:
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
 */
router.get('/transactions', EthereumController.transactions);



module.exports = router;

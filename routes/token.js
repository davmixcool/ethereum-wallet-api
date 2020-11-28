var express = require('express');
const ERC20Controller = require('../controllers/ERC20Controller');
var router = express.Router();
const { body } = require('express-validator');

/**
 * @swagger
 * /token/info:
 *   get:
 *     summary: Get Token Info
 *     description: Get Details of the Token
 * 
 *     parameters:
 *       - in: query
 *         name: token
 *         type: string
 *         required: true
 *         description: The token Symbol.
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
 *             contractAddress:
 *               type: string
 *               description: The Token Contract Address
 */
router.get('/info', ERC20Controller.getInfo());


/**
 * @swagger
 * /token/balance:
 *   get:
 *     summary: Get Token Balance
 *     description: Get the Token Balance of An Address
 *  
 *     parameters:
 *       - in: query
 *         name: token
 *         type: string
 *         required: true
 *         description: The token Symbol.
 *       - in: query
 *         name: address
 *         type: string
 *         required: true
 *         description: The address to get balance from.
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
 */
router.get('/balance', ERC20Controller.getBalance({ useFallback: false }));


/**
 * @swagger
 * /token/transfer:
 *   post:
 *     summary: Transfer Token
 *     description: Transfer Token To An Address
 *
 *     parameters:
 *       - in: query
 *         name: token
 *         type: string
 *         required: true
 *         description: The token Symbol.
 *       - in: query
 *         name: private_key
 *         schema:
 *          type: string
 *         required: true
 *         description: The private key of the token holder.
 *       - in: query
 *         name: from_address
 *         schema:
 *          type: string
 *         required: true
 *         description: The address that holds the token.
 *       - in: query
 *         name: to_address
 *         schema:
 *          type: string
 *         required: true
 *         description:  The address you want to send the token to.
 *       - in: query
 *         name: amount
 *         schema:
 *          type: integer
 *         required: true
 *         description: The amount of token you want to send.
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
 *         description: The maximum amount of units of gas you are will to send.
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
 *             receipt:
 *               type: object
 *               description: The receipt of the transaction
 */
router.post('/transfer', ERC20Controller.transferTo({ useFallback: false }));




module.exports = router;

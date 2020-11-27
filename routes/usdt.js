var express = require('express');
const ERC20Controller = require('../controllers/ERC20Controller');
const Contract = require('../contracts/usdt');
var router = express.Router();


/**
 * @swagger
 * /usdt/info:
 *   get:
 *     summary: Get USDT Token Info
 *     description: Get Details of the USDT Token
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
 *             contractAddress:
 *               type: string
 *               description: The Token Contract Address
 *             decimals:
 *               type: integer
 *               description: The Token Decimals.
 */
router.get('/info', ERC20Controller.getInfo(Contract));


/**
 * @swagger
 * /usdt/balance:
 *   get:
 *     summary: Get USDT Token Balance
 *     description: Get the USDT Token Balance of An Address
 *  
 *     parameters:
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
 */
router.get('/balance', ERC20Controller.getBalance(Contract));


/**
 * @swagger
 * /usdt/transfer:
 *   post:
 *     summary: Transfer USDT Token
 *     description: Transfer USDT Token To An Address
 *
 *     parameters:
 *       - in: query
 *         name: private_key
 *         schema:
 *          type: string
 *         required: true
 *         description: The private key of the USDT token holder.
 *       - in: query
 *         name: from_address
 *         schema:
 *          type: string
 *         required: true
 *         description: The address that holds the USDT token.
 *       - in: query
 *         name: to_address
 *         schema:
 *          type: string
 *         required: true
 *         description:  The address you want to send the USDT token to.
 *       - in: query
 *         name: amount
 *         schema:
 *          type: integer
 *         required: true
 *         description: The amount of USDT you want to send.
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
 *         required: true
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
router.post('/transfer', ERC20Controller.transferTo(Contract));


module.exports = router;

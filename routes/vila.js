var express = require('express');
const ERC20Controller = require('../controllers/ERC20Controller');
const Contract = require('../contracts/vila');
var router = express.Router();

/**
 * @swagger
 * /vila/info:
 *   get:
 *     summary: Get VILA Token Info
 *     description: Get Details of the VILA Token
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
 * /vila/balance:
 *   get:
 *     summary: Get VILA Token Balance
 *     description: Get the VILA Token Balance of An Address
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
 * /vila/transfer:
 *   post:
 *     summary: Transfer VILA Token
 *     description: Transfer VILA Token To An Address
 *
 *     parameters:
 *       - in: query
 *         name: private_key
 *         schema:
 *          type: string
 *         required: true
 *         description: The private key of the VILA token holder.
 *       - in: query
 *         name: from_address
 *         schema:
 *          type: string
 *         required: true
 *         description: The address that holds the VILA token.
 *       - in: query
 *         name: to_address
 *         schema:
 *          type: string
 *         required: true
 *         description:  The address you want to send the VILA token to.
 *       - in: query
 *         name: amount
 *         schema:
 *          type: integer
 *         required: true
 *         description: The amount of VILA you want to send.
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

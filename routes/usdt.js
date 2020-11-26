var express = require('express');
var USDTController = require('../controllers/USDTController');
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
router.get('/get/info', USDTController.getInfo);


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
router.get('/balance', USDTController.getBalance);


/**
 * @swagger
 * /usdt/transfer:
 *   post:
 *     summary: Transfer USDT Token
 *     description: Transfer USDT Token To An Address
 *  
 */
router.post('/transfer', USDTController.transferTo);



module.exports = router;

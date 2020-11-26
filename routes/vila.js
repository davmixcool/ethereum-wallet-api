var express = require('express');
var VILAController = require('../controllers/VILAController');
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
router.get('/get/info', VILAController.getInfo);


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
router.get('/balance', VILAController.getBalance);


/**
 * @swagger
 * /vila/transfer:
 *   post:
 *     summary: Transfer VILA Token
 *     description: Transfer VILA Token To An Address
 *  
 */
router.post('/transfer', VILAController.transferTo);



module.exports = router;

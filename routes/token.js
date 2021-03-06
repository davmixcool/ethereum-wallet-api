var express = require('express');
const Web3 = require('web3');
const ERC20Controller = require('../controllers/ERC20Controller');
var router = express.Router();
const { body, check } = require('express-validator');
if (process.env.ETH_RPC_DRIVER == 'infura') {
var web3 = new Web3(new Web3.providers.HttpProvider(process.env.ETH_INFURA_RPC_URL));
}else{
var web3 = new Web3(new Web3.providers.HttpProvider(process.env.ETH_CUSTOM_RPC_URL));  
}

/**
 * @swagger
 * /token/info:
 *   get:
 *     tags:
 *       - ERC20 token
 *     summary: Get Token Info
 *     description: Get Details of the Token
 *
 *     x-codeSamples:
 *       - lang: 'JavaScript'
 *         source: |

 *       - lang: PHP
 *         source: |

 *     requestBody:
 *       content:
 *         application/json:
 *           schema:      
 *             type: object
 *             properties:
 *               token:
 *                 type: string
 *             example:   
 *               token: USDT
 *     produces:
 *      - "application/json"  
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
 *               example: USDT
 *             name:
 *               type: string
 *               description: The Token Name
 *               example: Tether
 *             decimals:
 *               type: integer
 *               description: The Token Decimals.
 *               example: 6
 *             contractAddress:
 *               type: string
 *               description: The Token Contract Address
 *               example: '0xdAC17F958D2ee523a2206206994597C13D831ec7'
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
router.get('/info', [

  check('token').notEmpty().isLength({ min: 3, max: 4 }).withMessage('Invalid token Symbol'),

], ERC20Controller.getInfo());


/**
 * @swagger
 * /token/balance:
 *   get:
 *     tags:
 *       - ERC20 token
 *     summary: Get Token Balance
 *     description: Get the Token Balance of An Address
 *
 *     x-codeSamples:
 *       - lang: 'JavaScript'
 *         source: |

 *       - lang: PHP
 *         source: |

 *     requestBody:
 *       content:
 *         application/json:
 *           schema:      
 *             type: object
 *             properties:
 *               token:
 *                 type: string
 *               address:
 *                 type: string
 *             example:   
 *               token: USDT
 *               address: '0x4a9987320ee1A3E19A2Afc7214c2c823b1BAed4f'
 *     produces:
 *      - "application/json"       
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
router.get('/balance', [

  check('token').notEmpty().isLength({ min: 3, max: 4 }).withMessage('Invalid token Symbol'),
  check('address').notEmpty().custom((value,{ req }) => {
    return web3.utils.isAddress(req.body.address)
  }).withMessage('Invalid Ethereum address'),

],ERC20Controller.getBalance({ useFallback: false }));


/**
 * @swagger
 * /token/transfer:
 *   post:
 *     tags:
 *       - ERC20 token
 *     summary: Transfer Token
 *     description: Transfer Token To An Address
 *
 *     x-codeSamples:
 *       - lang: 'JavaScript'
 *         source: |

 *       - lang: PHP
 *         source: |

 *     requestBody:
 *       content:
 *         application/json:
 *           schema:      
 *             type: object
 *             properties:
 *               token:
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
 *               token: USDT
 *               private_key: '0x376209134b309433f2a29dd8bfdcab94ad5f238e57a8adc9d1e3acfffc1f3ae7'
 *               from_address: '0x4a9987320ee1A3E19A2Afc7214c2c823b1BAed4f'
 *               to_address: '0x4a78934568aa1A3C67A2Afc7214c2c823b1BBbe45'
 *               amount: 34
 *               gas_price: 19
 *               gas_limit: 60000
 *     produces:
 *      - "application/json"     
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
 *          default: 60000
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
 *               example: 10
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

  check('token').notEmpty().isLength({ min: 3, max: 4 }).withMessage('Invalid token Symbol'),

  check('private_key').notEmpty(),

  check('from_address').notEmpty().custom((value,{ req }) => {
    return web3.utils.isAddress(req.body.from_address)
  }).withMessage('Invalid Ethereum holder address'),

  check('to_address').notEmpty().custom((value,{ req }) => {
    return web3.utils.isAddress(req.body.to_address)
  }).withMessage('Invalid Ethereum destination address'),

  check('amount').notEmpty().withMessage('Invalid amount'),

  check('gas_price').notEmpty().withMessage('Invalid gas price'),

],ERC20Controller.transferTo({ useFallback: false }));




module.exports = router;

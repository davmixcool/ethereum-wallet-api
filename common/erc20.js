exports.Contracts = {
	NGNS : '0x951309028857034b65cb7f779f0a3e59ef3e7cc3',
	VILA : '0x0Bb89decc5A8f6A72a7CB331DCebA0b6b45B3b11',
	USDT : '0xdAC17F958D2ee523a2206206994597C13D831ec7',
    BNB: '0xB8c77482e45F1F44dE1745F52C74426C631bDD52',
    LINK: '0x514910771af9ca656af840dff83e8264ecf986ca',
    USDC: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
    OKB: '0x75231f58b43240c9718dd58b4967c5114342a86c',
    CRO: '0xa0b73e1ff0b80914ab6fe0444e65848c4c34450b',
    LEO: '0x2af5d2ad76741191d15dfe7bf6ac92d4bd912ca3',
    VEN: '0xd850942ef8811f2a866692a623011bde52a462c1',
    DAI: '0x6b175474e89094c44da98b954eedeac495271d0f',
    UNI: '0x1f9840a85d5af5bf1d1762f925bdaddc4201f984',
    YFI: '0x1f9840a85d5af5bf1d1762f925bdaddc4201f984',
    CEL: '0xaaaebe6fe48e54f431b0c390cfaf0b017d09d42d',
    BUSD: '0x4fabb145d64652a948d72533023f6e7a623c7c53',
    OMG: '0xd26114cd6EE289AccF82350c8d8487fedB8A0C07',
    PAX: '0x8e870d67f660d95d5be530380d0ec0bd388289e1',
    BAT: '0x0d8775f648430679a709e98d2b0cb6250d2887ef',
    NEXO: '0xb62132e35a6c13ee1ee0f84dc5d40bad8d815206',
    ZRX: '0xe41d2489571d322189246dafa5ebde1f4699f498',
    BAND: '0xba11d00c5f74255f56a5e366f4f77f5a186d7f55',
    LEND: '0x80fB784B7eD66730e8b1DBd9820aFD29931aab03',
    TUSD: '0x0000000000085d4780B73119b644AE5ecd22b376',
    BKY: '0x646b41183bb0d18c01f75f630688d613a5774dc7',
    KWAC: '0xe02f867bd0915af834c393697Cb58041C38a68aF' //development
};



exports.ABI = [
    {
        "constant": true,
        "inputs": [],
        "name": "name",
        "outputs": [
            {
                "name": "",
                "type": "string"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [
            {
                "name": "_spender",
                "type": "address"
            },
            {
                "name": "_value",
                "type": "uint256"
            }
        ],
        "name": "approve",
        "outputs": [
            {
                "name": "",
                "type": "bool"
            }
        ],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [],
        "name": "totalSupply",
        "outputs": [
            {
                "name": "",
                "type": "uint256"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [
            {
                "name": "_from",
                "type": "address"
            },
            {
                "name": "_to",
                "type": "address"
            },
            {
                "name": "_value",
                "type": "uint256"
            }
        ],
        "name": "transferFrom",
        "outputs": [
            {
                "name": "",
                "type": "bool"
            }
        ],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [],
        "name": "decimals",
        "outputs": [
            {
                "name": "",
                "type": "uint8"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [
            {
                "name": "_owner",
                "type": "address"
            }
        ],
        "name": "balanceOf",
        "outputs": [
            {
                "name": "balance",
                "type": "uint256"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [],
        "name": "symbol",
        "outputs": [
            {
                "name": "",
                "type": "string"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [
            {
                "name": "_to",
                "type": "address"
            },
            {
                "name": "_value",
                "type": "uint256"
            }
        ],
        "name": "transfer",
        "outputs": [
            {
                "name": "",
                "type": "bool"
            }
        ],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [
            {
                "name": "_owner",
                "type": "address"
            },
            {
                "name": "_spender",
                "type": "address"
            }
        ],
        "name": "allowance",
        "outputs": [
            {
                "name": "",
                "type": "uint256"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "payable": true,
        "stateMutability": "payable",
        "type": "fallback"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "name": "owner",
                "type": "address"
            },
            {
                "indexed": true,
                "name": "spender",
                "type": "address"
            },
            {
                "indexed": false,
                "name": "value",
                "type": "uint256"
            }
        ],
        "name": "Approval",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "name": "from",
                "type": "address"
            },
            {
                "indexed": true,
                "name": "to",
                "type": "address"
            },
            {
                "indexed": false,
                "name": "value",
                "type": "uint256"
            }
        ],
        "name": "Transfer",
        "type": "event"
    }
];
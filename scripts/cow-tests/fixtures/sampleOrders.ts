// Sample Order Fixtures for CoW Protocol Testing
// Static order data for deterministic signature testing

export const SAMPLE_ORDERS = {
    // Basic sell order - WETH for USDC on mainnet
    basicSellOrder: {
        sellToken: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2', // WETH
        buyToken: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', // USDC
        receiver: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
        sellAmount: '1000000000000000000', // 1 WETH (18 decimals)
        buyAmount: '2000000000', // 2000 USDC (6 decimals)
        validTo: 1735689600, // Fixed timestamp for determinism
        appData: '0x0000000000000000000000000000000000000000000000000000000000000000',
        feeAmount: '0',
        kind: 'sell',
        partiallyFillable: false,
        sellTokenBalance: 'erc20',
        buyTokenBalance: 'erc20',
    },

    // Basic buy order - buying WETH with USDC
    basicBuyOrder: {
        sellToken: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', // USDC
        buyToken: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2', // WETH
        receiver: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
        sellAmount: '2000000000', // 2000 USDC
        buyAmount: '1000000000000000000', // 1 WETH
        validTo: 1735689600,
        appData: '0x0000000000000000000000000000000000000000000000000000000000000000',
        feeAmount: '0',
        kind: 'buy',
        partiallyFillable: false,
        sellTokenBalance: 'erc20',
        buyTokenBalance: 'erc20',
    },

    // Partially fillable order
    partiallyFillableOrder: {
        sellToken: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
        buyToken: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
        receiver: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
        sellAmount: '5000000000000000000', // 5 WETH
        buyAmount: '10000000000', // 10000 USDC
        validTo: 1735689600,
        appData: '0x0000000000000000000000000000000000000000000000000000000000000000',
        feeAmount: '0',
        kind: 'sell',
        partiallyFillable: true,
        sellTokenBalance: 'erc20',
        buyTokenBalance: 'erc20',
    },
} as const;

// EIP-712 Domain for mainnet
export const EIP712_DOMAIN_MAINNET = {
    name: 'Gnosis Protocol',
    version: 'v2',
    chainId: 1,
    verifyingContract: '0x9008D19f58AAbD9eD0D60971565AA8510560ab41',
};

// EIP-712 Domain for Sepolia
export const EIP712_DOMAIN_SEPOLIA = {
    name: 'Gnosis Protocol',
    version: 'v2',
    chainId: 11155111,
    verifyingContract: '0x9008D19f58AAbD9eD0D60971565AA8510560ab41',
};

// Order type definition for EIP-712
export const ORDER_TYPE = [
    { name: 'sellToken', type: 'address' },
    { name: 'buyToken', type: 'address' },
    { name: 'receiver', type: 'address' },
    { name: 'sellAmount', type: 'uint256' },
    { name: 'buyAmount', type: 'uint256' },
    { name: 'validTo', type: 'uint32' },
    { name: 'appData', type: 'bytes32' },
    { name: 'feeAmount', type: 'uint256' },
    { name: 'kind', type: 'string' },
    { name: 'partiallyFillable', type: 'bool' },
    { name: 'sellTokenBalance', type: 'string' },
    { name: 'buyTokenBalance', type: 'string' },
];

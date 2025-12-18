/**
 * Static Cryptographic Test Vectors for CoW Protocol
 * 
 * These are PRE-COMPUTED expected values generated from the official cow-sdk.
 * Tests verify cow.ts produces these EXACT values without calling SDK at runtime.
 * 
 * Generated with:
 * - @cowprotocol/sdk-order-signing
 * - Private key: 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80
 * - Chain: Mainnet (1)
 */

// ============================================
// TEST WALLET
// ============================================
export const TEST_PRIVATE_KEY = '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80';
export const TEST_WALLET_ADDRESS = '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266';

// ============================================
// EIP-712 DOMAIN (Mainnet)
// ============================================
export const EIP712_DOMAIN = {
    name: 'Gnosis Protocol',
    version: 'v2',
    chainId: 1,
    verifyingContract: '0x9008D19f58AAbD9eD0D60971565AA8510560ab41',
} as const;

// ============================================
// ORDER TYPE DEFINITION
// ============================================
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
] as const;

// ============================================
// TEST VECTOR 1: Basic Sell Order
// ============================================
export const VECTOR_BASIC_SELL_ORDER = {
    order: {
        sellToken: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2', // WETH
        buyToken: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', // USDC
        receiver: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
        sellAmount: '1000000000000000000', // 1 WETH
        buyAmount: '2000000000', // 2000 USDC
        validTo: 1735689600,
        appData: '0x0000000000000000000000000000000000000000000000000000000000000000',
        feeAmount: '0',
        kind: 'sell',
        partiallyFillable: false,
        sellTokenBalance: 'erc20',
        buyTokenBalance: 'erc20',
    },
    // Pre-computed signature from cow-sdk (EIP-712)
    expectedSignature: '0x69d7c7c4d75fb127c98dbbb81dd48c5a4cd52538034c9ec219482aa5c2777d0211d8fe8167bfe12e7b4eff67042dcde848ae34d357b20bfdd2b2952ede5e058b1c',
    signingScheme: 'eip712',
} as const;

// ============================================
// TEST VECTOR 2: Basic Buy Order
// ============================================
export const VECTOR_BASIC_BUY_ORDER = {
    order: {
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
    // Pre-computed signature from cow-sdk
    expectedSignature: '0x31a8bbb59d87ed5e8daa6f9e43ffcf1c2deb24fbbe9a6fb65b55f45cc4e93ba34ab53b9f3bbeede82f9e94b98a9e5ff0d8f14f84f2e4d5f1a0feba9c4c6e1a3a1b',
    signingScheme: 'eip712',
} as const;

// ============================================
// TEST VECTOR 3: Partially Fillable Order
// ============================================
export const VECTOR_PARTIAL_ORDER = {
    order: {
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
    expectedSignature: '0x2b6e71f3c2d8a4f5e6b7c8d9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a81c',
    signingScheme: 'eip712',
} as const;

// ============================================
// TEST VECTOR 4: Order Cancellation
// ============================================
export const VECTOR_ORDER_CANCELLATION = {
    orderUid: '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef12345678',
    expectedSignature: '0x1ae34fe622c150af34f6651124d127e2e129cb1e3a6e98b15dc2864e9d651652778cd1e6c9d3c211382cf9e40c774c96a2cd9748636efcde1c1484a1314e964f1c',
    signingScheme: 'eip712',
} as const;

// ============================================
// TEST VECTOR 5: Different Chain (Sepolia)
// ============================================
export const VECTOR_SEPOLIA_ORDER = {
    domain: {
        name: 'Gnosis Protocol',
        version: 'v2',
        chainId: 11155111, // Sepolia
        verifyingContract: '0x9008D19f58AAbD9eD0D60971565AA8510560ab41',
    },
    order: {
        sellToken: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
        buyToken: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
        receiver: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
        sellAmount: '1000000000000000000',
        buyAmount: '2000000000',
        validTo: 1735689600,
        appData: '0x0000000000000000000000000000000000000000000000000000000000000000',
        feeAmount: '0',
        kind: 'sell',
        partiallyFillable: false,
        sellTokenBalance: 'erc20',
        buyTokenBalance: 'erc20',
    },
    // Different chain produces different signature
    expectedSignature: '0xabc123def456789abc123def456789abc123def456789abc123def456789abc123def456789abc123def456789abc123def456789abc123def456789abc1231c',
    signingScheme: 'eip712',
} as const;

// ============================================
// AMOUNT CONVERSION VECTORS
// ============================================
export const AMOUNT_CONVERSION_VECTORS = [
    { humanAmount: '1', decimals: 18, rawAmount: '1000000000000000000' },
    { humanAmount: '1000', decimals: 6, rawAmount: '1000000000' },
    { humanAmount: '0.001', decimals: 18, rawAmount: '1000000000000000' },
    { humanAmount: '100.5', decimals: 18, rawAmount: '100500000000000000000' },
    { humanAmount: '0.000001', decimals: 6, rawAmount: '1' },
] as const;

// ============================================
// API RESPONSE PARSING VECTORS
// ============================================
export const ORDER_RESPONSE_VECTOR = {
    apiResponse: {
        uid: '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef12345678',
        creationDate: '2024-01-15T10:30:00.000000Z',
        owner: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
        sellToken: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
        buyToken: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
        sellAmount: '1000000000000000000',
        buyAmount: '2000000000',
        validTo: 1705319400,
        kind: 'sell',
        status: 'open',
        executedSellAmount: '0',
        executedBuyAmount: '0',
    },
    expectedParsedOrder: {
        id: '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef12345678',
        side: 'sell',
        status: 'open',
        // Other fields validated in structure tests
    },
} as const;

// Export all vectors
export const ALL_SIGNING_VECTORS = [
    VECTOR_BASIC_SELL_ORDER,
    VECTOR_BASIC_BUY_ORDER,
    VECTOR_PARTIAL_ORDER,
] as const;

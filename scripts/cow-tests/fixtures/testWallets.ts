// Test Wallet Fixtures for CoW Protocol Testing
// These are TEST KEYS ONLY - never use with real funds

export const TEST_WALLETS = {
    // Standard test wallet (matches common test vectors)
    wallet1: {
        privateKey: '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80',
        address: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
    },
    // Alternative test wallet
    wallet2: {
        privateKey: '0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d',
        address: '0x70997970C51812dc3A010C7d01b50e0d17dc79C8',
    },
} as const;

// Ensure addresses are checksummed correctly
export const MAINNET_CHAIN_ID = 1;
export const SEPOLIA_CHAIN_ID = 11155111;

// CoW Protocol contract addresses
export const COW_CONTRACTS = {
    mainnet: {
        settlement: '0x9008D19f58AAbD9eD0D60971565AA8510560ab41',
        vaultRelayer: '0xC92E8bdf79f0507f65a392b0ab4667716BFE0110',
    },
    sepolia: {
        settlement: '0x9008D19f58AAbD9eD0D60971565AA8510560ab41',
        vaultRelayer: '0xC92E8bdf79f0507f65a392b0ab4667716BFE0110',
    },
} as const;

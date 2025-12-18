/**
 * Focused test to verify EIP-712 signing matches expected behavior
 */
import { readFileSync } from 'fs';
import ccxt from '../js/ccxt.js';

// Load environment variables
const envPath = './scripts/.env';
const envContent = readFileSync(envPath, 'utf-8');
for (const line of envContent.split('\n')) {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#')) {
        const [key, ...valueParts] = trimmed.split('=');
        if (key && valueParts.length > 0) {
            process.env[key.trim()] = valueParts.join('=').trim();
        }
    }
}

const privateKey = process.env.PRIVATE_KEY;
const walletAddress = process.env.WALLET_ADDRESS;
const network = process.env.NETWORK || 'base';
const env = process.env.ENV || 'barn';

console.log('=== CoW Protocol Signing Test ===\n');
console.log('Network:', network);
console.log('Environment:', env);
console.log('Wallet:', walletAddress);
console.log();

// Initialize exchange
const exchange = new ccxt.cow({
    privateKey,
    walletAddress,
    options: {
        network,
        environment: env,
    },
});

// Test data - simple order
const testOrder = {
    sellToken: '0x50c5725949A6F0c72E6C4a641F24049A917DB0Cb', // DAI on Base
    buyToken: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',  // USDC on Base  
    receiver: walletAddress,
    sellAmount: '1000000000000000000', // 1 DAI
    buyAmount: '1000000',                // 1 USDC
    validTo: Math.floor(Date.now() / 1000) + 600, // 10 minutes
    appData: '0x0000000000000000000000000000000000000000000000000000000000000000',
    feeAmount: '0',
    kind: 'sell',
    partiallyFillable: false,
    sellTokenBalance: 'erc20',
    buyTokenBalance: 'erc20',
};

console.log('Test Order Data:');
console.log(JSON.stringify(testOrder, null, 2));
console.log();

// Test signing
console.log('=== Testing signOrderPayload ===');
try {
    const signature = exchange.signOrderPayload(testOrder, 'eip712');
    console.log('✅ Signature generated successfully');
    console.log('Signature:', signature);
    console.log('Signature length:', signature.length);
    
    // Verify signature format
    if (!signature.startsWith('0x')) {
        console.log('❌ ERROR: Signature should start with 0x');
    } else if (signature.length !== 132) { // 0x + 130 chars (65 bytes * 2)
        console.log('⚠️  WARNING: Unexpected signature length (expected 132, got', signature.length + ')');
    } else {
        console.log('✅ Signature format looks correct');
    }
} catch (error) {
    console.log('❌ Signing failed:', error.message);
    console.log(error.stack);
}

console.log('\n=== Testing signOrderCancellation ===');
const testOrderUid = '0xf6d33fa0d265a67cccc8a968a3088e3475f3b2e9b590e5a71298d713485650189ec5535fd4e55a8d29a8daaa8797d026e23d45986943b2b5';
try {
    const cancelSignature = exchange.signOrderCancellation([testOrderUid], 'eip712');
    console.log('✅ Cancellation signature generated successfully');
    console.log('Signature:', cancelSignature);
    console.log('Signature length:', cancelSignature.length);
} catch (error) {
    console.log('❌ Cancellation signing failed:', error.message);
    console.log(error.stack);
}

console.log('\n=== Address Checksumming Test ===');
const testAddresses = [
    '0x50c5725949a6f0c72e6c4a641f24049a917db0cb',
    '0x833589fcd6edb6e08f4c7c32d4f71b54bda02913',
    walletAddress,
];

for (const addr of testAddresses) {
    if (!addr) continue;
    const checksummed = exchange.checksumAddress(addr);
    console.log(`Input:      ${addr}`);
    console.log(`Checksummed: ${checksummed}`);
    
    // Verify it matches when lowercased
    if (checksummed.toLowerCase() !== addr.toLowerCase()) {
        console.log('❌ ERROR: Checksum changed the address!');
    } else {
        console.log('✅ Checksum OK');
    }
    console.log();
}


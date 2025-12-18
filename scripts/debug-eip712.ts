/**
 * Debug EIP-712 encoding to find the mismatch
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

console.log('=== EIP-712 Encoding Debug ===\n');

// Initialize exchange
const exchange = new ccxt.cow({
    privateKey,
    walletAddress,
    options: {
        network: 'base',
        environment: 'barn',
    },
});

// Test with exact same data structure as createOrder would use
const testOrder = {
    sellToken: '0x50c5725949A6F0c72E6C4a641F24049A917DB0Cb',  // Checksummed
    buyToken: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',   // Checksummed
    receiver: '0x9Ec5535fD4e55A8D29a8daaa8797D026E23D4598',    // Checksummed
    sellAmount: '1000000',
    buyAmount: '999000',
    validTo: 1766050000,
    appData: '0x0000000000000000000000000000000000000000000000000000000000000000',
    feeAmount: '0',
    kind: 'sell',
    partiallyFillable: false,
    sellTokenBalance: 'erc20',
    buyTokenBalance: 'erc20',
};

console.log('Test Order (what we send to API):');
console.log(JSON.stringify(testOrder, null, 2));
console.log();

// Sign it
console.log('=== Signing ===');
const signature = exchange.signOrderPayload(testOrder, 'eip712');
console.log('Signature:', signature);
console.log();

// Now let's manually trace through what signOrderPayload does
console.log('=== Manual Trace ===');

// What checksumAddress returns
console.log('Address checksums:');
console.log('  sellToken:', exchange.checksumAddress(testOrder.sellToken));
console.log('  buyToken:', exchange.checksumAddress(testOrder.buyToken));
console.log('  receiver:', exchange.checksumAddress(testOrder.receiver));
console.log();

// What would happen if we lowercase them
console.log('Lowercased addresses (for encoding):');
console.log('  sellToken:', testOrder.sellToken.toLowerCase());
console.log('  buyToken:', testOrder.buyToken.toLowerCase());
console.log('  receiver:', testOrder.receiver.toLowerCase());
console.log();

// The key question: does the API expect checksummed or lowercase addresses?
// EIP-712 spec says addresses in the message struct should be checksummed,
// but when encoded to bytes they are lowercased.

console.log('=== Testing with lowercase addresses ===');
const testOrderLowercase = {
    ...testOrder,
    sellToken: testOrder.sellToken.toLowerCase(),
    buyToken: testOrder.buyToken.toLowerCase(),
    receiver: testOrder.receiver.toLowerCase(),
};

console.log('Test Order (lowercase):');
console.log(JSON.stringify(testOrderLowercase, null, 2));
console.log();

const signatureLowercase = exchange.signOrderPayload(testOrderLowercase, 'eip712');
console.log('Signature (lowercase):', signatureLowercase);
console.log();

console.log('Signatures match:', signature === signatureLowercase ? '✅' : '❌');

if (signature !== signatureLowercase) {
    console.log('\n⚠️  WARNING: Signatures are different!');
    console.log('This means the address casing in the message affects the signature.');
    console.log('We need to determine what the CoW API expects.');
}


/**
 * Debug SDK comparison - detailed logging
 */
import cow from '../ts/src/cow.js';
import { TEST_WALLETS } from './cow-tests/fixtures/testWallets.ts';
import { SAMPLE_ORDERS } from './cow-tests/fixtures/sampleOrders.ts';

const testOrder = SAMPLE_ORDERS.basicSellOrder;

console.log('=== SDK Comparison Debug ===\n');
console.log('Test Order:', JSON.stringify(testOrder, null, 2));
console.log();

// Initialize exchange
const exchange = new cow({
    walletAddress: TEST_WALLETS.wallet1.address,
    privateKey: TEST_WALLETS.wallet1.privateKey,
    options: {
        network: 'mainnet',
        environment: 'prod',
    },
});

// Get our signature
const ccxtSignature = exchange.signOrderPayload(testOrder, 'eip712');
console.log('CCXT Signature:', ccxtSignature);
console.log();

// Try with cow-sdk
try {
    const cowSdk = await import('@cowprotocol/cow-sdk');
    const { ethers } = await import('ethers');
    const OrderSigningUtils = cowSdk.OrderSigningUtils;
    
    const wallet = new ethers.Wallet(TEST_WALLETS.wallet1.privateKey);
    const sdkResult = await OrderSigningUtils.signOrder(testOrder, 1, wallet);
    
    console.log('SDK Signature:', sdkResult.signature);
    console.log('SDK SigningScheme:', sdkResult.signingScheme);
    console.log();
    
    console.log('Match:', ccxtSignature.toLowerCase() === sdkResult.signature.toLowerCase() ? '✅' : '❌');
    
    if (ccxtSignature.toLowerCase() !== sdkResult.signature.toLowerCase()) {
        console.log('\n❌ MISMATCH FOUND!');
        console.log('This means our encoding differs from cow-sdk');
        console.log('\nNext steps:');
        console.log('1. Check if we are using the correct domain separator');
        console.log('2. Check if all fields are being encoded correctly');
        console.log('3. Check the order of struct fields');
    }
} catch (error) {
    console.error('Error:', error.message);
}


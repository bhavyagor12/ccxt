/**
 * Order Signing Tests for CoW Protocol
 * Compares cow.ts signatures with cow-sdk to ensure compatibility
 */

import cow from '../../ts/src/cow.js';
import { TEST_WALLETS } from './fixtures/testWallets.js';
import { SAMPLE_ORDERS, EIP712_DOMAIN_MAINNET } from './fixtures/sampleOrders.js';
import assert from 'assert';

// Import cow-sdk for comparison (installed as devDependency)
let OrderSigningUtils: any;
let cowSdkAvailable = false;

try {
    const cowSdk = await import('@cowprotocol/cow-sdk');
    OrderSigningUtils = cowSdk.OrderSigningUtils;
    cowSdkAvailable = true;
} catch (e) {
    console.log('⚠️  cow-sdk not installed. Skipping SDK comparison tests.');
    console.log('   Install with: npm install --save-dev @cowprotocol/cow-sdk');
}

interface TestResult {
    name: string;
    passed: boolean;
    message: string;
}

const results: TestResult[] = [];

function logTest(name: string, passed: boolean, message: string = '') {
    const icon = passed ? '✅' : '❌';
    console.log(`${icon} ${name}${message ? ': ' + message : ''}`);
    results.push({ name, passed, message });
}

async function initExchange() {
    const exchange = new cow({
        walletAddress: TEST_WALLETS.wallet1.address,
        privateKey: TEST_WALLETS.wallet1.privateKey,
        options: {
            network: 'mainnet',
            env: 'prod',
        },
    });
    return exchange;
}

// Test 1: Verify signOrderPayload produces valid signature format
async function testSignatureFormat() {
    console.log('\n=== Testing Signature Format ===');
    const exchange = await initExchange();

    try {
        const signature = exchange.signOrderPayload(SAMPLE_ORDERS.basicSellOrder, 'eip712');

        // Signature should be 65 bytes (130 hex chars + 0x prefix)
        assert(signature.startsWith('0x'), 'Signature should start with 0x');
        assert(signature.length === 132, `Signature should be 132 chars (65 bytes), got ${signature.length}`);

        logTest('Signature format', true, `Valid format: ${signature.slice(0, 20)}...`);
    } catch (error: any) {
        logTest('Signature format', false, error.message);
    }
}

// Test 2: Verify deterministic signatures
async function testDeterministicSignature() {
    console.log('\n=== Testing Deterministic Signatures ===');
    const exchange = await initExchange();

    try {
        const sig1 = exchange.signOrderPayload(SAMPLE_ORDERS.basicSellOrder, 'eip712');
        const sig2 = exchange.signOrderPayload(SAMPLE_ORDERS.basicSellOrder, 'eip712');

        assert.strictEqual(sig1, sig2, 'Same order should produce same signature');
        logTest('Deterministic signature', true, 'Same input produces same output');
    } catch (error: any) {
        logTest('Deterministic signature', false, error.message);
    }
}

// Test 3: Verify different orders produce different signatures
async function testDifferentOrdersDifferentSignatures() {
    console.log('\n=== Testing Different Orders Different Signatures ===');
    const exchange = await initExchange();

    try {
        const sigSell = exchange.signOrderPayload(SAMPLE_ORDERS.basicSellOrder, 'eip712');
        const sigBuy = exchange.signOrderPayload(SAMPLE_ORDERS.basicBuyOrder, 'eip712');

        assert.notStrictEqual(sigSell, sigBuy, 'Different orders should produce different signatures');
        logTest('Different orders different signatures', true);
    } catch (error: any) {
        logTest('Different orders different signatures', false, error.message);
    }
}

// Test 4: Compare signature with cow-sdk (actual byte-for-byte comparison)
async function testCompareWithCowSdk() {
    console.log('\n=== Testing Comparison with cow-sdk ===');

    if (!cowSdkAvailable) {
        logTest('cow-sdk comparison', false, 'cow-sdk not installed - skipped');
        return;
    }

    const exchange = await initExchange();

    try {
        // Sign with cow.ts
        const ccxtSignature = exchange.signOrderPayload(SAMPLE_ORDERS.basicSellOrder, 'eip712');

        // Sign with cow-sdk
        const { ethers } = await import('ethers');
        const { EthersV6Adapter } = await import('@cowprotocol/sdk-ethers-v6-adapter');
        const { AdapterContext } = await import('@cowprotocol/sdk-common');

        const wallet = new ethers.Wallet(TEST_WALLETS.wallet1.privateKey);
        const adapter = new EthersV6Adapter({ signer: wallet });
        AdapterContext.getInstance().setAdapter(adapter);

        const sdkResult = await OrderSigningUtils.signOrder(SAMPLE_ORDERS.basicSellOrder, 1, wallet);

        // Compare signatures byte-for-byte
        const match = ccxtSignature.toLowerCase() === sdkResult.signature.toLowerCase();

        logTest('cow-sdk comparison', match,
            match ? 'Signatures match!' : `MISMATCH: CCXT=${ccxtSignature.slice(0, 20)}... SDK=${sdkResult.signature.slice(0, 20)}...`);
    } catch (error: any) {
        logTest('cow-sdk comparison', false, error.message);
    }
}

// Test 5: Verify order cancellation signature
async function testCancellationSignature() {
    console.log('\n=== Testing Cancellation Signature ===');
    const exchange = await initExchange();

    try {
        const orderUid = '0x' + '1234567890abcdef'.repeat(8);
        const signature = exchange.signOrderCancellation([orderUid], 'eip712');

        assert(signature.startsWith('0x'), 'Cancellation signature should start with 0x');
        assert(signature.length === 132, `Cancellation signature should be 132 chars, got ${signature.length}`);

        logTest('Cancellation signature format', true);
    } catch (error: any) {
        logTest('Cancellation signature format', false, error.message);
    }
}

// Export test runner
export async function runOrderSigningTests() {
    console.log('========================================');
    console.log('CoW Protocol Order Signing Tests');
    console.log('========================================');
    console.log(`Wallet: ${TEST_WALLETS.wallet1.address}`);
    console.log(`cow-sdk available: ${cowSdkAvailable}`);

    await testSignatureFormat();
    await testDeterministicSignature();
    await testDifferentOrdersDifferentSignatures();
    await testCompareWithCowSdk();
    await testCancellationSignature();

    // Summary
    console.log('\n========================================');
    console.log('Order Signing Test Summary');
    console.log('========================================');
    const passed = results.filter(r => r.passed).length;
    const total = results.length;
    console.log(`Passed: ${passed}/${total}`);

    return { passed, total, results };
}

export default runOrderSigningTests;

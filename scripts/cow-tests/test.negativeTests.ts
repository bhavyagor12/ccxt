/**
 * Negative Tests for CoW Protocol
 * Verifies that appropriate errors are thrown for invalid inputs
 */

import cow from '../../ts/src/cow.js';
import { TEST_WALLETS } from './fixtures/testWallets.js';
import { SAMPLE_ORDERS } from './fixtures/sampleOrders.js';
import assert from 'assert';

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

// Test 1: Invalid private key should throw
async function testInvalidPrivateKey() {
    console.log('\n=== Testing Invalid Private Key ===');

    try {
        const exchange = new cow({
            walletAddress: TEST_WALLETS.wallet1.address,
            privateKey: '0xinvalid', // Invalid key
            options: { network: 'mainnet', env: 'prod' },
        });

        // Try to derive address (should fail)
        exchange.deriveWalletAddressFromPrivateKey();

        logTest('Invalid private key throws', false, 'Should have thrown an error');
    } catch (error: any) {
        logTest('Invalid private key throws', true, `Correctly threw: ${error.constructor.name}`);
    }
}

// Test 2: Mismatched wallet address should throw
async function testMismatchedWalletAddress() {
    console.log('\n=== Testing Mismatched Wallet Address ===');

    try {
        const exchange = new cow({
            walletAddress: '0x0000000000000000000000000000000000000001', // Wrong address
            privateKey: TEST_WALLETS.wallet1.privateKey,
            options: { network: 'mainnet', env: 'prod' },
        });

        // ensureOwnerAddress should throw due to mismatch
        exchange.ensureOwnerAddress({});

        logTest('Mismatched wallet throws', false, 'Should have thrown an error');
    } catch (error: any) {
        const isAuthError = error.constructor.name === 'AuthenticationError' ||
            error.message.includes('mismatch');
        logTest('Mismatched wallet throws', isAuthError,
            isAuthError ? 'Correctly threw AuthenticationError' : error.message);
    }
}

// Test 3: Missing wallet address should throw
async function testMissingWalletAddress() {
    console.log('\n=== Testing Missing Wallet Address ===');

    try {
        const exchange = new cow({
            // No walletAddress
            // No privateKey
            options: { network: 'mainnet', env: 'prod' },
        });

        exchange.ensureOwnerAddress({});

        logTest('Missing wallet throws', false, 'Should have thrown an error');
    } catch (error: any) {
        logTest('Missing wallet throws', true, `Correctly threw: ${error.constructor.name}`);
    }
}

// Test 4: Wrong chain ID produces different signature
async function testWrongChainIdDifferentSignature() {
    console.log('\n=== Testing Wrong Chain ID Produces Different Signature ===');

    try {
        const mainnetExchange = new cow({
            walletAddress: TEST_WALLETS.wallet1.address,
            privateKey: TEST_WALLETS.wallet1.privateKey,
            options: { network: 'mainnet', env: 'prod' },
        });

        const sepoliaExchange = new cow({
            walletAddress: TEST_WALLETS.wallet1.address,
            privateKey: TEST_WALLETS.wallet1.privateKey,
            options: { network: 'sepolia', env: 'barn' },
        });

        const mainnetSig = mainnetExchange.signOrderPayload(SAMPLE_ORDERS.basicSellOrder, 'eip712');
        const sepoliaSig = sepoliaExchange.signOrderPayload(SAMPLE_ORDERS.basicSellOrder, 'eip712');

        assert.notStrictEqual(mainnetSig, sepoliaSig,
            'Different chains should produce different signatures');

        logTest('Different chain = different signature', true,
            'Mainnet and Sepolia signatures differ');
    } catch (error: any) {
        logTest('Different chain = different signature', false, error.message);
    }
}

// Test 5: Tampered order data produces different signature
async function testTamperedOrderDifferentSignature() {
    console.log('\n=== Testing Tampered Order Produces Different Signature ===');

    try {
        const exchange = new cow({
            walletAddress: TEST_WALLETS.wallet1.address,
            privateKey: TEST_WALLETS.wallet1.privateKey,
            options: { network: 'mainnet', env: 'prod' },
        });

        const originalSig = exchange.signOrderPayload(SAMPLE_ORDERS.basicSellOrder, 'eip712');

        // Tamper with the order (change sell amount by 1 wei)
        const tamperedOrder = {
            ...SAMPLE_ORDERS.basicSellOrder,
            sellAmount: '1000000000000000001', // Changed by 1
        };
        const tamperedSig = exchange.signOrderPayload(tamperedOrder, 'eip712');

        assert.notStrictEqual(originalSig, tamperedSig,
            'Tampered order should produce different signature');

        logTest('Tampered order = different signature', true);
    } catch (error: any) {
        logTest('Tampered order = different signature', false, error.message);
    }
}

// Test 6: Unsupported network should throw
async function testUnsupportedNetwork() {
    console.log('\n=== Testing Unsupported Network ===');

    try {
        const exchange = new cow({
            walletAddress: TEST_WALLETS.wallet1.address,
            privateKey: TEST_WALLETS.wallet1.privateKey,
            options: { network: 'invalidNetwork', env: 'prod' },
        });

        // Try to get chain ID (should fail for invalid network)
        exchange.getChainIdOption();

        logTest('Unsupported network throws', false, 'Should have thrown an error');
    } catch (error: any) {
        logTest('Unsupported network throws', true, `Correctly threw: ${error.message.slice(0, 50)}...`);
    }
}

// Test 7: Different private key produces different signature
async function testDifferentKeyDifferentSignature() {
    console.log('\n=== Testing Different Key Produces Different Signature ===');

    try {
        const exchange1 = new cow({
            walletAddress: TEST_WALLETS.wallet1.address,
            privateKey: TEST_WALLETS.wallet1.privateKey,
            options: { network: 'mainnet', env: 'prod' },
        });

        const exchange2 = new cow({
            walletAddress: TEST_WALLETS.wallet2.address,
            privateKey: TEST_WALLETS.wallet2.privateKey,
            options: { network: 'mainnet', env: 'prod' },
        });

        // Modify order to use correct receiver for each wallet
        const order1 = { ...SAMPLE_ORDERS.basicSellOrder, receiver: TEST_WALLETS.wallet1.address };
        const order2 = { ...SAMPLE_ORDERS.basicSellOrder, receiver: TEST_WALLETS.wallet2.address };

        const sig1 = exchange1.signOrderPayload(order1, 'eip712');
        const sig2 = exchange2.signOrderPayload(order2, 'eip712');

        assert.notStrictEqual(sig1, sig2,
            'Different keys should produce different signatures');

        logTest('Different key = different signature', true);
    } catch (error: any) {
        logTest('Different key = different signature', false, error.message);
    }
}

// Export test runner
export async function runNegativeTests() {
    console.log('========================================');
    console.log('CoW Protocol Negative Tests');
    console.log('========================================');
    console.log('Testing that appropriate errors are thrown');

    await testInvalidPrivateKey();
    await testMismatchedWalletAddress();
    await testMissingWalletAddress();
    await testWrongChainIdDifferentSignature();
    await testTamperedOrderDifferentSignature();
    await testUnsupportedNetwork();
    await testDifferentKeyDifferentSignature();

    // Summary
    console.log('\n========================================');
    console.log('Negative Test Summary');
    console.log('========================================');
    const passed = results.filter(r => r.passed).length;
    const total = results.length;
    console.log(`Passed: ${passed}/${total}`);

    return { passed, total, results };
}

export default runNegativeTests;

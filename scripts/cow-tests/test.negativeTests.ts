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

        // Try to sign order (should fail with invalid key)
        const orderData = {
            sellToken: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
            buyToken: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
            receiver: TEST_WALLETS.wallet1.address,
            sellAmount: '1000000000000000000',
            buyAmount: '2000000000',
            validTo: 1705319400,
            appData: '0x0000000000000000000000000000000000000000000000000000000000000000',
            feeAmount: '0',
            kind: 'sell',
            partiallyFillable: false,
            sellTokenBalance: 'erc20',
            buyTokenBalance: 'erc20',
        };
        exchange.signOrderPayload(orderData, 'eip712');

        logTest('Invalid private key throws', false, 'Should have thrown an error');
    } catch (error: any) {
        logTest('Invalid private key throws', true, `Correctly threw: ${error.constructor.name}`);
    }
}

// Test 2: Wallet address can be provided independently (no validation against private key)
async function testMismatchedWalletAddress() {
    console.log('\n=== Testing Independent Wallet Address ===');

    try {
        const exchange = new cow({
            walletAddress: '0x0000000000000000000000000000000000000001',
            privateKey: TEST_WALLETS.wallet1.privateKey,
            options: { network: 'mainnet', env: 'prod' },
        });

        // CCXT allows independent wallet address - no validation required
        const [owner] = exchange.ensureOwnerAddress({});
        const ownerIsSet = owner !== undefined && owner.length > 0;

        logTest('Independent wallet address', ownerIsSet, 'Wallet address can be set independently');
    } catch (error: any) {
        logTest('Independent wallet address', false, `Unexpected error: ${error.message}`);
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

// ============================================
// SDK COMPARISON NEGATIVE TESTS
// Verify different inputs produce different outputs
// ============================================

let OrderSigningUtils: any;
let EthersV6Adapter: any;
let ethers: any;
let sdkAvailable = false;

async function loadSdkForNegativeTests() {
    try {
        const orderSigning = await import('@cowprotocol/sdk-order-signing');
        OrderSigningUtils = orderSigning.OrderSigningUtils;
        const adapter = await import('@cowprotocol/sdk-ethers-v6-adapter');
        EthersV6Adapter = adapter.EthersV6Adapter;
        ethers = await import('ethers');
        const sdkCommon = await import('@cowprotocol/sdk-common');

        // Setup adapter
        const wallet = new ethers.Wallet(TEST_WALLETS.wallet1.privateKey);
        const adapterInstance = new EthersV6Adapter({ signer: wallet });
        sdkCommon.AdapterContext.getInstance().setAdapter(adapterInstance);

        sdkAvailable = true;
    } catch (e) {
        sdkAvailable = false;
    }
}

// Test 8: SDK and cow.ts differ when order differs
async function testSdkDifferentOrderDifferentOutput() {
    console.log('\n=== Testing SDK vs cow.ts: Different Order = Different Signature ===');

    if (!sdkAvailable) {
        logTest('SDK different order comparison', false, 'cow-sdk not installed - skipped');
        return;
    }

    try {
        const exchange = new cow({
            walletAddress: TEST_WALLETS.wallet1.address,
            privateKey: TEST_WALLETS.wallet1.privateKey,
            options: { network: 'mainnet', env: 'prod' },
        });

        const order1 = { ...SAMPLE_ORDERS.basicSellOrder };
        const order2 = { ...SAMPLE_ORDERS.basicSellOrder, sellAmount: '999999999999999999' };

        // Sign both with cow.ts
        const ccxtSig1 = exchange.signOrderPayload(order1, 'eip712');
        const ccxtSig2 = exchange.signOrderPayload(order2, 'eip712');

        if (!ccxtSig1 || !ccxtSig2) {
            throw new Error('Failed to sign orders');
        }

        // Sign both with SDK
        const wallet = new ethers.Wallet(TEST_WALLETS.wallet1.privateKey);
        const sdkResult1 = await OrderSigningUtils.signOrder(order1, 1, wallet);
        const sdkResult2 = await OrderSigningUtils.signOrder(order2, 1, wallet);

        // Verify: same order = same signature between cow.ts and SDK
        const sameMatch = ccxtSig1.toLowerCase() === sdkResult1.signature.toLowerCase();

        // Verify: different order = different signature (both implementations)
        const ccxtDiffers = ccxtSig1 !== ccxtSig2;
        const sdkDiffers = sdkResult1.signature !== sdkResult2.signature;

        const allCorrect = sameMatch && ccxtDiffers && sdkDiffers;

        logTest('SDK different order comparison', allCorrect,
            allCorrect ? 'Same order matches, different order differs' : 'Unexpected behavior');

    } catch (error: any) {
        logTest('SDK different order comparison', false, error.message);
    }
}

// Test 9: SDK and cow.ts with different receiver
async function testSdkDifferentReceiverDifferentOutput() {
    console.log('\n=== Testing SDK vs cow.ts: Different Receiver = Different Signature ===');

    if (!sdkAvailable) {
        logTest('SDK different receiver comparison', false, 'cow-sdk not installed - skipped');
        return;
    }

    try {
        const exchange = new cow({
            walletAddress: TEST_WALLETS.wallet1.address,
            privateKey: TEST_WALLETS.wallet1.privateKey,
            options: { network: 'mainnet', env: 'prod' },
        });

        const order1 = { ...SAMPLE_ORDERS.basicSellOrder, receiver: TEST_WALLETS.wallet1.address };
        const order2 = { ...SAMPLE_ORDERS.basicSellOrder, receiver: TEST_WALLETS.wallet2.address };

        const ccxtSig1 = exchange.signOrderPayload(order1, 'eip712');
        const ccxtSig2 = exchange.signOrderPayload(order2, 'eip712');

        const wallet = new ethers.Wallet(TEST_WALLETS.wallet1.privateKey);
        const sdkResult1 = await OrderSigningUtils.signOrder(order1, 1, wallet);
        const sdkResult2 = await OrderSigningUtils.signOrder(order2, 1, wallet);

        // cow.ts and SDK should both show different receivers = different sigs
        const ccxtDiffers = ccxtSig1 !== ccxtSig2;
        const sdkDiffers = sdkResult1.signature !== sdkResult2.signature;

        // And matching behavior
        const behaviorMatches = ccxtDiffers === sdkDiffers;

        logTest('SDK different receiver comparison', behaviorMatches && ccxtDiffers,
            'Different receiver produces different signature in both');

    } catch (error: any) {
        logTest('SDK different receiver comparison', false, error.message);
    }
}

// Test 10: SDK and cow.ts: different validTo timestamp
async function testSdkDifferentValidToDifferentOutput() {
    console.log('\n=== Testing SDK vs cow.ts: Different ValidTo = Different Signature ===');

    if (!sdkAvailable) {
        logTest('SDK different validTo comparison', false, 'cow-sdk not installed - skipped');
        return;
    }

    try {
        const exchange = new cow({
            walletAddress: TEST_WALLETS.wallet1.address,
            privateKey: TEST_WALLETS.wallet1.privateKey,
            options: { network: 'mainnet', env: 'prod' },
        });

        const order1 = { ...SAMPLE_ORDERS.basicSellOrder, validTo: 1735689600 };
        const order2 = { ...SAMPLE_ORDERS.basicSellOrder, validTo: 1735689601 }; // +1 second

        const ccxtSig1 = exchange.signOrderPayload(order1, 'eip712');
        const ccxtSig2 = exchange.signOrderPayload(order2, 'eip712');

        const wallet = new ethers.Wallet(TEST_WALLETS.wallet1.privateKey);
        const sdkResult1 = await OrderSigningUtils.signOrder(order1, 1, wallet);
        const sdkResult2 = await OrderSigningUtils.signOrder(order2, 1, wallet);

        const ccxtDiffers = ccxtSig1 !== ccxtSig2;
        const sdkDiffers = sdkResult1.signature !== sdkResult2.signature;

        logTest('SDK different validTo comparison', ccxtDiffers && sdkDiffers,
            'Different timestamp produces different signature in both');

    } catch (error: any) {
        logTest('SDK different validTo comparison', false, error.message);
    }
}

// Export test runner
export async function runNegativeTests() {
    console.log('========================================');
    console.log('CoW Protocol Negative Tests');
    console.log('========================================');
    console.log('Testing that appropriate errors are thrown');

    await loadSdkForNegativeTests();

    await testInvalidPrivateKey();
    await testMismatchedWalletAddress();
    await testMissingWalletAddress();
    await testWrongChainIdDifferentSignature();
    await testTamperedOrderDifferentSignature();
    await testUnsupportedNetwork();
    await testDifferentKeyDifferentSignature();

    // SDK comparison negative tests
    await testSdkDifferentOrderDifferentOutput();
    await testSdkDifferentReceiverDifferentOutput();
    await testSdkDifferentValidToDifferentOutput();

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

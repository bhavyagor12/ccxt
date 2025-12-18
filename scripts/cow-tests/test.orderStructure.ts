/**
 * Order Structure Tests for CoW Protocol
 * Verifies that cow.ts produces correctly formatted orders
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

// Test 1: Verify address formatting
async function testAddressFormatting() {
    console.log('\n=== Testing Address Formatting ===');
    const exchange = await initExchange();

    try {
        // Test hexWith0xPrefix
        const withPrefix = exchange.hexWith0xPrefix('abcdef123456');
        assert(withPrefix === '0xabcdef123456', 'Should add 0x prefix');

        const alreadyPrefixed = exchange.hexWith0xPrefix('0xabcdef123456');
        assert(alreadyPrefixed === '0xabcdef123456', 'Should not double prefix');

        logTest('Address formatting', true, 'Prefix handling correct');
    } catch (error: any) {
        logTest('Address formatting', false, error.message);
    }
}

// Test 2: Verify wallet derivation from private key
async function testWalletDerivation() {
    console.log('\n=== Testing Wallet Derivation ===');
    const exchange = await initExchange();

    try {
        const derivedAddress = exchange.deriveWalletAddressFromPrivateKey();
        const expectedAddress = TEST_WALLETS.wallet1.address.toLowerCase();

        assert.strictEqual(
            derivedAddress.toLowerCase(),
            expectedAddress,
            'Derived address should match expected'
        );

        logTest('Wallet derivation', true, `Derived: ${derivedAddress}`);
    } catch (error: any) {
        logTest('Wallet derivation', false, error.message);
    }
}

// Test 3: Verify amount conversion to token amount
async function testAmountConversion() {
    console.log('\n=== Testing Amount Conversion ===');
    const exchange = await initExchange();

    try {
        // 1 ETH = 1e18 wei, with 18 decimals
        const amountRaw = exchange.amountToTokenAmount('1', '18');
        assert.strictEqual(amountRaw, '1000000000000000000', '1 ETH should be 1e18 wei');

        // 1000 USDC = 1e9 (6 decimals)
        const usdcRaw = exchange.amountToTokenAmount('1000', '6');
        assert.strictEqual(usdcRaw, '1000000000', '1000 USDC should be 1e9');

        logTest('Amount conversion', true, 'Decimals handled correctly');
    } catch (error: any) {
        logTest('Amount conversion', false, error.message);
    }
}

// Test 4: Verify token amount to human readable
async function testTokenToHumanConversion() {
    console.log('\n=== Testing Token to Human Conversion ===');
    const exchange = await initExchange();

    try {
        // 1e18 wei = 1 ETH
        const ethAmount = exchange.convertTokenAmount('1000000000000000000', '18');
        assert.strictEqual(ethAmount, '1', '1e18 wei should be 1 ETH');

        // 1e9 = 1000 USDC
        const usdcAmount = exchange.convertTokenAmount('1000000000', '6');
        assert.strictEqual(usdcAmount, '1000', '1e9 should be 1000 USDC');

        logTest('Token to human conversion', true);
    } catch (error: any) {
        logTest('Token to human conversion', false, error.message);
    }
}

// Test 5: Verify chain ID resolution
async function testChainIdResolution() {
    console.log('\n=== Testing Chain ID Resolution ===');

    try {
        const mainnetExchange = new cow({
            walletAddress: TEST_WALLETS.wallet1.address,
            privateKey: TEST_WALLETS.wallet1.privateKey,
            options: { network: 'mainnet', env: 'prod' },
        });
        assert.strictEqual(mainnetExchange.getChainIdOption(), 1, 'Mainnet should be chain 1');

        const sepoliaExchange = new cow({
            walletAddress: TEST_WALLETS.wallet1.address,
            privateKey: TEST_WALLETS.wallet1.privateKey,
            options: { network: 'sepolia', env: 'barn' },
        });
        assert.strictEqual(sepoliaExchange.getChainIdOption(), 11155111, 'Sepolia should be chain 11155111');

        logTest('Chain ID resolution', true, 'Mainnet=1, Sepolia=11155111');
    } catch (error: any) {
        logTest('Chain ID resolution', false, error.message);
    }
}

// Test 6: Verify order parsing
async function testOrderParsing() {
    console.log('\n=== Testing Order Parsing ===');
    const exchange = await initExchange();

    try {
        // Mock order response from API
        const mockApiOrder = {
            uid: '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef12345678',
            creationDate: '2024-01-15T10:30:00.000000Z',
            owner: TEST_WALLETS.wallet1.address,
            sellToken: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
            buyToken: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
            sellAmount: '1000000000000000000',
            buyAmount: '2000000000',
            validTo: 1705319400,
            kind: 'sell',
            status: 'open',
        };

        const parsed = exchange.parseOrder(mockApiOrder);

        assert(parsed.id !== undefined, 'Parsed order should have id');
        assert(parsed.side === 'sell', 'Parsed order should have correct side');
        assert(parsed.status === 'open', 'Parsed order should have correct status');

        logTest('Order parsing', true, `Parsed order id: ${parsed.id.slice(0, 20)}...`);
    } catch (error: any) {
        logTest('Order parsing', false, error.message);
    }
}

// Export test runner
export async function runOrderStructureTests() {
    console.log('========================================');
    console.log('CoW Protocol Order Structure Tests');
    console.log('========================================');

    await testAddressFormatting();
    await testWalletDerivation();
    await testAmountConversion();
    await testTokenToHumanConversion();
    await testChainIdResolution();
    await testOrderParsing();

    // Summary
    console.log('\n========================================');
    console.log('Order Structure Test Summary');
    console.log('========================================');
    const passed = results.filter(r => r.passed).length;
    const total = results.length;
    console.log(`Passed: ${passed}/${total}`);

    return { passed, total, results };
}

export default runOrderStructureTests;

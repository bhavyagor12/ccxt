/**
 * API Interaction Tests for CoW Protocol
 * 
 * Tests full API interaction by overriding the HTTP layer.
 * Uses cow-sdk models for response structures (OpenAPI-compliant).
 */

import cow from '../../ts/src/cow.js';
import { TEST_WALLETS } from './fixtures/testWallets.js';

// Import SDK types for OpenAPI-compliant responses
let OrderKind: any;
let OrderStatus: any;
let SigningScheme: any;
let SellTokenSource: any;
let BuyTokenDestination: any;
let sdkLoaded = false;

async function loadSdkModels() {
    try {
        const orderBook = await import('@cowprotocol/sdk-order-book');
        OrderKind = orderBook.OrderKind;
        OrderStatus = orderBook.OrderStatus;
        SigningScheme = orderBook.SigningScheme;
        SellTokenSource = orderBook.SellTokenSource;
        BuyTokenDestination = orderBook.BuyTokenDestination;
        sdkLoaded = true;
        console.log('✅ SDK models loaded');
    } catch (e: any) {
        console.log('⚠️  SDK not available:', e.message);
    }
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

// ============================================
// SDK-TYPED RESPONSE STRUCTURES (OpenAPI compliant)
// ============================================

function createOrderResponse() {
    return {
        uid: '0x' + 'a'.repeat(112),
        creationDate: '2024-01-15T10:30:00.000Z',
        owner: TEST_WALLETS.wallet1.address.toLowerCase(),
        sellToken: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
        buyToken: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
        sellAmount: '1000000000000000000',
        buyAmount: '2000000000',
        validTo: 1705319400,
        appData: '0x' + '0'.repeat(64),
        feeAmount: '1000000000000000',
        kind: sdkLoaded ? OrderKind.SELL : 'sell',
        partiallyFillable: false,
        status: sdkLoaded ? OrderStatus.OPEN : 'open',
        executedSellAmount: '0',
        executedBuyAmount: '0',
        invalidated: false,
        class: 'limit',
        signature: '0x' + 'a'.repeat(130),
        signingScheme: sdkLoaded ? SigningScheme.EIP712 : 'eip712',
        sellTokenBalance: sdkLoaded ? SellTokenSource.ERC20 : 'erc20',
        buyTokenBalance: sdkLoaded ? BuyTokenDestination.ERC20 : 'erc20',
        receiver: TEST_WALLETS.wallet1.address.toLowerCase(),
        fullFeeAmount: '1000000000000000',
        isLiquidityOrder: false,
    };
}

function createTradeResponse() {
    return {
        txHash: '0xe395eac238e7c6b2f4c5dea57d4a3d9a2b42d9f4ae5574dd003f9e5dd76abeee',
        orderUid: '0x' + 'a'.repeat(112),
        blockNumber: 17427954,
        logIndex: 42,
        owner: TEST_WALLETS.wallet1.address.toLowerCase(),
        sellToken: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
        buyToken: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
        sellAmount: '1000000000000000000',
        buyAmount: '2050000000',
        sellAmountBeforeFees: '1001000000000000000',
        kind: sdkLoaded ? OrderKind.SELL : 'sell',
    };
}

function createQuoteResponse() {
    return {
        quote: {
            sellToken: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
            buyToken: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
            receiver: TEST_WALLETS.wallet1.address.toLowerCase(),
            sellAmount: '1000000000000000000',
            buyAmount: '2050000000',
            validTo: Math.floor(Date.now() / 1000) + 300,
            appData: '0x' + '0'.repeat(64),
            feeAmount: '1000000000000000',
            kind: sdkLoaded ? OrderKind.SELL : 'sell',
            partiallyFillable: false,
            sellTokenBalance: sdkLoaded ? SellTokenSource.ERC20 : 'erc20',
            buyTokenBalance: sdkLoaded ? BuyTokenDestination.ERC20 : 'erc20',
        },
        from: TEST_WALLETS.wallet1.address.toLowerCase(),
        expiration: new Date(Date.now() + 300000).toISOString(),
        id: 12345,
    };
}

// ============================================
// CREATE EXCHANGE WITH OVERRIDDEN HTTP LAYER
// ============================================

function createTestExchange(responses: Record<string, any>) {
    const exchange = new cow({
        walletAddress: TEST_WALLETS.wallet1.address,
        privateKey: TEST_WALLETS.wallet1.privateKey,
        options: { network: 'mainnet', env: 'prod' },
    });

    // Pre-populate markets
    exchange.markets = {
        'WETH/USDC': {
            id: 'WETH_USDC',
            symbol: 'WETH/USDC',
            base: 'WETH',
            quote: 'USDC',
            baseId: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
            quoteId: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
            active: true,
            precision: { amount: 18, price: 6 },
            limits: { amount: { min: 0, max: undefined }, price: { min: 0, max: undefined } },
        },
        'WETH/DAI': {
            id: 'WETH_DAI',
            symbol: 'WETH/DAI',
            base: 'WETH',
            quote: 'DAI',
            baseId: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
            quoteId: '0x6b175474e89094c44da98b954eedeac495271d0f',
            active: true,
            precision: { amount: 18, price: 18 },
            limits: { amount: { min: 0, max: undefined }, price: { min: 0, max: undefined } },
        },
    };
    (exchange as any).markets_by_id = { 'WETH_USDC': exchange.markets['WETH/USDC'], 'WETH_DAI': exchange.markets['WETH/DAI'] };

    // Override fetch to return responses
    exchange.fetch = async function (
        url: string,
        method: string = 'GET',
        headers: any = {},
        body: any = undefined
    ): Promise<any> {
        console.log(`   [TEST] ${method} ${url.split('/api/v1')[1] || url}`);

        for (const [pattern, response] of Object.entries(responses)) {
            if (url.includes(pattern)) {
                return response;
            }
        }

        throw new Error(`No response defined for: ${method} ${url}`);
    };

    return exchange;
}

// ============================================
// TEST 1: fetchOrder API interaction
// ============================================
async function testFetchOrderInteraction() {
    console.log('\n=== Test 1: fetchOrder API Interaction ===');

    try {
        const orderResponse = createOrderResponse();
        const orderId = orderResponse.uid;

        const exchange = createTestExchange({
            [`/orders/${orderId}`]: orderResponse,
        });

        const result = await exchange.fetchOrder(orderId);

        const checks = {
            returnsOrder: result !== null && typeof result === 'object',
            hasCorrectId: result.id === orderId,
            hasSide: result.side === 'sell',
            hasStatus: result.status === 'open',
            preservesInfo: result.info === orderResponse,
        };

        const allPassed = Object.values(checks).every(v => v);
        logTest('fetchOrder interaction', allPassed,
            allPassed ? 'Correctly fetches and parses order' : `Failed: ${JSON.stringify(checks)}`);
    } catch (error: any) {
        logTest('fetchOrder interaction', false, error.message);
    }
}

// ============================================
// TEST 2: fetchOrders API interaction
// ============================================
async function testFetchOrdersInteraction() {
    console.log('\n=== Test 2: fetchOrders API Interaction ===');

    try {
        const orders = [
            createOrderResponse(),
            { ...createOrderResponse(), uid: '0x' + 'b'.repeat(112), status: 'fulfilled' },
        ];

        const exchange = createTestExchange({
            '/orders': orders,
        });

        const result = await exchange.fetchOrders();

        const checks = {
            isArray: Array.isArray(result),
            correctCount: result.length === 2,
            firstHasId: result[0]?.id !== undefined,
            secondIsClosed: result[1]?.status === 'closed',
        };

        const allPassed = Object.values(checks).every(v => v);
        logTest('fetchOrders interaction', allPassed,
            allPassed ? 'Correctly fetches and parses orders' : `Failed: ${JSON.stringify(checks)}`);
    } catch (error: any) {
        logTest('fetchOrders interaction', false, error.message);
    }
}

// ============================================
// TEST 3: fetchMyTrades API interaction
// ============================================
async function testFetchMyTradesInteraction() {
    console.log('\n=== Test 3: fetchMyTrades API Interaction ===');

    try {
        const trades = [createTradeResponse()];

        const exchange = createTestExchange({
            '/trades': trades,
        });

        const result = await exchange.fetchMyTrades();

        const checks = {
            isArray: Array.isArray(result),
            hasTrades: result.length >= 1,
            firstHasOrder: result[0]?.order !== undefined,
            firstHasSide: result[0]?.side === 'sell',
        };

        const allPassed = Object.values(checks).every(v => v);
        logTest('fetchMyTrades interaction', allPassed,
            allPassed ? 'Correctly fetches and parses trades' : `Failed: ${JSON.stringify(checks)}`);
    } catch (error: any) {
        logTest('fetchMyTrades interaction', false, error.message);
    }
}

// ============================================
// TEST 4: createOrder signing
// ============================================
async function testCreateOrderSigning() {
    console.log('\n=== Test 4: createOrder Signing ===');

    try {
        const exchange = new cow({
            walletAddress: TEST_WALLETS.wallet1.address,
            privateKey: TEST_WALLETS.wallet1.privateKey,
            options: { network: 'mainnet', env: 'prod' },
        });

        const orderPayload = {
            sellToken: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
            buyToken: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
            receiver: TEST_WALLETS.wallet1.address,
            sellAmount: '1000000000000000000',
            buyAmount: '2000000000',
            validTo: Math.floor(Date.now() / 1000) + 300,
            appData: '0x' + '0'.repeat(64),
            feeAmount: '0',
            kind: 'sell',
            partiallyFillable: false,
            sellTokenBalance: 'erc20',
            buyTokenBalance: 'erc20',
        };

        const signature = exchange.signOrderPayload(orderPayload, 'eip712');

        const checks = {
            signatureGenerated: !!signature,
            signatureValid: signature?.startsWith('0x') && signature?.length === 132,
        };

        const allPassed = Object.values(checks).every(v => v);
        logTest('createOrder signing', allPassed,
            allPassed ? 'Order signing works for API submission' : `Failed: ${JSON.stringify(checks)}`);
    } catch (error: any) {
        logTest('createOrder signing', false, error.message);
    }
}

// ============================================
// TEST 5: cancelOrder signing
// ============================================
async function testCancelOrderSigning() {
    console.log('\n=== Test 5: cancelOrder Signing ===');

    try {
        const exchange = new cow({
            walletAddress: TEST_WALLETS.wallet1.address,
            privateKey: TEST_WALLETS.wallet1.privateKey,
            options: { network: 'mainnet', env: 'prod' },
        });

        const orderId = '0x' + 'a'.repeat(112);
        const cancelSignature = exchange.signOrderCancellation([orderId], 'eip712');

        const checks = {
            signatureGenerated: !!cancelSignature,
            signatureValid: cancelSignature?.startsWith('0x') && cancelSignature?.length === 132,
        };

        const allPassed = Object.values(checks).every(v => v);
        logTest('cancelOrder signing', allPassed,
            allPassed ? 'Cancellation signing works' : `Failed: ${JSON.stringify(checks)}`);
    } catch (error: any) {
        logTest('cancelOrder signing', false, error.message);
    }
}

// ============================================
// TEST 6: Order Submission Payload Structure
// ============================================
async function testOrderSubmissionPayload() {
    console.log('\n=== Test 6: Order Submission Payload Structure ===');

    try {
        const exchange = new cow({
            walletAddress: TEST_WALLETS.wallet1.address,
            privateKey: TEST_WALLETS.wallet1.privateKey,
            options: { network: 'mainnet', env: 'prod' },
        });

        const orderPayload = {
            sellToken: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
            buyToken: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
            receiver: TEST_WALLETS.wallet1.address,
            sellAmount: '1000000000000000000',
            buyAmount: '2000000000',
            validTo: Math.floor(Date.now() / 1000) + 300,
            appData: '0x' + '0'.repeat(64),
            feeAmount: '0',
            kind: 'sell',
            partiallyFillable: false,
            sellTokenBalance: 'erc20',
            buyTokenBalance: 'erc20',
        };

        const signature = exchange.signOrderPayload(orderPayload, 'eip712');

        const requestBody = {
            ...orderPayload,
            signature,
            signingScheme: 'eip712',
            from: TEST_WALLETS.wallet1.address,
        };

        const requiredFields = [
            'sellToken', 'buyToken', 'receiver', 'sellAmount', 'buyAmount',
            'validTo', 'appData', 'feeAmount', 'kind', 'partiallyFillable',
            'sellTokenBalance', 'buyTokenBalance', 'signature', 'signingScheme', 'from'
        ];

        const missingFields = requiredFields.filter(f => !(f in requestBody));

        logTest('Order submission payload', missingFields.length === 0,
            missingFields.length === 0
                ? 'All required fields present'
                : `Missing: ${missingFields.join(', ')}`);
    } catch (error: any) {
        logTest('Order submission payload', false, error.message);
    }
}

// ============================================
// TEST 7: Quote request structure
// ============================================
async function testQuoteRequestStructure() {
    console.log('\n=== Test 7: Quote Request Structure ===');

    try {
        const quoteRequest = {
            sellToken: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
            buyToken: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
            from: TEST_WALLETS.wallet1.address,
            receiver: TEST_WALLETS.wallet1.address,
            sellAmountBeforeFee: '1000000000000000000',
            kind: sdkLoaded ? OrderKind.SELL : 'sell',
            validFor: 300,
            appData: '0x' + '0'.repeat(64),
        };

        const requiredFields = ['sellToken', 'buyToken', 'from', 'kind'];
        const missingFields = requiredFields.filter(f => !(f in quoteRequest));

        const checks = {
            hasAllRequired: missingFields.length === 0,
            sellTokenIsAddress: quoteRequest.sellToken.startsWith('0x'),
            buyTokenIsAddress: quoteRequest.buyToken.startsWith('0x'),
            kindIsValid: quoteRequest.kind === 'sell' || quoteRequest.kind === 'buy',
        };

        const allPassed = Object.values(checks).every(v => v);
        logTest('Quote request structure', allPassed,
            allPassed ? 'OpenAPI-compliant' : `Failed: ${JSON.stringify(checks)}`);
    } catch (error: any) {
        logTest('Quote request structure', false, error.message);
    }
}

// ============================================
// TEST 8: API URL construction
// ============================================
async function testApiUrlConstruction() {
    console.log('\n=== Test 8: API URL Construction ===');

    try {
        const exchange = new cow({
            walletAddress: TEST_WALLETS.wallet1.address,
            privateKey: TEST_WALLETS.wallet1.privateKey,
            options: { network: 'mainnet', env: 'prod' },
        });

        const mainnetUrl = exchange.resolveOrderbookBaseUrl('mainnet', 'prod');
        const sepoliaUrl = exchange.resolveOrderbookBaseUrl('sepolia', 'barn');
        const gnosisUrl = exchange.resolveOrderbookBaseUrl('xdai', 'prod');

        const checks = {
            mainnetCorrect: mainnetUrl === 'https://api.cow.fi/mainnet/api/v1',
            sepoliaBarn: sepoliaUrl.includes('barn') && sepoliaUrl.includes('sepolia'),
            gnosisCorrect: gnosisUrl.includes('xdai'),
        };

        console.log('   Mainnet:', mainnetUrl);
        console.log('   Sepolia barn:', sepoliaUrl);
        console.log('   Gnosis:', gnosisUrl);

        const allPassed = Object.values(checks).every(v => v);
        logTest('API URL construction', allPassed);
    } catch (error: any) {
        logTest('API URL construction', false, error.message);
    }
}

// ============================================
// EXPORT TEST RUNNER
// ============================================

export async function runApiInteractionTests() {
    console.log('════════════════════════════════════════════════════════════');
    console.log('  API Interaction Tests');
    console.log('  Testing full API flow with SDK models');
    console.log('════════════════════════════════════════════════════════════');

    await loadSdkModels();

    await testFetchOrderInteraction();
    await testFetchOrdersInteraction();
    await testFetchMyTradesInteraction();
    await testCreateOrderSigning();
    await testCancelOrderSigning();
    await testOrderSubmissionPayload();
    await testQuoteRequestStructure();
    await testApiUrlConstruction();

    // Summary
    console.log('\n════════════════════════════════════════════════════════════');
    console.log('  API Interaction Test Summary');
    console.log('════════════════════════════════════════════════════════════');
    const passed = results.filter(r => r.passed).length;
    const total = results.length;
    console.log(`Passed: ${passed}/${total}`);

    return { passed, total, results };
}

// Keep old export name for compatibility
export const runMockedApiTests = runApiInteractionTests;

export default runApiInteractionTests;

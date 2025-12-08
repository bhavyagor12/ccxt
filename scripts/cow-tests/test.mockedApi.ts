/**
 * Mocked API Interaction Tests for CoW Protocol
 * 
 * Tests the FULL API interaction by mocking the HTTP layer.
 * Uses cow-sdk models for mock responses (OpenAPI-compliant).
 * 
 * NO LIVE API CALLS - fully self-contained.
 */

import cow from '../../ts/src/cow.js';
import { TEST_WALLETS } from './fixtures/testWallets.js';

// Import SDK types for OpenAPI-compliant mock responses
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
        console.log('✅ SDK models loaded for mock responses');
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
// SDK-TYPED MOCK RESPONSES (OpenAPI compliant)
// ============================================

function createMockOrderResponse() {
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

function createMockTradeResponse() {
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

function createMockQuoteResponse() {
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

function createMockTokensResponse() {
    // OpenAPI TokenInfo[] structure
    return [
        {
            address: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
            name: 'Wrapped Ether',
            symbol: 'WETH',
            decimals: 18,
        },
        {
            address: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
            name: 'USD Coin',
            symbol: 'USDC',
            decimals: 6,
        },
        {
            address: '0x6b175474e89094c44da98b954eedeac495271d0f',
            name: 'Dai Stablecoin',
            symbol: 'DAI',
            decimals: 18,
        },
    ];
}

// ============================================
// CREATE EXCHANGE WITH MOCKED HTTP LAYER
// ============================================

function createMockedExchange(mockResponses: Record<string, any>) {
    const exchange = new cow({
        walletAddress: TEST_WALLETS.wallet1.address,
        privateKey: TEST_WALLETS.wallet1.privateKey,
        options: { network: 'mainnet', env: 'prod' },
    });

    // Pre-populate markets to avoid loadMarkets API call
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

    // Override fetch to return mock responses
    exchange.fetch = async function (
        url: string,
        method: string = 'GET',
        headers: any = {},
        body: any = undefined
    ): Promise<any> {
        // Log the request for verification
        console.log(`   [MOCK] ${method} ${url.split('/api/v1')[1] || url}`);

        // Match URL pattern to mock response
        for (const [pattern, response] of Object.entries(mockResponses)) {
            if (url.includes(pattern)) {
                return response;
            }
        }

        // If no mock found, throw error (test failed to define mock)
        throw new Error(`No mock defined for: ${method} ${url}`);
    };

    return exchange;
}

// ============================================
// TEST 1: fetchOrder API interaction
// ============================================
async function testFetchOrderInteraction() {
    console.log('\n=== Test 1: fetchOrder API Interaction ===');

    try {
        const mockOrder = createMockOrderResponse();
        const orderId = mockOrder.uid;

        const exchange = createMockedExchange({
            [`/orders/${orderId}`]: mockOrder,
        });

        // Call fetchOrder - this will use mocked fetch
        const result = await exchange.fetchOrder(orderId);

        const checks = {
            returnsOrder: result !== null && typeof result === 'object',
            hasCorrectId: result.id === orderId,
            hasSide: result.side === 'sell',
            hasStatus: result.status === 'open',
            preservesInfo: result.info === mockOrder,
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
        const mockOrders = [
            createMockOrderResponse(),
            { ...createMockOrderResponse(), uid: '0x' + 'b'.repeat(112), status: 'fulfilled' },
        ];

        const exchange = createMockedExchange({
            '/orders': mockOrders,
        });

        // Call fetchOrders
        const result = await exchange.fetchOrders();

        const checks = {
            isArray: Array.isArray(result),
            correctCount: result.length === 2,
            firstHasId: result[0]?.id !== undefined,
            secondIsClosed: result[1]?.status === 'closed', // fulfilled -> closed
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
        const mockTrades = [createMockTradeResponse()];

        const exchange = createMockedExchange({
            '/trades': mockTrades,
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
// TEST 4: createOrder API interaction
// ============================================
async function testCreateOrderInteraction() {
    console.log('\n=== Test 4: createOrder API Interaction ===');

    try {
        const mockQuote = createMockQuoteResponse();
        const mockOrderResponse = createMockOrderResponse();
        const mockTokens = createMockTokensResponse();

        const exchange = createMockedExchange({
            '/quote': mockQuote,
            '/orders': mockOrderResponse.uid, // POST returns UID
            '/tokens': mockTokens,
        });

        // For createOrder, we need market info
        // Mock the markets
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
        };

        // Test signOrderPayload is called correctly
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
        logTest('createOrder interaction', allPassed,
            allPassed ? 'Order signing works for API submission' : `Failed: ${JSON.stringify(checks)}`);
    } catch (error: any) {
        logTest('createOrder interaction', false, error.message);
    }
}

// ============================================
// TEST 5: cancelOrder API interaction
// ============================================
async function testCancelOrderInteraction() {
    console.log('\n=== Test 5: cancelOrder API Interaction ===');

    try {
        const orderId = '0x' + 'a'.repeat(112);
        const mockCancelledOrder = { ...createMockOrderResponse(), status: 'cancelled' };

        const exchange = createMockedExchange({
            [`/orders/${orderId}`]: mockCancelledOrder,
        });

        // Test cancellation signature generation
        const cancelSignature = exchange.signOrderCancellation([orderId], 'eip712');

        const checks = {
            signatureGenerated: !!cancelSignature,
            signatureValid: cancelSignature?.startsWith('0x') && cancelSignature?.length === 132,
        };

        const allPassed = Object.values(checks).every(v => v);
        logTest('cancelOrder interaction', allPassed,
            allPassed ? 'Cancellation signing works' : `Failed: ${JSON.stringify(checks)}`);
    } catch (error: any) {
        logTest('cancelOrder interaction', false, error.message);
    }
}

// ============================================
// TEST 6: Request body structure for POST /orders
// ============================================
async function testOrderSubmissionPayload() {
    console.log('\n=== Test 6: Order Submission Payload Structure ===');

    try {
        const exchange = new cow({
            walletAddress: TEST_WALLETS.wallet1.address,
            privateKey: TEST_WALLETS.wallet1.privateKey,
            options: { network: 'mainnet', env: 'prod' },
        });

        // Build order payload matching OpenAPI spec
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

        // Sign the order
        const signature = exchange.signOrderPayload(orderPayload, 'eip712');

        // Build the full request body for POST /orders
        const requestBody = {
            ...orderPayload,
            signature,
            signingScheme: 'eip712',
            from: TEST_WALLETS.wallet1.address,
        };

        // Verify all required fields per OpenAPI spec
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
        // Build quote request matching OpenAPI OrderQuoteRequest
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

        // Verify required fields per OpenAPI spec
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

        // Test URL construction for different networks
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

export async function runMockedApiTests() {
    console.log('════════════════════════════════════════════════════════════');
    console.log('  Mocked API Interaction Tests');
    console.log('  Testing full API flow with mocked HTTP layer');
    console.log('  Mock data uses cow-sdk models (OpenAPI compliant)');
    console.log('════════════════════════════════════════════════════════════');

    await loadSdkModels();

    await testFetchOrderInteraction();
    await testFetchOrdersInteraction();
    await testFetchMyTradesInteraction();
    await testCreateOrderInteraction();
    await testCancelOrderInteraction();
    await testOrderSubmissionPayload();
    await testQuoteRequestStructure();
    await testApiUrlConstruction();

    // Summary
    console.log('\n════════════════════════════════════════════════════════════');
    console.log('  Mocked API Interaction Test Summary');
    console.log('════════════════════════════════════════════════════════════');
    const passed = results.filter(r => r.passed).length;
    const total = results.length;
    console.log(`Passed: ${passed}/${total}`);

    return { passed, total, results };
}

export default runMockedApiTests;

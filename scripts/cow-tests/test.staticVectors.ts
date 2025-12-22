/**
 * Static Verification Tests for CoW Protocol
 * 
 * Tests verify cow.ts against pre-computed test vectors.
 */

import cow from '../../ts/src/cow.js';
import assert from 'assert';
import {
    TEST_PRIVATE_KEY,
    TEST_WALLET_ADDRESS,
    EIP712_DOMAIN,
    ORDER_TYPE,
    VECTOR_BASIC_SELL_ORDER,
    VECTOR_ORDER_CANCELLATION,
    AMOUNT_CONVERSION_VECTORS,
    ORDER_RESPONSE_VECTOR,
    ALL_SIGNING_VECTORS,
} from './fixtures/testVectors.js';

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

function initCowExchange(network: string = 'mainnet') {
    return new cow({
        walletAddress: TEST_WALLET_ADDRESS,
        privateKey: TEST_PRIVATE_KEY,
        options: {
            network,
            env: network === 'mainnet' ? 'prod' : 'barn',
        },
    });
}

// ============================================
// STATIC TEST 1: Order Signature vs Pre-computed Vector
// ============================================
async function testOrderSignatureAgainstVector() {
    console.log('\n=== Static Test 1: Order Signature vs Pre-computed Vector ===');

    try {
        const exchange = initCowExchange();

        // Sign using cow.ts
        const actualSignature = exchange.signOrderPayload(
            VECTOR_BASIC_SELL_ORDER.order,
            'eip712'
        );

        const expectedSignature = VECTOR_BASIC_SELL_ORDER.expectedSignature;

        console.log('   Expected:', expectedSignature.slice(0, 50) + '...');
        console.log('   Actual:  ', actualSignature.slice(0, 50) + '...');

        const match = actualSignature.toLowerCase() === expectedSignature.toLowerCase();

        logTest('Order signature matches pre-computed vector', match,
            match ? 'Exact match!' : 'MISMATCH - cow.ts produces different signature');

    } catch (error: any) {
        logTest('Order signature matches pre-computed vector', false, error.message);
    }
}

// ============================================
// STATIC TEST 2: Cancellation Signature vs Pre-computed Vector
// ============================================
async function testCancellationSignatureAgainstVector() {
    console.log('\n=== Static Test 2: Cancellation Signature vs Pre-computed Vector ===');

    try {
        const exchange = initCowExchange();

        const actualSignature = exchange.signOrderCancellation(
            [VECTOR_ORDER_CANCELLATION.orderUid],
            'eip712'
        );

        const expectedSignature = VECTOR_ORDER_CANCELLATION.expectedSignature;

        console.log('   Expected:', expectedSignature.slice(0, 50) + '...');
        console.log('   Actual:  ', actualSignature.slice(0, 50) + '...');

        const match = actualSignature.toLowerCase() === expectedSignature.toLowerCase();

        logTest('Cancellation signature matches pre-computed vector', match,
            match ? 'Exact match!' : 'MISMATCH');

    } catch (error: any) {
        logTest('Cancellation signature matches pre-computed vector', false, error.message);
    }
}

// ============================================
// STATIC TEST 3: Domain Separator Configuration
// ============================================
async function testDomainConfiguration() {
    console.log('\n=== Static Test 3: Domain Separator Configuration ===');

    try {
        const exchange = initCowExchange();

        const actualChainId = exchange.getChainIdOption();
        const actualContract = exchange.getVerifyingContractOption().toLowerCase();

        const expectedChainId = EIP712_DOMAIN.chainId;
        const expectedContract = EIP712_DOMAIN.verifyingContract.toLowerCase();

        const chainMatch = actualChainId === expectedChainId;
        const contractMatch = actualContract === expectedContract;

        console.log('   Chain ID - Expected:', expectedChainId, 'Actual:', actualChainId);
        console.log('   Contract - Expected:', expectedContract);
        console.log('              Actual:  ', actualContract);

        logTest('Domain separator matches CoW spec', chainMatch && contractMatch,
            chainMatch && contractMatch ? 'Exact match' : 'MISMATCH');

    } catch (error: any) {
        logTest('Domain separator matches CoW spec', false, error.message);
    }
}

// ============================================
// STATIC TEST 4: EIP-712 Type Structure
// ============================================
async function testTypeStructure() {
    console.log('\n=== Static Test 4: EIP-712 Type Structure ===');

    try {
        // Verify ORDER_TYPE matches CoW Protocol EIP-712 spec
        const expectedFields = [
            'sellToken:address',
            'buyToken:address',
            'receiver:address',
            'sellAmount:uint256',
            'buyAmount:uint256',
            'validTo:uint32',
            'appData:bytes32',
            'feeAmount:uint256',
            'kind:string',
            'partiallyFillable:bool',
            'sellTokenBalance:string',
            'buyTokenBalance:string',
        ];

        const actualFields = ORDER_TYPE.map(f => `${f.name}:${f.type}`);

        const match = JSON.stringify(expectedFields) === JSON.stringify(actualFields);

        logTest('EIP-712 type structure matches CoW spec', match,
            match ? 'All 12 fields correct' : 'Field mismatch');

    } catch (error: any) {
        logTest('EIP-712 type structure matches CoW spec', false, error.message);
    }
}

// ============================================
// STATIC TEST 5: Amount Conversion Vectors
// ============================================
async function testAmountConversionVectors() {
    console.log('\n=== Static Test 5: Amount Conversion Vectors ===');

    try {
        const exchange = initCowExchange();
        let allPass = true;
        let failedCount = 0;

        for (const vector of AMOUNT_CONVERSION_VECTORS) {
            const actual = exchange.amountToTokenAmount(
                vector.humanAmount.toString(),
                vector.decimals.toString()
            );

            if (actual !== vector.rawAmount) {
                console.log(`   FAIL: ${vector.humanAmount} (${vector.decimals} decimals)`);
                console.log(`   Expected: ${vector.rawAmount}, Got: ${actual}`);
                allPass = false;
                failedCount++;
            }
        }

        logTest('Amount conversion vectors', allPass,
            allPass ? `All ${AMOUNT_CONVERSION_VECTORS.length} vectors pass` : `${failedCount} failed`);

    } catch (error: any) {
        logTest('Amount conversion vectors', false, error.message);
    }
}

// ============================================
// STATIC TEST 6: Order Parsing Vector
// ============================================
async function testOrderParsingVector() {
    console.log('\n=== Static Test 6: Order Parsing Vector ===');

    try {
        const exchange = initCowExchange();

        const parsed = exchange.parseOrder(ORDER_RESPONSE_VECTOR.apiResponse);
        const expected = ORDER_RESPONSE_VECTOR.expectedParsedOrder;

        const idMatch = parsed.id === expected.id;
        const sideMatch = parsed.side === expected.side;
        const statusMatch = parsed.status === expected.status;

        const allMatch = idMatch && sideMatch && statusMatch;

        logTest('Order parsing vector', allMatch,
            allMatch ? 'Parsed correctly' : 'Parsing mismatch');

    } catch (error: any) {
        logTest('Order parsing vector', false, error.message);
    }
}

// ============================================
// STATIC TEST 7: Wallet Derivation
// ============================================
async function testWalletDerivation() {
    console.log('\n=== Static Test 7: Wallet Address Configuration ===');

    try {
        const exchange = initCowExchange();

        const configured = exchange.walletAddress;
        const expected = TEST_WALLET_ADDRESS.toLowerCase();

        const match = configured?.toLowerCase() === expected;

        console.log('   Expected:', expected);
        console.log('   Configured: ', configured?.toLowerCase());

        logTest('Wallet address configuration', match,
            match ? 'Correct address configured' : 'MISMATCH');

    } catch (error: any) {
        logTest('Wallet address configuration', false, error.message);
    }
}

// ============================================
// STATIC TEST 8: Deterministic Signatures
// ============================================
async function testDeterministicSignatures() {
    console.log('\n=== Static Test 8: Deterministic Signatures ===');

    try {
        const exchange = initCowExchange();

        // Sign the same order twice
        const sig1 = exchange.signOrderPayload(VECTOR_BASIC_SELL_ORDER.order, 'eip712');
        const sig2 = exchange.signOrderPayload(VECTOR_BASIC_SELL_ORDER.order, 'eip712');

        const match = sig1 === sig2;

        logTest('Deterministic signatures', match,
            match ? 'Same input = same output' : 'Non-deterministic signing!');

    } catch (error: any) {
        logTest('Deterministic signatures', false, error.message);
    }
}

// ============================================
// STATIC TEST 9: Different Orders Different Signatures
// ============================================
async function testDifferentOrdersDifferentSignatures() {
    console.log('\n=== Static Test 9: Different Orders Different Signatures ===');

    try {
        const exchange = initCowExchange();

        const sellSig = exchange.signOrderPayload(ALL_SIGNING_VECTORS[0].order, 'eip712');
        const buySig = exchange.signOrderPayload(ALL_SIGNING_VECTORS[1].order, 'eip712');

        const different = sellSig !== buySig;

        logTest('Different orders produce different signatures', different);

    } catch (error: any) {
        logTest('Different orders produce different signatures', false, error.message);
    }
}

// Export test runner
export async function runStaticVectorTests() {
    console.log('════════════════════════════════════════════════════════════');
    console.log('  Static Verification Tests');
    console.log('  Using PRE-COMPUTED test vectors (no SDK calls)');
    console.log('════════════════════════════════════════════════════════════');

    await testOrderSignatureAgainstVector();
    await testCancellationSignatureAgainstVector();
    await testDomainConfiguration();
    await testTypeStructure();
    await testAmountConversionVectors();
    await testOrderParsingVector();
    await testWalletDerivation();
    await testDeterministicSignatures();
    await testDifferentOrdersDifferentSignatures();

    // Summary
    console.log('\n════════════════════════════════════════════════════════════');
    console.log('  Static Vector Test Summary');
    console.log('════════════════════════════════════════════════════════════');
    const passed = results.filter(r => r.passed).length;
    const total = results.length;
    console.log(`Passed: ${passed}/${total}`);

    return { passed, total, results };
}

export default runStaticVectorTests;

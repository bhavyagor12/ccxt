/**
 * Main Test Runner for CoW Protocol Tests
 * Runs all test categories based on CLI arguments
 */

import { runOrderSigningTests } from './test.orderSigning.js';
import { runOrderStructureTests } from './test.orderStructure.js';
import { runNegativeTests } from './test.negativeTests.js';
import { runSdkComparisonTests } from './test.sdkComparison.js';
import { runStaticVectorTests } from './test.staticVectors.js';
import { runApiComparisonTests } from './test.apiComparison.js';
import { runSdkVerificationTests } from './test.sdkVerification.js';
import { runSdkFullTests } from './test.sdkFull.js';
import { runMockedApiTests } from './test.mockedApi.js';

// Parse CLI arguments
const args = process.argv.slice(2);
const runSigning = args.includes('--signing') || args.length === 0;
const runStructure = args.includes('--structure') || args.length === 0;
const runNegative = args.includes('--negative') || args.length === 0;
const runSdkComparison = args.includes('--sdk') || args.length === 0;
const runStatic = args.includes('--static') || args.length === 0;
const runApi = args.includes('--api') || args.length === 0;
const runVerify = args.includes('--verify') || args.length === 0;
const runFull = args.includes('--full') || args.length === 0;
const runMocked = args.includes('--mock') || args.length === 0;

interface CategoryResult {
    category: string;
    passed: number;
    total: number;
}

async function main() {
    console.log('╔════════════════════════════════════════╗');
    console.log('║    CoW Protocol CCXT Test Suite        ║');
    console.log('╚════════════════════════════════════════╝');
    console.log('');
    console.log('Usage: tsx run-tests.ts [options]');
    console.log('  --signing    Run order signing tests only');
    console.log('  --structure  Run order structure tests only');
    console.log('  --negative   Run negative tests only');
    console.log('  --sdk        Run SDK comparison tests only');
    console.log('  --verify     Run SDK verification (constants) only');
    console.log('  --full       Run comprehensive SDK full coverage');
    console.log('  --mock       Run mocked API tests');
    console.log('  (no args)    Run all tests');
    console.log('');

    const categoryResults: CategoryResult[] = [];

    try {
        if (runSigning) {
            const result = await runOrderSigningTests();
            categoryResults.push({
                category: 'Order Signing',
                passed: result.passed,
                total: result.total,
            });
        }

        if (runStructure) {
            const result = await runOrderStructureTests();
            categoryResults.push({
                category: 'Order Structure',
                passed: result.passed,
                total: result.total,
            });
        }

        if (runNegative) {
            const result = await runNegativeTests();
            categoryResults.push({
                category: 'Negative Tests',
                passed: result.passed,
                total: result.total,
            });
        }

        if (runSdkComparison) {
            const result = await runSdkComparisonTests();
            categoryResults.push({
                category: 'SDK Comparison',
                passed: result.passed,
                total: result.total,
            });
        }

        if (runStatic) {
            const result = await runStaticVectorTests();
            categoryResults.push({
                category: 'Static Vectors',
                passed: result.passed,
                total: result.total,
            });
        }

        if (runApi) {
            const result = await runApiComparisonTests();
            categoryResults.push({
                category: 'API Comparison',
                passed: result.passed,
                total: result.total,
            });
        }

        if (runVerify) {
            const result = await runSdkVerificationTests();
            categoryResults.push({
                category: 'SDK Verification',
                passed: result.passed,
                total: result.total,
            });
        }

        if (runFull) {
            const result = await runSdkFullTests();
            categoryResults.push({
                category: 'SDK Full Coverage',
                passed: result.passed,
                total: result.total,
            });
        }

        if (runMocked) {
            const result = await runMockedApiTests();
            categoryResults.push({
                category: 'Mocked API',
                passed: result.passed,
                total: result.total,
            });
        }
    } catch (error: any) {
        console.error('\n❌ Test suite encountered an error:');
        console.error(error.message);
        if (error.stack) {
            console.error(error.stack);
        }
        process.exit(1);
    }

    // Final Summary
    console.log('\n');
    console.log('╔════════════════════════════════════════╗');
    console.log('║         FINAL TEST SUMMARY             ║');
    console.log('╚════════════════════════════════════════╝');

    let totalPassed = 0;
    let totalTests = 0;

    for (const result of categoryResults) {
        const icon = result.passed === result.total ? '✅' : '❌';
        console.log(`${icon} ${result.category}: ${result.passed}/${result.total}`);
        totalPassed += result.passed;
        totalTests += result.total;
    }

    console.log('────────────────────────────────────────');
    const allPassed = totalPassed === totalTests;
    const finalIcon = allPassed ? '✅' : '❌';
    console.log(`${finalIcon} TOTAL: ${totalPassed}/${totalTests}`);

    if (allPassed) {
        console.log('\n🎉 All tests passed!');
    } else {
        console.log('\n⚠️  Some tests failed. Review output above.');
        process.exit(1);
    }
}

main().catch((error) => {
    console.error('Fatal error:', error);
    process.exit(1);
});

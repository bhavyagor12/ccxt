/**
 * Test uint256 encoding
 */
import cow from '../ts/src/cow.js';

const exchange = new cow({
    walletAddress: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
    privateKey: '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80',
});

// Test encoding different values
const testValues = [
    { name: 'sellAmount', type: 'uint256', value: '1000000000000000000' }, // 1 ETH in wei
    { name: 'buyAmount', type: 'uint256', value: '2000000000' }, // 2000 USDC
    { name: 'validTo', type: 'uint32', value: 1735689600 },
    { name: 'feeAmount', type: 'uint256', value: '0' },
];

console.log('=== Testing encodeEIP712Type ===\n');

for (const test of testValues) {
    const encoded = exchange.encodeEIP712Type(test.name, test.type, test.value);
    console.log(`${test.name} (${test.type}): ${test.value}`);
    console.log(`  Encoded: ${encoded}`);
    console.log(`  Length: ${encoded.length} (should be 64)`);
    
    // Convert to BigInt to verify
    if (test.type.startsWith('uint')) {
        try {
            const decoded = BigInt('0x' + encoded);
            console.log(`  Decoded: ${decoded.toString()}`);
            console.log(`  Match: ${decoded.toString() === test.value.toString()}`);
        } catch (e) {
            console.log(`  Error decoding: ${e.message}`);
        }
    }
    console.log();
}


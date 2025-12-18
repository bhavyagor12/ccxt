/**
 * Debug manual encoding vs TypedDataEncoder
 */
import cow from '../ts/src/cow.js';
import { TEST_WALLETS } from './cow-tests/fixtures/testWallets.ts';
import { SAMPLE_ORDERS } from './cow-tests/fixtures/sampleOrders.ts';

const testOrder = SAMPLE_ORDERS.basicSellOrder;

console.log('=== Manual Encoding Debug ===\n');

// Initialize exchange
const exchange = new cow({
    walletAddress: TEST_WALLETS.wallet1.address,
    privateKey: TEST_WALLETS.wallet1.privateKey,
    options: {
        network: 'mainnet',
        env: 'prod',
    },
});

// Sign with our current implementation
console.log('Signing with current signOrderPayload implementation...');
const ourSignature = exchange.signOrderPayload(testOrder, 'eip712');
console.log('Our Signature:', ourSignature);
console.log();

// Now let's manually trace what signOrderPayload is doing
// We'll add some intermediate logging
console.log('Expected SDK signature: 0x69d7c7c4d75fb127c9...');
console.log('Our signature:          ' + ourSignature.slice(0, 26) + '...');
console.log('Match:', ourSignature.startsWith('0x69d7c7c4d75fb127c9'));


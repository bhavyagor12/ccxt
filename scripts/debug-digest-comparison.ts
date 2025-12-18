/**
 * Debug digest comparison between manual encoding and TypedDataEncoder
 */
import cow from '../ts/src/cow.js';
import { TEST_WALLETS } from './cow-tests/fixtures/testWallets.ts';
import { SAMPLE_ORDERS } from './cow-tests/fixtures/sampleOrders.ts';
import { TypedDataEncoder } from '../ts/src/static_dependencies/ethers/hash/typed-data.js';
import { getAddress } from '../ts/src/static_dependencies/ethers/address/index.js';

const testOrder = SAMPLE_ORDERS.basicSellOrder;

console.log('=== Digest Comparison Debug ===\n');
console.log('Test Order:', JSON.stringify(testOrder, null, 2));
console.log();

// Initialize exchange
const exchange = new cow({
    walletAddress: TEST_WALLETS.wallet1.address,
    privateKey: TEST_WALLETS.wallet1.privateKey,
    options: {
        network: 'mainnet',
        env: 'prod',
    },
});

// Prepare domain and message like signOrderPayload does
const chainId = 1;
const verifyingContract = '0x9008D19f58AAbD9eD0D60971565AA8510560ab41';

const domain = {
    name: 'Gnosis Protocol',
    version: 'v2',
    chainId: chainId,
    verifyingContract: verifyingContract,
};

// Prepare message with checksummed addresses (what our code does)
const messageWithChecksum = {
    sellToken: exchange.checksumAddress(exchange.hexWith0xPrefix(testOrder.sellToken)),
    buyToken: exchange.checksumAddress(exchange.hexWith0xPrefix(testOrder.buyToken)),
    receiver: exchange.checksumAddress(exchange.hexWith0xPrefix(testOrder.receiver)),
    sellAmount: testOrder.sellAmount,
    buyAmount: testOrder.buyAmount,
    validTo: testOrder.validTo,
    appData: exchange.hexWith0xPrefix(testOrder.appData),
    feeAmount: testOrder.feeAmount,
    kind: testOrder.kind,
    partiallyFillable: testOrder.partiallyFillable,
    sellTokenBalance: testOrder.sellTokenBalance,
    buyTokenBalance: testOrder.buyTokenBalance,
};

// Prepare message with getAddress (what the SDK does)
const messageWithGetAddress = {
    sellToken: getAddress(exchange.hexWith0xPrefix(testOrder.sellToken)),
    buyToken: getAddress(exchange.hexWith0xPrefix(testOrder.buyToken)),
    receiver: getAddress(exchange.hexWith0xPrefix(testOrder.receiver)),
    sellAmount: testOrder.sellAmount,
    buyAmount: testOrder.buyAmount,
    validTo: testOrder.validTo,
    appData: exchange.hexWith0xPrefix(testOrder.appData),
    feeAmount: testOrder.feeAmount,
    kind: testOrder.kind,
    partiallyFillable: testOrder.partiallyFillable,
    sellTokenBalance: testOrder.sellTokenBalance,
    buyTokenBalance: testOrder.buyTokenBalance,
};

console.log('Message with checksumAddress:', JSON.stringify(messageWithChecksum, null, 2));
console.log();
console.log('Message with getAddress:', JSON.stringify(messageWithGetAddress, null, 2));
console.log();

// Check if addresses match
console.log('sellToken match:', messageWithChecksum.sellToken === messageWithGetAddress.sellToken);
console.log('buyToken match:', messageWithChecksum.buyToken === messageWithGetAddress.buyToken);
console.log('receiver match:', messageWithChecksum.receiver === messageWithGetAddress.receiver);
console.log();

// Now use TypedDataEncoder to compute digests for both
const types = {
    Order: [
        { name: 'sellToken', type: 'address' },
        { name: 'buyToken', type: 'address' },
        { name: 'receiver', type: 'address' },
        { name: 'sellAmount', type: 'uint256' },
        { name: 'buyAmount', type: 'uint256' },
        { name: 'validTo', type: 'uint32' },
        { name: 'appData', type: 'bytes32' },
        { name: 'feeAmount', type: 'uint256' },
        { name: 'kind', type: 'string' },
        { name: 'partiallyFillable', type: 'bool' },
        { name: 'sellTokenBalance', type: 'string' },
        { name: 'buyTokenBalance', type: 'string' },
    ],
};

const encoder = new TypedDataEncoder(types);
const domainSeparator = TypedDataEncoder.hashDomain(domain);
const structHashWithChecksum = encoder.hash(messageWithChecksum);
const structHashWithGetAddress = encoder.hash(messageWithGetAddress);

console.log('Domain Separator:', domainSeparator);
console.log('Struct Hash (checksumAddress):', structHashWithChecksum);
console.log('Struct Hash (getAddress):', structHashWithGetAddress);
console.log('Struct hashes match:', structHashWithChecksum === structHashWithGetAddress);
console.log();

// Compute final digest
const prefix = '0x1901';
const encoded1 = prefix + domainSeparator.slice(2) + structHashWithChecksum.slice(2);
const encoded2 = prefix + domainSeparator.slice(2) + structHashWithGetAddress.slice(2);

console.log('Encoded (checksumAddress):', encoded1);
console.log('Encoded (getAddress):', encoded2);
console.log('Encoded match:', encoded1 === encoded2);


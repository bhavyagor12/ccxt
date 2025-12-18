/**
 * Verify signature recovery with the exact order data from the failed attempt
 */
import { readFileSync } from 'fs';
import { keccak_256 as keccak } from '../ts/src/static_dependencies/noble-hashes/sha3.js';
import { secp256k1 } from '../ts/src/static_dependencies/noble-curves/secp256k1.js';
import { base16 } from '../ts/src/static_dependencies/scure-base/index.js';
import { ecdsa } from '../ts/src/base/functions/crypto.js';
import ccxt from '../ts/ccxt.ts';

// Load environment variables
const envPath = './scripts/.env';
const envContent = readFileSync(envPath, 'utf-8');
for (const line of envContent.split('\n')) {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#')) {
        const [key, ...valueParts] = trimmed.split('=');
        if (key && valueParts.length > 0) {
            process.env[key.trim()] = valueParts.join('=').trim();
        }
    }
}

const privateKey = process.env.PRIVATE_KEY || '';
const walletAddress = process.env.WALLET_ADDRESS || '';

console.log('=== Signature Recovery Verification ===\n');
console.log('Expected wallet:', walletAddress);
console.log();

// Exact order data from the failed attempt
const testOrder = {
    sellToken: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
    buyToken: '0x50c5725949A6F0c72E6C4a641F24049A917DB0Cb',
    receiver: '0x9Ec5535fD4e55A8D29a8daaa8797D026E23D4598',
    sellAmount: '997055',
    buyAmount: '998321495626013066',
    validTo: 1766046772,
    appData: '0x0000000000000000000000000000000000000000000000000000000000000000',
    feeAmount: '0',
    kind: 'sell',
    partiallyFillable: false,
    sellTokenBalance: 'erc20',
    buyTokenBalance: 'erc20',
};

console.log('Test Order:', JSON.stringify(testOrder, null, 2));
console.log();

// Initialize exchange
const exchange = new ccxt.cow({
    privateKey,
    walletAddress,
    options: {
        network: 'base',
        environment: 'barn',
    },
});

// Sign it
const signature = exchange.signOrderPayload(testOrder, 'eip712');
console.log('Generated signature:', signature);
console.log();

// Now manually recover the signer
try {
    // Parse signature
    const remove0xPrefix = (str: string) => str.startsWith('0x') ? str.slice(2) : str;
    const sigHex = remove0xPrefix(signature);
    const r = sigHex.slice(0, 64);
    const s = sigHex.slice(64, 128);
    const v = parseInt(sigHex.slice(128, 130), 16);
    
    console.log('Signature components:');
    console.log('  r:', r);
    console.log('  s:', s);
    console.log('  v:', v);
    console.log('  recovery bit (v-27):', v - 27);
    console.log();
    
    // We need to compute the digest that was signed
    // Let's use the exchange's internal methods to compute it
    const chainId = 8453; // Base
    const verifyingContract = '0x9008D19f58AAbD9eD0D60971565AA8510560ab41';
    
    const domain = {
        name: 'Gnosis Protocol',
        version: 'v2',
        chainId,
        verifyingContract,
    };
    
    const message = {
        sellToken: testOrder.sellToken,
        buyToken: testOrder.buyToken,
        receiver: testOrder.receiver,
        sellAmount: testOrder.sellAmount,
        buyAmount: testOrder.buyAmount,
        validTo: testOrder.validTo,
        appData: testOrder.appData,
        feeAmount: testOrder.feeAmount,
        kind: testOrder.kind,
        partiallyFillable: testOrder.partiallyFillable,
        sellTokenBalance: testOrder.sellTokenBalance,
        buyTokenBalance: testOrder.buyTokenBalance,
    };
    
    // Use TypedDataEncoder to compute the digest
    const { TypedDataEncoder } = await import('../ts/src/static_dependencies/ethers/hash/typed-data.js');
    const { getAddress } = await import('../ts/src/static_dependencies/ethers/address/index.js');
    
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
    
    const messageWithChecksummed = {
        ...message,
        sellToken: getAddress(message.sellToken),
        buyToken: getAddress(message.buyToken),
        receiver: getAddress(message.receiver),
    };
    
    const typedDataEncoder = new TypedDataEncoder(types);
    const domainSeparator = TypedDataEncoder.hashDomain(domain);
    const structHash = typedDataEncoder.hash(messageWithChecksummed);
    const encoded = '0x1901' + domainSeparator.slice(2) + structHash.slice(2);
    const digest = '0x' + base16.encode(keccak(base16.decode(encoded.slice(2))));
    
    console.log('Computed digest:', digest);
    console.log();
    
    // Recover the public key and address
    const recoveryBit = v - 27;
    const sig = secp256k1.Signature.fromCompact(r + s).addRecoveryBit(recoveryBit);
    const digestBytes = base16.decode(remove0xPrefix(digest));
    const publicKey = sig.recoverPublicKey(digestBytes).toRawBytes(false);
    const publicKeyWithoutPrefix = publicKey.slice(1);
    const addressHash = keccak(publicKeyWithoutPrefix);
    const recoveredAddress = '0x' + base16.encode(addressHash).slice(-40);
    
    console.log('Recovered address:', recoveredAddress);
    console.log('Expected address:', walletAddress.toLowerCase());
    console.log('Match:', recoveredAddress === walletAddress.toLowerCase() ? '✅' : '❌');
    
    if (recoveredAddress !== walletAddress.toLowerCase()) {
        console.log('\n❌ SIGNATURE RECOVERY FAILED!');
        console.log('Our signature does not recover to the correct address.');
        console.log('This confirms there is a bug in our signing logic.');
    } else {
        console.log('\n✅ SIGNATURE RECOVERY SUCCESS!');
        console.log('Our signature correctly recovers to the wallet address.');
        console.log('The issue must be with how the CoW API is verifying the signature.');
    }
    
} catch (error) {
    console.error('❌ Error:', error.message);
    console.error(error.stack);
}


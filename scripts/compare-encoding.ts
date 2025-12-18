/**
 * Compare our manual encoding with TypedDataEncoder
 */
import { readFileSync } from 'fs';
import { TypedDataEncoder } from '../ts/src/static_dependencies/ethers/hash/typed-data.js';
import { getAddress } from '../ts/src/static_dependencies/ethers/address/index.js';
import { keccak_256 as keccak } from '../ts/src/static_dependencies/noble-hashes/sha3.js';
import { base16 } from '../ts/src/static_dependencies/scure-base/index.js';

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

const walletAddress = process.env.WALLET_ADDRESS;

console.log('=== Comparing Manual Encoding vs TypedDataEncoder ===\n');

// Test order data
const domain = {
    name: 'Gnosis Protocol',
    version: 'v2',
    chainId: 8453,
    verifyingContract: '0x9008D19f58AAbD9eD0D60971565AA8510560ab41',
};

const message = {
    sellToken: getAddress('0x50c5725949A6F0c72E6C4a641F24049A917DB0Cb'),
    buyToken: getAddress('0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913'),
    receiver: getAddress(walletAddress!),
    sellAmount: '1000000',
    buyAmount: '999000',
    validTo: 1766050000,
    appData: '0x0000000000000000000000000000000000000000000000000000000000000000',
    feeAmount: '0',
    kind: 'sell',
    partiallyFillable: false,
    sellTokenBalance: 'erc20',
    buyTokenBalance: 'erc20',
};

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

console.log('Domain:', JSON.stringify(domain, null, 2));
console.log('\nMessage:', JSON.stringify(message, null, 2));
console.log();

// TypedDataEncoder method
console.log('=== TypedDataEncoder Method ===');
const typedDataEncoder = new TypedDataEncoder(types);
const domainSeparator = TypedDataEncoder.hashDomain(domain);
const structHash = typedDataEncoder.hash(message);
console.log('domainSeparator:', domainSeparator);
console.log('structHash:', structHash);

const prefix = '0x1901';
const encoded = prefix + domainSeparator.slice(2) + structHash.slice(2);
const digest = '0x' + base16.encode(keccak(base16.decode(encoded.slice(2))));
console.log('digest:', digest);
console.log();

// Manual method (what we do in CCXT)
console.log('=== Manual Method ===');
const encode = (str: string) => new TextEncoder().encode(str);
const remove0xPrefix = (str: string) => str.startsWith('0x') ? str.slice(2) : str;
const binaryToBase16 = (bytes: Uint8Array) => base16.encode(bytes);
const base16ToBinary = (hex: string) => base16.decode(hex);
const intToBase16 = (num: string) => {
    const bigInt = BigInt(num);
    return '0x' + bigInt.toString(16);
};

// Domain separator
const domainTypeString = 'EIP712Domain(string name,string version,uint256 chainId,address verifyingContract)';
const domainTypeHash = binaryToBase16(keccak(domainTypeString));
const nameHash = binaryToBase16(keccak(domain.name));
const versionHash = binaryToBase16(keccak(domain.version));
const chainIdHex = remove0xPrefix(intToBase16(String(domain.chainId))).toLowerCase().padStart(64, '0');
const verifyingContractHex = remove0xPrefix(domain.verifyingContract).toLowerCase().padStart(64, '0');
const manualDomainData = domainTypeHash + nameHash + versionHash + chainIdHex + verifyingContractHex;
const manualDomainSeparator = '0x' + binaryToBase16(keccak(base16ToBinary(manualDomainData)));

console.log('domainSeparator:', manualDomainSeparator);
console.log('Match:', manualDomainSeparator === domainSeparator ? '✅' : '❌');

// Struct hash
const orderTypeString = 'Order(address sellToken,address buyToken,address receiver,uint256 sellAmount,uint256 buyAmount,uint32 validTo,bytes32 appData,uint256 feeAmount,string kind,bool partiallyFillable,string sellTokenBalance,string buyTokenBalance)';
const orderTypeHash = binaryToBase16(keccak(orderTypeString));
const sellTokenHex = remove0xPrefix(message.sellToken).toLowerCase().padStart(64, '0');
const buyTokenHex = remove0xPrefix(message.buyToken).toLowerCase().padStart(64, '0');
const receiverHex = remove0xPrefix(message.receiver).toLowerCase().padStart(64, '0');
const sellAmountHex = remove0xPrefix(intToBase16(message.sellAmount)).toLowerCase().padStart(64, '0');
const buyAmountHex = remove0xPrefix(intToBase16(message.buyAmount)).toLowerCase().padStart(64, '0');
const validToHex = remove0xPrefix(intToBase16(String(message.validTo))).toLowerCase().padStart(64, '0');
const appDataHex = remove0xPrefix(message.appData).toLowerCase().padStart(64, '0');
const feeAmountHex = remove0xPrefix(intToBase16(message.feeAmount)).toLowerCase().padStart(64, '0');
const kindHash = binaryToBase16(keccak(message.kind));
const partiallyFillableHex = message.partiallyFillable ? '0000000000000000000000000000000000000000000000000000000000000001' : '0000000000000000000000000000000000000000000000000000000000000000';
const sellTokenBalanceHash = binaryToBase16(keccak(message.sellTokenBalance));
const buyTokenBalanceHash = binaryToBase16(keccak(message.buyTokenBalance));

const manualStructData = orderTypeHash + sellTokenHex + buyTokenHex + receiverHex + sellAmountHex + buyAmountHex + validToHex + appDataHex + feeAmountHex + kindHash + partiallyFillableHex + sellTokenBalanceHash + buyTokenBalanceHash;
const manualStructHash = '0x' + binaryToBase16(keccak(base16ToBinary(manualStructData)));

console.log('structHash:', manualStructHash);
console.log('Match:', manualStructHash === structHash ? '✅' : '❌');

const manualEncoded = '1901' + remove0xPrefix(manualDomainSeparator) + remove0xPrefix(manualStructHash);
const manualDigest = '0x' + binaryToBase16(keccak(base16ToBinary(manualEncoded)));

console.log('digest:', manualDigest);
console.log('Match:', manualDigest === digest ? '✅' : '❌');

if (manualDigest !== digest) {
    console.log('\n❌ MISMATCH FOUND!');
    console.log('Manual encoding produces a different digest than TypedDataEncoder');
} else {
    console.log('\n✅ PERFECT MATCH!');
    console.log('Manual encoding matches TypedDataEncoder exactly');
}


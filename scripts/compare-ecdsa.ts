/**
 * Compare CCXT's ecdsa() vs direct secp256k1.sign()
 */
import { readFileSync } from 'fs';
import { secp256k1 } from '../ts/src/static_dependencies/noble-curves/secp256k1.js';
import { ecdsa } from '../ts/src/base/functions/crypto.js';

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

console.log('=== Comparing ecdsa() vs secp256k1.sign() ===\n');

const remove0xPrefix = (str: string) => str.startsWith('0x') ? str.slice(2) : str;

// Test digest
const digest = '0x39bc7f27faf3eac5a58c65b1b28595f6a2297ba44932fbf99128f78b41c67729';
const digestHex = remove0xPrefix(digest);
const keyHex = remove0xPrefix(privateKey);

console.log('Digest:', digest);
console.log();

// Method 1: Direct secp256k1.sign()
console.log('=== Direct secp256k1.sign() ===');
const sig1 = secp256k1.sign(digestHex, keyHex, { lowS: true });
console.log('r:', sig1.r.toString(16));
console.log('s:', sig1.s.toString(16));
console.log('recovery:', sig1.recovery);
console.log();

// Method 2: CCXT's ecdsa()
console.log('=== CCXT ecdsa() ===');
const sig2 = ecdsa(digestHex, keyHex, secp256k1, undefined);
console.log('r:', sig2.r);
console.log('s:', sig2.s);
console.log('v:', sig2.v);
console.log();

// Compare
console.log('=== Comparison ===');
console.log('r match:', sig1.r.toString(16) === sig2.r ? '✅' : '❌');
console.log('s match:', sig1.s.toString(16) === sig2.s ? '✅' : '❌');
console.log('recovery match:', sig1.recovery === sig2.v ? '✅' : '❌');

if (sig1.r.toString(16) !== sig2.r || sig1.s.toString(16) !== sig2.s) {
    console.log('\nTHEY ARE DIFFERENT!');
    console.log('CCXT ecdsa is returning a different signature than direct secp256k1.sign');
    console.log('This explains why signature recovery fails.');
}


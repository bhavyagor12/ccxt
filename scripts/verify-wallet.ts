/**
 * Verify private key derives to the correct wallet address
 */
import { readFileSync } from 'fs';
import { keccak_256 as keccak } from '../ts/src/static_dependencies/noble-hashes/sha3.js';
import { secp256k1 } from '../ts/src/static_dependencies/noble-curves/secp256k1.js';
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

const privateKey = process.env.PRIVATE_KEY || '';
const expectedAddress = process.env.WALLET_ADDRESS || '';

console.log('=== Wallet Address Verification ===\n');
console.log('Expected address:', expectedAddress);
console.log('Private key (first 10):', privateKey.slice(0, 12) + '...');
console.log();

// Derive address from private key
try {
    const remove0xPrefix = (str: string) => str.startsWith('0x') ? str.slice(2) : str;
    const keyHex = remove0xPrefix(privateKey);
    
    // Get public key from private key
    const publicKey = secp256k1.getPublicKey(keyHex, false); // Uncompressed format
    console.log('Public key length:', publicKey.length); // Should be 65 bytes (0x04 + 64 bytes)
    
    // Remove the 0x04 prefix and hash the rest
    const publicKeyWithoutPrefix = publicKey.slice(1); // Remove first byte (0x04)
    console.log('Public key without prefix length:', publicKeyWithoutPrefix.length); // Should be 64 bytes
    
    // Hash the public key
    const hash = keccak(publicKeyWithoutPrefix);
    console.log('Hash length:', hash.length); // Should be 32 bytes
    
    // Take last 20 bytes as address
    const addressBytes = hash.slice(-20);
    const derivedAddress = '0x' + base16.encode(addressBytes);
    
    console.log('\nDerived address:', derivedAddress);
    console.log('Expected address:', expectedAddress.toLowerCase());
    console.log();
    
    if (derivedAddress.toLowerCase() === expectedAddress.toLowerCase()) {
        console.log('✅ ADDRESS MATCH! Private key is correct.');
    } else {
        console.log('❌ ADDRESS MISMATCH! Private key does NOT derive to the expected address!');
        console.log('\nThis means either:');
        console.log('1. The private key in .env is wrong');
        console.log('2. The wallet address in .env is wrong');
        console.log('3. There is a bug in the derivation logic');
    }
} catch (error) {
    console.error('❌ Error deriving address:', error.message);
    console.error(error.stack);
}


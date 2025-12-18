/**
 * Test signing directly with secp256k1 to isolate the issue
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
const walletAddress = process.env.WALLET_ADDRESS || '';

console.log('=== Direct Signing Test ===\n');

const remove0xPrefix = (str: string) => str.startsWith('0x') ? str.slice(2) : str;

// The digest from the actual failed order
const digest = '0x39bc7f27faf3eac5a58c65b1b28595f6a2297ba44932fbf99128f78b41c67729';

console.log('Digest:', digest);
console.log('Private key (first 10):', privateKey.slice(0, 12) + '...');
console.log('Expected wallet:', walletAddress);
console.log();

// Sign using secp256k1 directly
const digestHex = remove0xPrefix(digest);
const keyHex = remove0xPrefix(privateKey);

console.log('Signing with secp256k1 sign...');
console.log('  digestHex length:', digestHex.length);
console.log('  keyHex length:', keyHex.length);
console.log();

try {
    const signature = secp256k1.sign(digestHex, keyHex, { lowS: true });
    
    console.log('Signature generated:');
    console.log('  r:', signature.r.toString(16));
    console.log('  s:', signature.s.toString(16));
    console.log('  recovery:', signature.recovery);
    console.log();
    
    // Recover the address
    const r = signature.r.toString(16).padStart(64, '0');
    const s = signature.s.toString(16).padStart(64, '0');
    const recoveryBit = signature.recovery;
    
    const sig = secp256k1.Signature.fromCompact(r + s).addRecoveryBit(recoveryBit);
    const digestBytes = base16.decode(digestHex);
    const publicKey = sig.recoverPublicKey(digestBytes).toRawBytes(false);
    const publicKeyWithoutPrefix = publicKey.slice(1);
    const addressHash = keccak(publicKeyWithoutPrefix);
    const recoveredAddress = '0x' + base16.encode(addressHash).slice(-40);
    
    console.log('Recovered address:', recoveredAddress);
    console.log('Expected address:', walletAddress.toLowerCase());
    console.log('Match:', recoveredAddress === walletAddress.toLowerCase() ? '✅' : '❌');
    
    if (recoveredAddress === walletAddress.toLowerCase()) {
        console.log('\n✅ SUCCESS! Direct signing works correctly.');
        console.log('The issue must be in how ecdsa() or signDigest() is processing the data.');
    } else {
        console.log('\nFAILURE! Even direct signing does not work.');
        console.log('This suggests an issue with the private key or digest.');
    }
    
} catch (error) {
    console.error('❌ Error:', error.message);
    console.error(error.stack);
}


/**
 * Test creating an order step by step to isolate signing issues
 */
import { readFileSync } from 'fs';
// Use TS version directly to get latest changes
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

const privateKey = process.env.PRIVATE_KEY;
const walletAddress = process.env.WALLET_ADDRESS;

console.log('=== CoW Protocol Order Creation Test ===\n');
console.log('Wallet:', walletAddress);
console.log();

// Initialize exchange
const exchange = new ccxt.cow({
    privateKey,
    walletAddress,
    options: {
        network: 'base',
        environment: 'prod', // Use production instead of barn
    },
});

async function testOrderCreation() {
    try {
        await exchange.loadMarkets();
        
        // Try to create a very small order
        console.log('Attempting to create order...');
        const symbol = 'USDC/DAI';
        const type = 'market';
        const side = 'sell';
        const amount = 1; // 1 USDC
        
        console.log(`Symbol: ${symbol}`);
        console.log(`Type: ${type}`);
        console.log(`Side: ${side}`);
        console.log(`Amount: ${amount}`);
        console.log();
        
        // Use validFor parameter to set longer expiry
        const order = await exchange.createOrder(symbol, type, side, amount, undefined, {
            validFor: 3600, // 1 hour
        });
        
        console.log('✅ Order created successfully!');
        console.log('Order ID:', order.id);
        console.log('Status:', order.status);
        console.log('Full order:', JSON.stringify(order, null, 2));
        
    } catch (error) {
        console.log('❌ Order creation failed');
        console.log('Error message:', error.message);
        
        // Parse the error for more details
        if (error.message.includes('recovered signer')) {
            const match = error.message.match(/recovered signer (0x[a-fA-F0-9]+).*from address/);
            if (match) {
                const recoveredSigner = match[1];
                console.log('\nRecovered signer:', recoveredSigner);
                console.log('Expected address:', walletAddress);
                console.log('Match:', recoveredSigner.toLowerCase() === walletAddress.toLowerCase() ? '✅' : '❌');
            }
        }
    }
}

testOrderCreation().catch(console.error);


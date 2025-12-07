# CoW Protocol CCXT Integration Test Scripts

This folder contains comprehensive test scripts for all CoW Protocol CCXT functions.

## Setup

1. **Copy the environment file**:
   ```bash
   cp .env.example .env
   ```

2. **Fill in your credentials** in `.env`:
   - `WALLET_ADDRESS`: Your Ethereum wallet address
   - `PRIVATE_KEY`: Your private key (with 0x prefix)
   - `NETWORK`: Network to test on (sepolia recommended for testing)
   - `ENV`: Environment (barn for testnet, prod for mainnet)
   - `TEST_SYMBOL`: Trading pair to use (e.g., WETH/USDC)
   - `TEST_AMOUNT`: Small amount for test orders
   - `TEST_PRICE`: Price for limit order tests

3. **Install dependencies** (if not already installed):
   ```bash
   # From project root
   npm install
   
   # For Python tests
   pip install python-dotenv cryptography
   # Or install all Python dependencies:
   cd python && pip install -r requirements.txt
   ```

## Running Tests

### TypeScript Tests

Run individual test files:
```bash
# From scripts folder
tsx test-fetchMarkets.ts
tsx test-fetchBalance.ts
tsx test-createOrder.ts
# ... etc
```

### Python Tests

Run individual test files:
```bash
# From scripts folder
python3 test_fetchMarkets.py
python3 test_fetchBalance.py
python3 test_createOrder.py
# ... etc
```

## Test Files

### Core Exchange Methods
- `test-fetchMarkets.ts` / `test_fetchMarkets.py` - Test market fetching
- `test-fetchBalance.ts` / `test_fetchBalance.py` - Test balance queries
- `test-createOrder.ts` / `test_createOrder.py` - Test order creation
- `test-cancelOrder.ts` / `test_cancelOrder.py` - Test order cancellation
- `test-cancelAllOrders.ts` / `test_cancelAllOrders.py` - Test batch cancellation
- `test-fetchOrder.ts` / `test_fetchOrder.py` - Test single order fetch
- `test-fetchOrders.ts` / `test_fetchOrders.py` - Test all orders fetch
- `test-fetchOpenOrders.ts` / `test_fetchOpenOrders.py` - Test open orders
- `test-fetchClosedOrders.ts` / `test_fetchClosedOrders.py` - Test closed orders
- `test-fetchCanceledOrders.ts` / `test_fetchCanceledOrders.py` - Test canceled orders
- `test-fetchMyTrades.ts` / `test_fetchMyTrades.py` - Test trade history
- `test-waitForOrder.ts` / `test_waitForOrder.py` - Test order polling

### Advanced Features
- `test-compareQuote.ts` / `test_compareQuote.py` - Test quote comparison

## Important Notes

⚠️ **Security Warning**: 
- Never commit your `.env` file to version control
- Use testnet (sepolia + barn) for testing
- Use small amounts for test orders
- Never use mainnet private keys for testing

⚠️ **Testnet Usage**:
- Recommended: Use `NETWORK=sepolia` and `ENV=barn` for testing
- Get test tokens from faucets before running order tests
- Test orders may take time to settle on testnet

## Troubleshooting

**Error: "Insufficient funds"**
- Ensure you have test tokens on the testnet
- Check your wallet address has balance

**Error: "Invalid signature"**
- Verify private key matches wallet address
- Ensure private key has 0x prefix

**Error: "Network not supported"**
- Check NETWORK value in .env matches supported networks
- Supported: mainnet, xdai, arbitrum_one, base, sepolia

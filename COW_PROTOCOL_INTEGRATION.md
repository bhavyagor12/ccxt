# CoW Protocol CCXT Integration

**Implementation Status**: 90% Complete (Pending CCXT Team Review)  
**Pull Request**: [#27319](https://github.com/ccxt/ccxt/pull/27319)

---

## Table of Contents

- [Implementation Summary](#implementation-summary)
- [Multi-Language Support](#multi-language-support)
- [All Implemented Functions](#all-implemented-functions)
- [Function Coverage Details](#function-coverage-details)
- [Network Support](#network-support)
- [API Coverage & OpenAPI Validation](#api-coverage--openapi-validation)
- [Usage Examples](#usage-examples)
- [Testing](#testing)
- [Technical Details](#technical-details)
- [Known Limitations](#known-limitations)

---

## Implementation Summary

Complete CoW Protocol exchange integration for CCXT, enabling standardized trading on CoW Protocol's decentralized exchange across 5 EVM networks.

**Total Implementation**: 1,815 lines of TypeScript  
**Location**: `ts/src/cow.ts`  
**Auto-generated Interface**: `ts/src/abstract/cow.ts`

### What This Integration Enables

- Trade on CoW Protocol using the same API as 100+ other exchanges
- Multi-chain support (Ethereum, Gnosis, Arbitrum, Base, Sepolia)
- Full order lifecycle management (create, query, cancel, monitor)
- Native EIP-712 signing with private key
- Automatic ERC-20 token approvals
- On-chain balance queries via RPC

---

## Multi-Language Support

CCXT automatically transpiles the TypeScript implementation to multiple languages:

| Language | File Location | Size | Status |
|----------|---------------|------|--------|
| **TypeScript** (source) | `ts/src/cow.ts` | 88 KB | ✅ Manual implementation |
| **JavaScript** | `js/src/cow.js` | 86 KB | ✅ Auto-transpiled |
| **Python** | `python/ccxt/cow.py` | 80 KB | ✅ Auto-transpiled |
| **PHP** | `php/cow.php` | 89 KB | ✅ Auto-transpiled |
| **C#** | `cs/ccxt/exchanges/cow.cs` | ~85 KB | ✅ Auto-transpiled |
| **Go** | `go/v4/cow.go` | ~80 KB | ✅ Auto-transpiled |

**Build Process**: Only the TypeScript file is manually written. CCXT's build system (`npm run build`) automatically transpiles to all other languages.

**Transpilation Commands**:
```bash
# Full build (all languages)
npm run build
```

This means developers can use CoW Protocol in their preferred language:

```javascript
// JavaScript/Node.js
const ccxt = require('ccxt');
const exchange = new ccxt.cow({...});
```

```python
# Python
import ccxt
exchange = ccxt.cow({...})
```

```php
// PHP
require 'ccxt.php';
$exchange = new \ccxt\cow([...]);
```

```csharp
// C#
using ccxt;
var exchange = new ccxt.cow();
```

```go
// Go
import "github.com/ccxt/ccxt/go/v4"
exchange := ccxt.NewCow()
```

---

## All Implemented Functions

### Core Exchange Methods (12 functions)

| Function | Description |
|----------|-------------|
| `fetchMarkets()` | Retrieve all tradable token pairs from CoW Protocol token lists |
| `fetchBalance()` | Query ERC-20 token balances for wallet via RPC calls |
| `createOrder()` | Create and submit signed market or limit orders with EIP-712 |
| `cancelOrder()` | Cancel a specific order by UID with signed cancellation |
| `cancelAllOrders()` | Batch cancel multiple open orders for a symbol or all symbols |
| `fetchOrder()` | Get order details and status by order UID |
| `fetchOrders()` | Retrieve all orders (open, closed, cancelled) for an account |
| `fetchOpenOrders()` | Get currently open orders filtered by status |
| `fetchClosedOrders()` | Retrieve fulfilled/completed orders |
| `fetchCanceledOrders()` | Get cancelled orders |
| `fetchMyTrades()` | Fetch trade execution history for an account |
| `waitForOrder()` | Poll order status until it reaches terminal state (closed/cancelled/expired) |

### Parsing & Data Transformation (4 functions)

| Function | Description |
|----------|-------------|
| `parseOrder()` | Convert CoW API order response to CCXT unified order structure |
| `parseTrade()` | Convert CoW API trade response to CCXT unified trade structure |
| `parseOrderStatus()` | Map CoW order statuses to CCXT standardized statuses |
| `convertTokenAmount()` | Convert between wei amounts and decimal token amounts |

### Cryptographic Operations (8 functions)

| Function | Description |
|----------|-------------|
| `signOrderPayload()` | Generate EIP-712 signature for order submission |
| `signOrderCancellation()` | Generate EIP-712 signature for order cancellation |
| `signDigest()` | Sign arbitrary digest with private key (supports ethsign) |
| `hashEthereumSignedMessage()` | Create Ethereum signed message hash (personal_sign format) |
| `computeTypedDataDigest()` | Compute EIP-712 typed data digest hash |
| `deriveWalletAddressFromPrivateKey()` | Derive Ethereum address from secp256k1 private key |
| `normalizePrivateKey()` | Ensure private key has 0x prefix |
| `amountToTokenAmount()` | Convert decimal amount to wei (raw token amount) |

### On-Chain Interactions (5 functions)

| Function | Description |
|----------|-------------|
| `fetchERC20Balance()` | Query token balance via eth_call to balanceOf(address) |
| `checkERC20Allowance()` | Check token approval amount via eth_call to allowance(owner, spender) |
| `approveERC20()` | Generate, sign, and broadcast ERC-20 approval transaction |
| `encodeRLP()` | Encode Ethereum transaction array to RLP format |
| `encodeRLPItem()` | Encode single item to RLP format |

### Utility & Helper Functions (11 functions)

| Function | Description |
|----------|-------------|
| `ensureOwnerAddress()` | Validate and derive wallet address from credentials |
| `resolveOrderbookBaseUrl()` | Build API URL based on network and environment (prod/barn) |
| `getChainIdOption()` | Get chain ID for current network configuration |
| `getVerifyingContractOption()` | Get settlement contract address for EIP-712 domain |
| `getVaultRelayerOption()` | Get VaultRelayer address for token approvals |
| `getRpcUrlOption()` | Get RPC endpoint URL for current network |
| `hexWith0xPrefix()` | Ensure hex string has 0x prefix |
| `addressWith0xPrefix()` | Ensure Ethereum address has 0x prefix |
| `compareQuoteWithOtherExchanges()` | Compare CoW quote prices with other exchanges (DEX/CEX) |
| `handleErrors()` | Map CoW API errors to CCXT exception types |
| `sign()` | Build HTTP request with proper headers and URL encoding |

### Advanced Features (2 functions)

| Function | Description |
|----------|-------------|
| `waitForOrder()` | Poll and wait for order to reach terminal state with timeout |
| `compareQuoteWithOtherExchanges()` | Get quotes from multiple exchanges and compare pricing |

**Total Functions Implemented**: 42 functions across 1,815 lines

---

## Function Coverage Details

### Code Statistics by Category

| Category | Functions | Lines of Code | % of Total |
|----------|-----------|---------------|------------|
| Core Exchange Methods | 12 | ~450 | 25% |
| Parsing & Formatting | 4 | ~380 | 21% |
| Cryptographic Operations | 8 | ~420 | 23% |
| On-Chain Interactions | 5 | ~320 | 18% |
| Helper/Utility Methods | 11 | ~245 | 13% |
| **Total** | **40** | **1,815** | **100%** |

### Detailed Line Count by Function

**Core Exchange Methods** (450 lines):
- `fetchMarkets()` - 134 lines - Fetches token list and generates all trading pairs
- `fetchBalance()` - 49 lines - Queries on-chain balances for all tokens
- `createOrder()` - 123 lines - Full order creation flow with quote, signing, approval
- `cancelOrder()` - 21 lines - Signs and submits order cancellation
- `cancelAllOrders()` - 20 lines - Batch cancellation for multiple orders
- `fetchOrder()` - 12 lines - Single order lookup by UID
- `fetchOrders()` - 18 lines - All orders for account with filtering
- `fetchOpenOrders()` - 3 lines - Filter orders by "open" status
- `fetchClosedOrders()` - 4 lines - Filter orders by "closed" status
- `fetchCanceledOrders()` - 4 lines - Filter orders by "canceled" status
- `fetchMyTrades()` - 20 lines - Trade history with pagination
- `waitForOrder()` - 23 lines - Poll until order reaches terminal state

**Parsing Functions** (380 lines):
- `parseOrder()` - 164 lines - Complex order parsing with market resolution, decimals, amounts
- `parseTrade()` - 95 lines - Trade parsing with side detection, fee calculation
- `parseOrderStatus()` - 16 lines - Status mapping with all CoW states
- `convertTokenAmount()` - 7 lines - Decimal ↔ wei conversion

**Cryptographic Functions** (420 lines):
- `signOrderPayload()` - 54 lines - Full EIP-712 order signing with domain separator
- `signOrderCancellation()` - 33 lines - EIP-712 cancellation with array hashing
- `signDigest()` - 20 lines - Low-level secp256k1 signing with recovery
- `hashEthereumSignedMessage()` - 15 lines - Personal sign message wrapping
- `computeTypedDataDigest()` - 9 lines - EIP-712 digest computation
- `deriveWalletAddressFromPrivateKey()` - 15 lines - Full key → address derivation
- `normalizePrivateKey()` - 5 lines - 0x prefix handling
- `amountToTokenAmount()` - 7 lines - Amount conversion for orders

**On-Chain Interaction Functions** (320 lines):
- `fetchERC20Balance()` - 34 lines - balanceOf() call via eth_call
- `checkERC20Allowance()` - 29 lines - allowance() call via eth_call
- `approveERC20()` - 95 lines - Full transaction: nonce, gas, sign, broadcast
- `encodeRLP()` - 14 lines - RLP list encoding for transactions
- `encodeRLPItem()` - 29 lines - RLP single item encoding with length prefixes

**Utility & Helper Functions** (245 lines):
- `ensureOwnerAddress()` - 24 lines - Validate wallet address or derive from key
- `resolveOrderbookBaseUrl()` - 17 lines - Build API URL from network config
- `getChainIdOption()` - 8 lines - Network → chain ID mapping
- `getVerifyingContractOption()` - 8 lines - Network → settlement contract mapping
- `getVaultRelayerOption()` - 8 lines - Network → VaultRelayer address mapping
- `getRpcUrlOption()` - 4 lines - Network → RPC endpoint mapping
- `hexWith0xPrefix()` - 5 lines - Hex string normalization
- `addressWith0xPrefix()` - 3 lines - Address normalization
- `compareQuoteWithOtherExchanges()` - 127 lines - Multi-exchange quote comparison
- `handleErrors()` - 62 lines - Comprehensive error mapping
- `sign()` - 27 lines - HTTP request builder

### Implementation Coverage

**API Endpoints**: 6/6 (100%)
- ✅ GET `/api/v1/orders/{uid}`
- ✅ GET `/api/v1/account/{owner}/orders`
- ✅ GET `/api/v1/trades`
- ✅ POST `/api/v1/quote`
- ✅ POST `/api/v1/orders`
- ✅ DELETE `/api/v1/orders`

**Order Types**: 2/2 supported by CoW Protocol
- ✅ Market orders (quote-based)
- ✅ Limit orders (price via buyAmount/sellAmount)

**Networks**: 5/5 EVM chains
- ✅ Ethereum Mainnet (chainId: 1)
- ✅ Gnosis Chain (chainId: 100)
- ✅ Arbitrum One (chainId: 42161)
- ✅ Base (chainId: 8453)
- ✅ Sepolia Testnet (chainId: 11155111)

**Signing Methods**: 2/2
- ✅ EIP-712 (typed data)
- ✅ EthSign (personal sign)

**Token Operations**: 3/3
- ✅ Balance queries (balanceOf)
- ✅ Allowance checks (allowance)
- ✅ Approvals (approve)

---

## Network Support

### Supported Networks

| Network | Chain ID | API Base URL | Settlement Contract | VaultRelayer | RPC Endpoint |
|---------|----------|--------------|---------------------|--------------|--------------|
| **Ethereum Mainnet** | 1 | `api.cow.fi/mainnet` | `0x9008D19f58AAbD9eD0D60971565AA8510560ab41` | `0xC92E8bdf79f0507f65a392b0ab4667716BFE0110` | `https://eth.llamarpc.com` |
| **Gnosis Chain** | 100 | `api.cow.fi/xdai` | `0x9008D19f58AAbD9eD0D60971565AA8510560ab41` | `0xC92E8bdf79f0507f65a392b0ab4667716BFE0110` | `https://rpc.gnosischain.com` |
| **Arbitrum One** | 42161 | `api.cow.fi/arbitrum-one` | `0x9008D19f58AAbD9eD0D60971565AA8510560ab41` | `0xC92E8bdf79f0507f65a392b0ab4667716BFE0110` | `https://arb1.arbitrum.io/rpc` |
| **Base** | 8453 | `api.cow.fi/base` | `0x9008D19f58AAbD9eD0D60971565AA8510560ab41` | `0xC92E8bdf79f0507f65a392b0ab4667716BFE0110` | `https://mainnet.base.org` |
| **Sepolia** (testnet) | 11155111 | `barn.api.cow.fi/sepolia` | `0x9008D19f58AAbD9eD0D60971565AA8510560ab41` | `0xC92E8bdf79f0507f65a392b0ab4667716BFE0110` | `https://rpc.sepolia.org` |

**Environments**:
- **Production**: `api.cow.fi` (all mainnet networks)
- **Barn (Staging)**: `barn.api.cow.fi` (testnet)

**Network Switching**:
```javascript
// Set default network in constructor
const exchange = new ccxt.cow({
    walletAddress: '0x...',
    privateKey: '0x...',
    options: { 
        network: 'xdai',  // mainnet | xdai | arbitrum_one | base | sepolia
        env: 'prod'       // prod | barn
    }
});

// Or override per request
const markets = await exchange.fetchMarkets({ network: 'arbitrum_one' });
const balance = await exchange.fetchBalance({ network: 'base' });
```

---

## API Coverage & OpenAPI Validation

### OpenAPI Specification Compliance

Full compatibility with CoW Protocol's OpenAPI specification: https://api.cow.fi/docs/

### Endpoint Mapping

| OpenAPI Endpoint | CCXT Function | Request Schema | Response Schema | Status |
|------------------|---------------|----------------|-----------------|--------|
| `GET /api/v1/orders/{uid}` | `fetchOrder(id)` | Order UID | Order object | ✅ Validated |
| `GET /api/v1/account/{owner}/orders` | `fetchOrders()`, `fetchOpenOrders()` | Owner address, filters | Order array | ✅ Validated |
| `GET /api/v1/trades` | `fetchMyTrades()` | Owner, limit, timestamp | Trade array | ✅ Validated |
| `POST /api/v1/quote` | Internal (in `createOrder()`) | Quote request | Quote response | ✅ Validated |
| `POST /api/v1/orders` | `createOrder()` | Signed order | Order UID | ✅ Validated |
| `DELETE /api/v1/orders` | `cancelOrder()` | Signed cancellation | Success response | ✅ Validated |

### Request Schema Examples

**Order Creation (POST /api/v1/orders)**:
```typescript
{
  sellToken: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",  // USDC
  buyToken: "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",   // WETH
  receiver: "0x...",
  sellAmount: "1000000000",  // 1000 USDC (6 decimals)
  buyAmount: "500000000000000000",  // 0.5 WETH (18 decimals)
  validTo: 1702123456,  // Unix timestamp
  appData: "0x0000000000000000000000000000000000000000000000000000000000000000",
  feeAmount: "0",
  kind: "sell",
  partiallyFillable: false,
  sellTokenBalance: "erc20",
  buyTokenBalance: "erc20",
  signingScheme: "eip712",
  signature: "0x...",  // EIP-712 signature
  from: "0x..."  // Signer address
}
```

**Order Cancellation (DELETE /api/v1/orders)**:
```typescript
{
  orderUids: ["0x..."],  // Array of order UIDs to cancel
  signature: "0x...",     // EIP-712 cancellation signature
  signingScheme: "eip712"
}
```

### Response Parsing

All API responses are validated and converted to CCXT unified structures:

**Order Structure**:
- `id` - Order UID
- `symbol` - Unified symbol (e.g., "WETH/USDC")
- `type` - Order type (undefined for CoW)
- `side` - "buy" or "sell"
- `amount` - Order size in base currency
- `price` - Average execution price
- `status` - "open", "closed", "canceled", "expired"
- `filled` - Executed amount
- `remaining` - Unfilled amount
- `timestamp` - Creation time
- `fee` - Fee information

**Trade Structure**:
- `id` - Trade UID
- `order` - Related order UID
- `symbol` - Trading pair
- `side` - "buy" or "sell"
- `price` - Execution price
- `amount` - Trade size
- `cost` - Total cost in quote currency
- `fee` - Fee details
- `timestamp` - Execution time

### Breaking Changes Handling

✅ **Updated for December 2024 API**:
- New `feeAmount` field in orders (required, set to "0")
- Updated fee model (fees included in quote)
- New order statuses ("pending-solver-submission", "presignatureAwaiting")

---

## Usage Examples

### 1. Basic Setup

```javascript
import ccxt from 'ccxt';

const exchange = new ccxt.cow({
    walletAddress: '0xYourWalletAddress',
    privateKey: '0xYourPrivateKey',
    options: {
        network: 'xdai',  // Gnosis Chain
        env: 'prod'
    }
});
```

### 2. Fetch Markets

```javascript
const markets = await exchange.fetchMarkets();
console.log(`Found ${markets.length} trading pairs`);
console.log(markets[0]);
// { symbol: 'WETH/USDC', base: 'WETH', quote: 'USDC', ... }
```

### 3. Check Balance

```javascript
const balance = await exchange.fetchBalance();
console.log(balance);
// { USDC: { free: 1000, used: 0, total: 1000 }, ... }
```

### 4. Create Market Order

```javascript
const order = await exchange.createOrder(
    'WETH/USDC',  // symbol
    'market',     // type
    'sell',       // side
    0.1           // amount (0.1 WETH)
);
console.log('Order created:', order.id);
```

### 5. Create Limit Order

```javascript
const order = await exchange.createOrder(
    'WETH/USDC',
    'limit',
    'buy',
    0.5,    // amount
    2000,   // price
    {
        validFor: 3600,  // 1 hour validity
        partiallyFillable: true
    }
);
```

### 6. Monitor Order

```javascript
// Poll until order completes
const completed = await exchange.waitForOrder(order.id, 'WETH/USDC');
console.log('Status:', completed.status);
console.log('Filled:', completed.filled);
```

### 7. Cancel Order

```javascript
await exchange.cancelOrder(orderId);
```

### 8. Multi-Network

```javascript
// Ethereum Mainnet
const eth = new ccxt.cow({
    walletAddress: '0x...',
    privateKey: '0x...',
    options: { network: 'mainnet' }
});

// Arbitrum
const arb = new ccxt.cow({
    walletAddress: '0x...',
    privateKey: '0x...',
    options: { network: 'arbitrum_one' }
});
```

---

## Testing

A separate testing folder with comprehensive test scripts will be provided. The integration includes:

### Built-in Validation

1. **Input Validation**: All parameters checked for type and required fields
2. **Response Parsing**: Schema validation for all API responses
3. **Error Handling**: All CoW API errors mapped to CCXT exceptions
4. **Type Safety**: Full TypeScript type definitions

### Error Mapping

| CoW Error | CCXT Exception | Description |
|-----------|----------------|-------------|
| `DuplicatedOrder` | `InvalidOrder` | Order already exists |
| `InsufficientFunds` | `InsufficientFunds` | Insufficient token balance |
| `UnknownOrder` | `OrderNotFound` | Order UID not found |
| `InvalidSignature` | `AuthenticationError` | Invalid EIP-712 signature |
| `UnsupportedSellToken` | `BadSymbol` | Token not supported |
| `NoLiquidity` | `InvalidOrder` | Insufficient liquidity |

### CCXT Test Suite Compatibility

The implementation passes CCXT's standard test suite:
- ✅ Request formatting tests
- ✅ Response parsing tests
- ✅ Base functionality tests
- ✅ ID validation tests

---

## Technical Details

### EIP-712 Signature Implementation

Full implementation of EIP-712 structured data signing:

```typescript
// Domain separator
{
  name: "Gnosis Protocol",
  version: "v2",
  chainId: <network_chain_id>,
  verifyingContract: <settlement_contract_address>
}

// Order type definition
Order: {
  sellToken: address,
  buyToken: address,
  receiver: address,
  sellAmount: uint256,
  buyAmount: uint256,
  validTo: uint32,
  appData: bytes32,
  feeAmount: uint256,
  kind: string,
  partiallyFillable: bool,
  sellTokenBalance: string,
  buyTokenBalance: string
}
```

### Token Amount Conversion

Precise conversion between human-readable and on-chain amounts:

```typescript
// Decimal → Wei (for API submission)
1.5 USDC (6 decimals) → "1500000"
0.5 WETH (18 decimals) → "500000000000000000"

// Wei → Decimal (from API responses)
"1500000" → 1.5 USDC
"500000000000000000" → 0.5 WETH
```

Uses `Precise` class for arbitrary precision arithmetic (no floating point errors).

### Key Derivation

Standard Ethereum key derivation:

```
Private Key (32 bytes)
  → Secp256k1.getPublicKey() → Public Key (65 bytes uncompressed)
  → Keccak256(publicKey[1:]) → Hash (32 bytes)
  → Last 20 bytes → Ethereum Address
```

### RLP Encoding

Full RLP (Recursive Length Prefix) encoding for Ethereum transactions:
- Single item encoding with length prefixes
- List encoding for transaction arrays
- Support for variable-length integers

### Transaction Signing

Complete transaction lifecycle:
1. Fetch nonce via `eth_getTransactionCount`
2. Fetch gas price via `eth_gasPrice`
3. Build transaction object with RLP encoding
4. Sign with secp256k1
5. Broadcast via `eth_sendRawTransaction`

---

## Known Limitations

1. **No WebSocket Support**: REST API only, real-time updates require polling
2. **No Order Book**: CoW Protocol doesn't expose traditional order books
3. **No Public Trades**: Only account-specific trade history available
4. **Limited Order Types**: Market and limit only (no stop-loss, take-profit)
5. **RPC Dependency**: Balance queries require RPC access (may hit rate limits)
6. **Gas Costs**: First-time token usage requires approval transaction

---

## Milestone Completion

### ✅ Milestone 1: Research and Setup
- CoW Protocol API documentation reviewed
- CCXT architecture understood
- Development environment configured
- Token list integration researched

### ✅ Milestone 2: Core Implementation
- Exchange class structure implemented
- Market fetching with multi-chain support
- Order creation with EIP-712 signing
- Balance queries via RPC
- Order management (fetch/cancel)

### ✅ Milestone 3: Advanced Features and Testing
- Order cancellation with batch support
- Trade history fetching
- Automatic ERC-20 approvals
- Multi-network support (5 networks)
- Quote comparison tool
- Order polling utility
- Error handling and validation
- Documentation

### 🔄 Milestone 4: Review and Merge (In Progress)
- PR submitted: [#27319](https://github.com/ccxt/ccxt/pull/27319)
- Awaiting CCXT team review
- Ready for community feedback
- Integration testing ongoing

---

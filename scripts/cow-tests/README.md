# CoW Protocol CCXT Test Suite

Comprehensive tests verifying cow.ts against @cowprotocol/cow-sdk.  
**NO MOCKS - NO PLACEHOLDERS - ALL REAL SDK COMPARISONS**

## Run All Tests
```bash
npx tsx scripts/cow-tests/run-tests.ts
```

## Run by Category
```bash
npx tsx scripts/cow-tests/run-tests.ts --signing    # Order signing
npx tsx scripts/cow-tests/run-tests.ts --structure  # Order structure
npx tsx scripts/cow-tests/run-tests.ts --negative   # Error handling
npx tsx scripts/cow-tests/run-tests.ts --sdk        # SDK comparison
npx tsx scripts/cow-tests/run-tests.ts --static     # Static vectors
npx tsx scripts/cow-tests/run-tests.ts --api        # API comparison
npx tsx scripts/cow-tests/run-tests.ts --verify     # Constants verification
npx tsx scripts/cow-tests/run-tests.ts --full       # Comprehensive SDK coverage
```

## Test Summary (72 tests)

| Category | Tests | Description |
|----------|-------|-------------|
| Order Signing | 5 | Signature format, determinism, SDK match |
| Order Structure | 6 | Address format, amount conversion, parsing |
| Negative Tests | 10 | Invalid inputs, error handling |
| SDK Comparison | 8 | Byte-for-byte signature matching |
| Static Vectors | 9 | Pre-computed cryptographic vectors |
| API Comparison | 6 | Parsing, structure validation |
| SDK Verification | 10 | Constants vs SDK |
| **SDK Full Coverage** | 18 | ALL cow.ts items vs SDK |

## SDK Full Coverage Tests (--full)

**Security-critical verifications:**
- Settlement contract per chain (mainnet/xdai/sepolia)
- Vault relayer per chain (critical for token allowances)
- Chain IDs match SupportedChainId

**All SDK exports verified:**
- OrderKind, OrderStatus, SigningScheme enums
- SellTokenSource, BuyTokenDestination enums
- ORDER_TYPE_FIELDS, ORDER_UID_LENGTH, ZERO_ADDRESS
- EIP-712 domain (Gnosis Protocol v2)
- Order/Trade parsing structure

## Dependencies
```bash
npm install --save-dev @cowprotocol/cow-sdk @cowprotocol/sdk-order-book @cowprotocol/sdk-order-signing @cowprotocol/sdk-ethers-v6-adapter ethers
```

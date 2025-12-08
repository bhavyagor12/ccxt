# CoW Protocol Test Suite

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
```

## Install SDK (for full comparison)
```bash
npm install --save-dev @cowprotocol/cow-sdk @cowprotocol/sdk-order-signing @cowprotocol/sdk-order-book @cowprotocol/sdk-ethers-v6-adapter ethers
```

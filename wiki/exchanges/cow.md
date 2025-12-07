
<a name="cow" id="cow"></a>

## cow{docsify-ignore}
**Kind**: global class  
**Extends**: <code>Exchange</code>  

* [fetchMarkets](#fetchmarkets)
* [fetchOrder](#fetchorder)
* [fetchOrders](#fetchorders)
* [fetchOpenOrders](#fetchopenorders)
* [fetchClosedOrders](#fetchclosedorders)
* [fetchCanceledOrders](#fetchcanceledorders)
* [fetchBalance](#fetchbalance)
* [fetchMyTrades](#fetchmytrades)
* [createOrder](#createorder)
* [cancelOrder](#cancelorder)
* [cancelAllOrders](#cancelallorders)
* [compareQuoteWithOtherExchanges](#comparequotewithotherexchanges)
* [waitForOrder](#waitfororder)

<a name="fetchMarkets" id="fetchmarkets"></a>

### fetchMarkets{docsify-ignore}
retrieves data on all markets for CoW Protocol

**Kind**: instance method of [<code>cow</code>](#cow)  
**Returns**: <code>Array&lt;object&gt;</code> - an array of objects representing market data

**See**: https://docs.cow.fi/cow-protocol/reference/apis/orderbook  

| Param | Type | Required | Description |
| --- | --- | --- | --- |
| params | <code>object</code> | No | extra parameters specific to the exchange API endpoint |
| params.tokenListUrl | <code>string</code> | No | override the default token list URL |
| params.tokens | <code>Array</code> | No | manually provide a token list instead of fetching |
| params.quoteSymbols | <code>Array</code> | No | override default quote symbols (USDC, USDT, DAI, WETH) |
| params.chainId | <code>int</code> | No | override the chain ID for filtering tokens |


```javascript
cow.fetchMarkets ([params])
```


<a name="fetchOrder" id="fetchorder"></a>

### fetchOrder{docsify-ignore}
fetches information on an order made by the user

**Kind**: instance method of [<code>cow</code>](#cow)  
**Returns**: <code>object</code> - An [order structure](https://docs.ccxt.com/#/?id=order-structure)

**See**: https://docs.cow.fi/cow-protocol/reference/apis/orderbook  

| Param | Type | Required | Description |
| --- | --- | --- | --- |
| id | <code>string</code> | Yes | order id (UID) |
| symbol | <code>string</code> | Yes | unified symbol of the market the order was made in |
| params | <code>object</code> | No | extra parameters specific to the exchange API endpoint |


```javascript
cow.fetchOrder (id, symbol[, params])
```


<a name="fetchOrders" id="fetchorders"></a>

### fetchOrders{docsify-ignore}
fetches information on multiple orders made by the user

**Kind**: instance method of [<code>cow</code>](#cow)  
**Returns**: <code>Array&lt;Order&gt;</code> - a list of [order structures](https://docs.ccxt.com/#/?id=order-structure)

**See**: https://docs.cow.fi/cow-protocol/reference/apis/orderbook  

| Param | Type | Required | Description |
| --- | --- | --- | --- |
| symbol | <code>string</code> | Yes | unified market symbol of the market orders were made in |
| since | <code>int</code> | No | the earliest time in ms to fetch orders for |
| limit | <code>int</code> | No | the maximum number of order structures to retrieve |
| params | <code>object</code> | No | extra parameters specific to the exchange API endpoint |
| params.owner | <code>string</code> | No | the wallet address to fetch orders for |


```javascript
cow.fetchOrders (symbol[, since, limit, params])
```


<a name="fetchOpenOrders" id="fetchopenorders"></a>

### fetchOpenOrders{docsify-ignore}
fetch all unfilled currently open orders

**Kind**: instance method of [<code>cow</code>](#cow)  
**Returns**: <code>Array&lt;Order&gt;</code> - a list of [order structures](https://docs.ccxt.com/#/?id=order-structure)

**See**: https://docs.cow.fi/cow-protocol/reference/apis/orderbook  

| Param | Type | Required | Description |
| --- | --- | --- | --- |
| symbol | <code>string</code> | Yes | unified market symbol |
| since | <code>int</code> | No | the earliest time in ms to fetch open orders for |
| limit | <code>int</code> | No | the maximum number of open order structures to retrieve |
| params | <code>object</code> | No | extra parameters specific to the exchange API endpoint |
| params.owner | <code>string</code> | No | the wallet address to fetch orders for |


```javascript
cow.fetchOpenOrders (symbol[, since, limit, params])
```


<a name="fetchClosedOrders" id="fetchclosedorders"></a>

### fetchClosedOrders{docsify-ignore}
fetches information on multiple closed orders made by the user

**Kind**: instance method of [<code>cow</code>](#cow)  
**Returns**: <code>Array&lt;Order&gt;</code> - a list of [order structures](https://docs.ccxt.com/#/?id=order-structure)

**See**: https://docs.cow.fi/cow-protocol/reference/apis/orderbook  

| Param | Type | Required | Description |
| --- | --- | --- | --- |
| symbol | <code>string</code> | Yes | unified market symbol of the market orders were made in |
| since | <code>int</code> | No | the earliest time in ms to fetch orders for |
| limit | <code>int</code> | No | the maximum number of order structures to retrieve |
| params | <code>object</code> | No | extra parameters specific to the exchange API endpoint |
| params.owner | <code>string</code> | No | the wallet address to fetch orders for |


```javascript
cow.fetchClosedOrders (symbol[, since, limit, params])
```


<a name="fetchCanceledOrders" id="fetchcanceledorders"></a>

### fetchCanceledOrders{docsify-ignore}
fetches information on multiple canceled orders made by the user

**Kind**: instance method of [<code>cow</code>](#cow)  
**Returns**: <code>Array&lt;Order&gt;</code> - a list of [order structures](https://docs.ccxt.com/#/?id=order-structure)

**See**: https://docs.cow.fi/cow-protocol/reference/apis/orderbook  

| Param | Type | Required | Description |
| --- | --- | --- | --- |
| symbol | <code>string</code> | Yes | unified market symbol of the market orders were made in |
| since | <code>int</code> | No | the earliest time in ms to fetch orders for |
| limit | <code>int</code> | No | the maximum number of order structures to retrieve |
| params | <code>object</code> | No | extra parameters specific to the exchange API endpoint |
| params.owner | <code>string</code> | No | the wallet address to fetch orders for |


```javascript
cow.fetchCanceledOrders (symbol[, since, limit, params])
```


<a name="fetchBalance" id="fetchbalance"></a>

### fetchBalance{docsify-ignore}
query for balance and get the amount of funds available for trading or funds locked in orders

**Kind**: instance method of [<code>cow</code>](#cow)  
**Returns**: <code>object</code> - a [balance structure](https://docs.ccxt.com/#/?id=balance-structure)


| Param | Type | Required | Description |
| --- | --- | --- | --- |
| params | <code>object</code> | No | extra parameters specific to the exchange API endpoint |
| params.owner | <code>string</code> | No | the wallet address to query balance for |


```javascript
cow.fetchBalance ([params])
```


<a name="fetchMyTrades" id="fetchmytrades"></a>

### fetchMyTrades{docsify-ignore}
fetch all trades made by the user

**Kind**: instance method of [<code>cow</code>](#cow)  
**Returns**: <code>Array&lt;Trade&gt;</code> - a list of [trade structures](https://docs.ccxt.com/#/?id=trade-structure)

**See**: https://docs.cow.fi/cow-protocol/reference/apis/orderbook  

| Param | Type | Required | Description |
| --- | --- | --- | --- |
| symbol | <code>string</code> | Yes | unified market symbol |
| since | <code>int</code> | No | the earliest time in ms to fetch trades for |
| limit | <code>int</code> | No | the maximum number of trades structures to retrieve |
| params | <code>object</code> | No | extra parameters specific to the exchange API endpoint |
| params.owner | <code>string</code> | No | the wallet address to fetch trades for |


```javascript
cow.fetchMyTrades (symbol[, since, limit, params])
```


<a name="createOrder" id="createorder"></a>

### createOrder{docsify-ignore}
create a trade order on CoW Protocol

**Kind**: instance method of [<code>cow</code>](#cow)  
**Returns**: <code>object</code> - an [order structure](https://docs.ccxt.com/#/?id=order-structure)

**See**: https://docs.cow.fi/cow-protocol/reference/apis/orderbook  

| Param | Type | Required | Description |
| --- | --- | --- | --- |
| symbol | <code>string</code> | Yes | unified symbol of the market to create an order in |
| type | <code>string</code> | Yes | 'market' or 'limit' |
| side | <code>string</code> | Yes | 'buy' or 'sell' |
| amount | <code>float</code> | Yes | how much of currency you want to trade in units of base currency |
| price | <code>float</code> | No | the price at which the order is to be fulfilled, in units of the quote currency, ignored in market orders |
| params | <code>object</code> | No | extra parameters specific to the exchange API endpoint |
| params.validFor | <code>int</code> | No | order validity duration in seconds (default 30) |
| params.validTo | <code>int</code> | No | unix timestamp when the order expires |
| params.partiallyFillable | <code>bool</code> | No | whether the order can be partially filled (default false) |
| params.appData | <code>string</code> | No | app data for the order (32-byte hex string) |
| params.receiver | <code>string</code> | No | the address to receive the bought tokens (defaults to sender) |
| params.from | <code>string</code> | No | the address placing the order (defaults to walletAddress) |
| params.quoteRequest | <code>object</code> | No | override parameters for the quote request |


```javascript
cow.createOrder (symbol, type, side, amount[, price, params])
```


<a name="cancelOrder" id="cancelorder"></a>

### cancelOrder{docsify-ignore}
cancels an open order

**Kind**: instance method of [<code>cow</code>](#cow)  
**Returns**: <code>object</code> - An [order structure](https://docs.ccxt.com/#/?id=order-structure)

**See**: https://docs.cow.fi/cow-protocol/reference/apis/orderbook  

| Param | Type | Required | Description |
| --- | --- | --- | --- |
| id | <code>string</code> | Yes | order id (UID) |
| symbol | <code>string</code> | Yes | unified symbol of the market the order was made in |
| params | <code>object</code> | No | extra parameters specific to the exchange API endpoint |
| params.signingScheme | <code>string</code> | No | 'eip712' or 'ethsign' (default 'eip712') |


```javascript
cow.cancelOrder (id, symbol[, params])
```


<a name="cancelAllOrders" id="cancelallorders"></a>

### cancelAllOrders{docsify-ignore}
cancel all open orders

**Kind**: instance method of [<code>cow</code>](#cow)  
**Returns**: <code>Array&lt;object&gt;</code> - a list of [order structures](https://docs.ccxt.com/#/?id=order-structure)

**See**: https://docs.cow.fi/cow-protocol/reference/apis/orderbook  

| Param | Type | Required | Description |
| --- | --- | --- | --- |
| symbol | <code>string</code> | Yes | unified market symbol, only orders in the market of this symbol are cancelled when symbol is not undefined |
| params | <code>object</code> | No | extra parameters specific to the exchange API endpoint |
| params.owner | <code>string</code> | No | the wallet address to cancel orders for |
| params.signingScheme | <code>string</code> | No | 'eip712' or 'ethsign' (default 'eip712') |


```javascript
cow.cancelAllOrders (symbol[, params])
```


<a name="compareQuoteWithOtherExchanges" id="comparequotewithotherexchanges"></a>

### compareQuoteWithOtherExchanges{docsify-ignore}
get a quote from CoW Protocol and compare it with quotes from other exchanges

**Kind**: instance method of [<code>cow</code>](#cow)  
**Returns**: <code>object</code> - a comparison object with CoW quote and other exchange quotes

**See**: https://docs.cow.fi/cow-protocol/reference/apis/orderbook  

| Param | Type | Required | Description |
| --- | --- | --- | --- |
| symbol | <code>string</code> | Yes | unified market symbol |
| amount | <code>float</code> | Yes | the amount of base currency to trade |
| otherExchanges | <code>Array&lt;object&gt;</code> | Yes | array of exchange instances to compare quotes with |
| params | <code>object</code> | No | extra parameters specific to the exchange API endpoint |
| params.receiver | <code>string</code> | No | the address to receive the bought tokens |
| params.from | <code>string</code> | No | the address placing the order |
| params.validFor | <code>int</code> | No | quote validity duration in seconds |


```javascript
cow.compareQuoteWithOtherExchanges (symbol, amount, otherExchanges[, params])
```


<a name="waitForOrder" id="waitfororder"></a>

### waitForOrder{docsify-ignore}
polls the exchange until an order reaches a terminal status

**Kind**: instance method of [<code>cow</code>](#cow)  
**Returns**: <code>object</code> - an [order structure](https://docs.ccxt.com/#/?id=order-structure)

**See**: https://docs.cow.fi/cow-protocol/reference/apis/orderbook  

| Param | Type | Required | Description |
| --- | --- | --- | --- |
| id | <code>string</code> | Yes | order id (UID) |
| symbol | <code>string</code> | Yes | unified market symbol |
| status | <code>string</code> | No | specific status to wait for (defaults to any terminal status) |
| params | <code>object</code> | No | extra parameters specific to the exchange API endpoint |
| params.pollingDelay | <code>int</code> | No | delay between polling requests in milliseconds (default 2000) |
| params.timeout | <code>int</code> | No | maximum time to wait in milliseconds (default 60000) |


```javascript
cow.waitForOrder (id, symbol[, status, params])
```


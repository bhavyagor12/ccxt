import Exchange from './abstract/cow.js';
import type { Balances, Dict, Int, Market, Order, OrderSide, OrderType, Str, Trade } from './base/types.js';
/**
 * @class cow
 * @augments Exchange
 */
export default class cow extends Exchange {
    describe(): any;
    resolveOrderbookBaseUrl(network?: Str, env?: Str): string;
    sign(path: any, api?: string, method?: string, params?: {}, headers?: any, body?: any): {
        url: string;
        method: string;
        body: any;
        headers: any;
    };
    /**
     * @method
     * @name cow#fetchMarkets
     * @description retrieves data on all markets for CoW Protocol
     * @see https://docs.cow.fi/cow-protocol/reference/apis/orderbook
     * @param {object} [params] extra parameters specific to the exchange API endpoint
     * @param {string} [params.tokenListUrl] override the default token list URL
     * @param {Array} [params.tokens] manually provide a token list instead of fetching
     * @param {Array} [params.quoteSymbols] override default quote symbols (USDC, USDT, DAI, WETH)
     * @param {int} [params.chainId] override the chain ID for filtering tokens
     * @returns {object[]} an array of objects representing market data
     */
    fetchMarkets(params?: {}): Promise<Market[]>;
    parseTrade(trade: Dict, market?: Market): Trade;
    parseOrderStatus(status: Str): string;
    convertTokenAmount(amount: Str, decimals: Str): string;
    parseOrder(order: Dict, market?: Market): Order;
    /**
     * @method
     * @name cow#fetchOrder
     * @description fetches information on an order made by the user
     * @see https://docs.cow.fi/cow-protocol/reference/apis/orderbook
     * @param {string} id order id (UID)
     * @param {string} symbol unified symbol of the market the order was made in
     * @param {object} [params] extra parameters specific to the exchange API endpoint
     * @returns {object} An [order structure](https://docs.ccxt.com/#/?id=order-structure)
     */
    fetchOrder(id: Str, symbol?: Str, params?: {}): Promise<Order>;
    /**
     * @method
     * @name cow#fetchOrders
     * @description fetches information on multiple orders made by the user
     * @see https://docs.cow.fi/cow-protocol/reference/apis/orderbook
     * @param {string} symbol unified market symbol of the market orders were made in
     * @param {int} [since] the earliest time in ms to fetch orders for
     * @param {int} [limit] the maximum number of order structures to retrieve
     * @param {object} [params] extra parameters specific to the exchange API endpoint
     * @param {string} [params.owner] the wallet address to fetch orders for
     * @returns {Order[]} a list of [order structures](https://docs.ccxt.com/#/?id=order-structure)
     */
    fetchOrders(symbol?: Str, since?: Int, limit?: Int, params?: {}): Promise<Order[]>;
    /**
     * @method
     * @name cow#fetchOpenOrders
     * @description fetch all unfilled currently open orders
     * @see https://docs.cow.fi/cow-protocol/reference/apis/orderbook
     * @param {string} symbol unified market symbol
     * @param {int} [since] the earliest time in ms to fetch open orders for
     * @param {int} [limit] the maximum number of open order structures to retrieve
     * @param {object} [params] extra parameters specific to the exchange API endpoint
     * @param {string} [params.owner] the wallet address to fetch orders for
     * @returns {Order[]} a list of [order structures](https://docs.ccxt.com/#/?id=order-structure)
     */
    fetchOpenOrders(symbol?: Str, since?: Int, limit?: Int, params?: {}): Promise<Order[]>;
    /**
     * @method
     * @name cow#fetchClosedOrders
     * @description fetches information on multiple closed orders made by the user
     * @see https://docs.cow.fi/cow-protocol/reference/apis/orderbook
     * @param {string} symbol unified market symbol of the market orders were made in
     * @param {int} [since] the earliest time in ms to fetch orders for
     * @param {int} [limit] the maximum number of order structures to retrieve
     * @param {object} [params] extra parameters specific to the exchange API endpoint
     * @param {string} [params.owner] the wallet address to fetch orders for
     * @returns {Order[]} a list of [order structures](https://docs.ccxt.com/#/?id=order-structure)
     */
    fetchClosedOrders(symbol?: Str, since?: Int, limit?: Int, params?: {}): Promise<Order[]>;
    /**
     * @method
     * @name cow#fetchCanceledOrders
     * @description fetches information on multiple canceled orders made by the user
     * @see https://docs.cow.fi/cow-protocol/reference/apis/orderbook
     * @param {string} symbol unified market symbol of the market orders were made in
     * @param {int} [since] the earliest time in ms to fetch orders for
     * @param {int} [limit] the maximum number of order structures to retrieve
     * @param {object} [params] extra parameters specific to the exchange API endpoint
     * @param {string} [params.owner] the wallet address to fetch orders for
     * @returns {Order[]} a list of [order structures](https://docs.ccxt.com/#/?id=order-structure)
     */
    fetchCanceledOrders(symbol?: Str, since?: Int, limit?: Int, params?: {}): Promise<Order[]>;
    /**
     * @method
     * @name cow#fetchBalance
     * @description query for balance and get the amount of funds available for trading or funds locked in orders
     * @param {object} [params] extra parameters specific to the exchange API endpoint
     * @param {string} [params.owner] the wallet address to query balance for
     * @returns {object} a [balance structure](https://docs.ccxt.com/#/?id=balance-structure)
     */
    fetchBalance(params?: {}): Promise<Balances>;
    /**
     * @method
     * @name cow#fetchMyTrades
     * @description fetch all trades made by the user
     * @see https://docs.cow.fi/cow-protocol/reference/apis/orderbook
     * @param {string} symbol unified market symbol
     * @param {int} [since] the earliest time in ms to fetch trades for
     * @param {int} [limit] the maximum number of trades structures to retrieve
     * @param {object} [params] extra parameters specific to the exchange API endpoint
     * @param {string} [params.owner] the wallet address to fetch trades for
     * @returns {Trade[]} a list of [trade structures](https://docs.ccxt.com/#/?id=trade-structure)
     */
    fetchMyTrades(symbol?: Str, since?: Int, limit?: Int, params?: {}): Promise<Trade[]>;
    /**
     * @method
     * @name cow#createOrder
     * @description create a trade order on CoW Protocol
     * @see https://docs.cow.fi/cow-protocol/reference/apis/orderbook
     * @param {string} symbol unified symbol of the market to create an order in
     * @param {string} type 'market' or 'limit'
     * @param {string} side 'buy' or 'sell'
     * @param {float} amount how much of currency you want to trade in units of base currency
     * @param {float} [price] the price at which the order is to be fulfilled, in units of the quote currency, ignored in market orders
     * @param {object} [params] extra parameters specific to the exchange API endpoint
     * @param {int} [params.validFor] order validity duration in seconds (default 30)
     * @param {int} [params.validTo] unix timestamp when the order expires
     * @param {bool} [params.partiallyFillable] whether the order can be partially filled (default false)
     * @param {string} [params.appData] app data for the order (32-byte hex string)
     * @param {string} [params.receiver] the address to receive the bought tokens (defaults to sender)
     * @param {string} [params.from] the address placing the order (defaults to walletAddress)
     * @param {object} [params.quoteRequest] override parameters for the quote request
     * @returns {object} an [order structure](https://docs.ccxt.com/#/?id=order-structure)
     */
    createOrder(symbol: string, type: OrderType, side: OrderSide, amount: number, price?: number, params?: {}): Promise<Order>;
    /**
     * @method
     * @name cow#cancelOrder
     * @description cancels an open order
     * @see https://docs.cow.fi/cow-protocol/reference/apis/orderbook
     * @param {string} id order id (UID)
     * @param {string} symbol unified symbol of the market the order was made in
     * @param {object} [params] extra parameters specific to the exchange API endpoint
     * @param {string} [params.signingScheme] 'eip712' or 'ethsign' (default 'eip712')
     * @returns {object} An [order structure](https://docs.ccxt.com/#/?id=order-structure)
     */
    cancelOrder(id: string, symbol?: Str, params?: {}): Promise<Order>;
    /**
     * @method
     * @name cow#cancelAllOrders
     * @description cancel all open orders
     * @see https://docs.cow.fi/cow-protocol/reference/apis/orderbook
     * @param {string} symbol unified market symbol, only orders in the market of this symbol are cancelled when symbol is not undefined
     * @param {object} [params] extra parameters specific to the exchange API endpoint
     * @param {string} [params.owner] the wallet address to cancel orders for
     * @param {string} [params.signingScheme] 'eip712' or 'ethsign' (default 'eip712')
     * @returns {object[]} a list of [order structures](https://docs.ccxt.com/#/?id=order-structure)
     */
    cancelAllOrders(symbol?: Str, params?: {}): Promise<Order[]>;
    ensureOwnerAddress(params?: Dict): any[];
    hexWith0xPrefix(value: Str): Str;
    addressWith0xPrefix(value: Str): Str;
    normalizePrivateKey(privateKey: Str): Str;
    deriveWalletAddressFromPrivateKey(): Str;
    amountToTokenAmount(amountString: Str, decimals: Str): Str;
    getChainIdOption(): number;
    getVerifyingContractOption(): string;
    getVaultRelayerOption(): string;
    getRpcUrlOption(): string;
    fetchERC20Balance(tokenAddress: Str, ownerAddress: Str): Promise<string>;
    checkERC20Allowance(tokenAddress: Str, ownerAddress: Str, spenderAddress: Str): Promise<string>;
    approveERC20(tokenAddress: Str, spenderAddress: Str, amount?: Str): Promise<{
        txHash: string;
        token: string;
        spender: string;
        amount: string;
    }>;
    encodeRLPItem(value: string): string;
    encodeRLP(fields: any[]): string;
    computeTypedDataDigest(domain: Dict, types: Dict, message: Dict): any;
    hashEthereumSignedMessage(messageHex: Str): string;
    signDigest(digest: Str, privateKey: Str, usePersonalSign?: boolean): string;
    signOrderPayload(order: Dict, signingScheme?: Str): string;
    signOrderCancellation(orderUids: Str[], signingScheme?: Str): string;
    /**
     * @method
     * @name cow#compareQuoteWithOtherExchanges
     * @description get a quote from CoW Protocol and compare it with quotes from other exchanges
     * @see https://docs.cow.fi/cow-protocol/reference/apis/orderbook
     * @param {string} symbol unified market symbol
     * @param {float} amount the amount of base currency to trade
     * @param {object[]} otherExchanges array of exchange instances to compare quotes with
     * @param {object} [params] extra parameters specific to the exchange API endpoint
     * @param {string} [params.receiver] the address to receive the bought tokens
     * @param {string} [params.from] the address placing the order
     * @param {int} [params.validFor] quote validity duration in seconds
     * @returns {object} a comparison object with CoW quote and other exchange quotes
     */
    compareQuoteWithOtherExchanges(symbol: Str, amount: number, otherExchanges?: any[], params?: {}): Promise<{
        symbol: string;
        amount: number;
        price: number;
        buyAmount: number;
        sellAmount: number;
        fee: number;
        info: any;
        comparisons: any[];
    }>;
    /**
     * @method
     * @name cow#waitForOrder
     * @description polls the exchange until an order reaches a terminal status
     * @see https://docs.cow.fi/cow-protocol/reference/apis/orderbook
     * @param {string} id order id (UID)
     * @param {string} symbol unified market symbol
     * @param {string} [status] specific status to wait for (defaults to any terminal status)
     * @param {object} [params] extra parameters specific to the exchange API endpoint
     * @param {int} [params.pollingDelay] delay between polling requests in milliseconds (default 2000)
     * @param {int} [params.timeout] maximum time to wait in milliseconds (default 60000)
     * @returns {object} an [order structure](https://docs.ccxt.com/#/?id=order-structure)
     */
    waitForOrder(id: Str, symbol?: Str, status?: Str, params?: {}): Promise<Order>;
    handleErrors(httpCode: Int, reason: string, url: string, method: string, headers: Dict, body: string, response: any, requestHeaders: any, requestBody: any): void;
}

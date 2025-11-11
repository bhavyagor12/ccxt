import Exchange from './abstract/cow.js';
import type { Dict, Int, Market, Order, OrderSide, OrderType, Str, Trade } from './base/types.js';
/**
 * @class cow
 * @augments Exchange
 */
export default class cow extends Exchange {
    describe(): any;
    resolveOrderbookBaseUrl(network?: Str, env?: Str): string;
    sign(path: any, api?: Str, method?: string, params?: {}, headers?: any, body?: any): {
        url: string;
        method: string;
        body: any;
        headers: any;
    };
    fetchMarkets(params?: {}): Promise<Market[]>;
    parseTrade(trade: Dict, market?: Market): Trade;
    parseOrderStatus(status: Str): string;
    convertTokenAmount(amount: Str, decimals: Str): string;
    parseOrder(order: Dict, market?: Market): Order;
    fetchOrder(id: Str, symbol?: Str, params?: {}): Promise<Order>;
    fetchOrders(symbol?: Str, since?: Int, limit?: Int, params?: {}): Promise<Order[]>;
    fetchOpenOrders(symbol?: Str, since?: Int, limit?: Int, params?: {}): Promise<Order[]>;
    fetchMyTrades(symbol?: Str, since?: Int, limit?: Int, params?: {}): Promise<Trade[]>;
    createOrder(symbol: string, type: OrderType, side: OrderSide, amount: number, price?: number, params?: {}): Promise<Order>;
    cancelOrder(id: string, symbol?: Str, params?: {}): Promise<Order>;
    ensureOwnerAddress(params?: Dict): any[];
    hexWith0xPrefix(value: Str): Str;
    addressWith0xPrefix(value: Str): Str;
    normalizePrivateKey(privateKey: Str): Str;
    amountToTokenAmount(amountString: Str, decimals: Str): Str;
    orderKindToEnum(kind: Str): number;
    orderBalanceToEnum(balance: Str): number;
    getChainIdOption(): number;
    getVerifyingContractOption(): string;
    computeTypedDataDigest(domain: Dict, types: Dict, message: Dict): string;
    padHex(hexString: Str, length?: number): any;
    signDigest(digest: Str, privateKey: Str): string;
    signOrderPayload(order: Dict): string;
    signOrderCancellation(orderUid: Str): string;
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
    waitForOrder(id: Str, symbol?: Str, status?: Str, params?: {}): Promise<Order>;
    handleErrors(httpCode: Int, reason: string, url: string, method: string, headers: Dict, body: string, response: any, requestHeaders: any, requestBody: any): void;
}

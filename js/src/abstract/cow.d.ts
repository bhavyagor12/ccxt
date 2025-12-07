import { implicitReturnType } from '../base/types.js';
import { Exchange as _Exchange } from '../base/Exchange.js';
interface Exchange {
    publicGetApiV1OrdersUid(params?: {}): Promise<implicitReturnType>;
    publicGetApiV1Trades(params?: {}): Promise<implicitReturnType>;
    publicGetApiV1AccountOwnerOrders(params?: {}): Promise<implicitReturnType>;
    publicPostApiV1Quote(params?: {}): Promise<implicitReturnType>;
    publicPostApiV1Orders(params?: {}): Promise<implicitReturnType>;
    publicDeleteApiV1Orders(params?: {}): Promise<implicitReturnType>;
}
declare abstract class Exchange extends _Exchange {
}
export default Exchange;

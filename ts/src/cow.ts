// ---------------------------------------------------------------------------

import Exchange from './abstract/cow.js';
import { TICK_SIZE } from './base/functions/number.js';

/**
 * @class cow
 * @augments Exchange
 */
export default class cow extends Exchange {
    describe (): any {
        return this.deepExtend (super.describe (), {
            'id': 'cow',
            'name': 'CoW Protocol (Order Book API)',
            'countries': [],
            'rateLimit': 100,
            'has': {
                'spot': true,
                'createOrder': true,      // POST /orders (signed body)
                'cancelOrder': true,      // DELETE /orders (signed body)
                'fetchOrder': true,       // GET /orders/{uid}
                'fetchMyTrades': true,    // GET /trades?owner=... | orderUid=...
                // explicitly not supported by CoW:
                'fetchTicker': false,
                'fetchTickers': false,
                'fetchOrderBook': false,
                'fetchTrades': false,
                'fetchBalance': false,
            },
            'urls': {
                // CCXT will pass this into your sign() – compute the real base there
                'api': 'https://api.cow.fi',
                'www': 'https://cow.fi',
                'doc': 'https://docs.cow.fi/cow-protocol/reference/apis/orderbook',
            },
            // CCXT’s implicit API generator wants this “api” map:
            'api': {
                'public': {
                    'get': [
                        'api/v1/orders/{uid}',
                        'api/v1/trades',
                        'api/v1/account/{owner}/orders',
                    ],
                    'post': [ 'api/v1/quote', 'api/v1/orders' ],
                    'delete': [ 'api/v1/orders' ],
                },
            },
            'options': {
                // You can override these from user code: new ccxt.cow({ options: { network: 'base', env: 'prod' }})
                'network': 'mainnet', // 'mainnet' | 'xdai' | 'arbitrum_one' | 'base' | 'sepolia'
                'env': 'prod',        // 'prod' | 'barn'
            },
            'precisionMode': TICK_SIZE,
        });
    }
}


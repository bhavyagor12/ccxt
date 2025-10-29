from ccxt.base.types import Entry


class ImplicitAPI:
    public_get_api_v1_orders_uid = publicGetApiV1OrdersUid = Entry('api/v1/orders/{uid}', 'public', 'GET', {})
    public_get_api_v1_trades = publicGetApiV1Trades = Entry('api/v1/trades', 'public', 'GET', {})
    public_get_api_v1_account_owner_orders = publicGetApiV1AccountOwnerOrders = Entry('api/v1/account/{owner}/orders', 'public', 'GET', {})
    public_post_api_v1_quote = publicPostApiV1Quote = Entry('api/v1/quote', 'public', 'POST', {})
    public_post_api_v1_orders = publicPostApiV1Orders = Entry('api/v1/orders', 'public', 'POST', {})
    public_delete_api_v1_orders = publicDeleteApiV1Orders = Entry('api/v1/orders', 'public', 'DELETE', {})

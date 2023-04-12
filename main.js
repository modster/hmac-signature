const axios = require('axios');
const crypto = require('crypto');
const qs = require('qs');

const binanceConfig = {
  API_KEY: '2UbVsabP55P9MpYGuUPAFmwutXW1qQ6MtWCUcVNklpB8syGrMPBF9LGYsRAzWR2c',
  API_SECRET: 'FQ9P6iauHnJ1CNPnyxj9IqrXDsvsad41V33jX3Nq5nElHPlE62bJ9yEZnqjA7v5L',
  HOST_URL: 'https://testnet.binance.vision',
};

const buildSign = (data, config) => {
  return crypto.createHmac('sha256', config.API_SECRET).update(data).digest('hex');
};

const privateRequest = async (data, endPoint, type) => {
  const dataQueryString = qs.stringify(data);
  const signature = buildSign(dataQueryString, binanceConfig);
  const requestConfig = {
    method: type,
    url: binanceConfig.HOST_URL + endPoint + '?' + dataQueryString + '&signature=' + signature,
    headers: {
        'X-MBX-APIKEY': binanceConfig.API_KEY,
    },
  };

  try {
    console.log('URL: ', requestConfig.url);
    const response = await axios(requestConfig);
    console.log(response.data);
    return response;
  }
  catch (err) {
    console.log(err);
    return err;
  }
};

const data = {
  symbol: 'BTCUSDT',
    side: 'BUY',
    type: 'LIMIT',
    timeInForce: 'GTC',
    quantity: 0.001,
    price: 10000.0,

  recvWindow: 20000,
  timestamp: Date.now(),
};

privateRequest(data, '/api/v3/order', 'POST');
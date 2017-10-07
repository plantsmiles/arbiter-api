module.exports = exports = {
  port: process.env.PORT || 3000,
  cacheTTL: process.env.CACHE_TTL || 10,
  tradingPairs: process.env.TRADING_PAIRS.indexOf(',') > -1 ? process.env.TRADING_PAIRS.split(',') : [process.env.TRADING_PAIRS] || ['BTC-ETH'],
  bittrexApiUrl: process.env.BITTREX_API_URL || 'https://bittrex.com/api/v1.1'
};
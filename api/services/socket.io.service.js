const logger = require('../util/logger');
const bittrexService = require('../services/bittrex.service');
const poloniexService = require('../services/poloniex.service');
const orderBookService = require('../services/order.book.service');

class SocketIoService {
    constructor() { }

    initialize(socketIo) {
        socketIo.on('connection', socket => {
            logger.info('SocketIo connection successful');
            bittrexService.on('update', async (tradingPair) => {
                logger.info(`Sending update from Bittrex for ${tradingPair} via socketIo`);
                const updatedOrderBook = await orderBookService.combineOrderBooks(tradingPair);
                socket.emit(tradingPair, updatedOrderBook);
            });

            poloniexService.on('update', async (tradingPair) => {
                logger.info(`Sending update from Poloniex for ${tradingPair} via socketIo`);
                const updatedOrderBook = await orderBookService.combineOrderBooks(tradingPair);
                socket.emit(tradingPair, updatedOrderBook);
            });
        });

        socketIo.on('connection', socket => {
            logger.info('SocketIo connection successful');
            bittrexService.on('update', async (tradingPair) => {
                logger.info(`Sending update from Bittrex for ${tradingPair} via socketIo`);
                const updatedOrderBook = await orderBookService.combineOrderBooks(tradingPair);
                socket.emit(tradingPair, updatedOrderBook);
            });

            poloniexService.on('update', async (tradingPair) => {
                logger.info(`Sending update from Poloniex for ${tradingPair} via socketIo`);
                const updatedOrderBook = await orderBookService.combineOrderBooks(tradingPair);
                socket.emit(tradingPair, updatedOrderBook);
            });
        });
    }
}

module.exports = exports = new SocketIoService();
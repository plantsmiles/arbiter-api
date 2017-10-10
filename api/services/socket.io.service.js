const logger = require('../util/logger');
const bittrexService = require('../services/bittrex.service');
const poloniexService = require('../services/poloniex.service');
const orderBookService = require('../services/order.book.service');

class SocketIoService {
    constructor() { }

    initialize(socketIo) {
        socketIo.on('connection', socket => {
            logger.info('SocketIo connection successful');
            socket.on('subscribe', (tradingPair) => {
                logger.info(`Subscribing to ${tradingPair}`);
                bittrexService.on('update', async (tradingPair) => {
                    const updatedOrderBook = await orderBookService.combineOrderBooks(tradingPair);
                    socket.to(socket.id).emit(tradingPair, updatedOrderBook);
                });

                poloniexService.on('update', async (tradingPair) => {
                    const updatedOrderBook = await orderBookService.combineOrderBooks(tradingPair);
                    socket.to(socket.id).emit(tradingPair, updatedOrderBook);
                });
            });
        });
    }
}

module.exports = exports = new SocketIoService();
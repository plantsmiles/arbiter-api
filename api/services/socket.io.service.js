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
                bittrexService.on('update', async (tradingPair) => {
                    logger.info(`Sending update from Bittrex for ${tradingPair} via socketIo`);
                    const updatedOrderBook = await orderBookService.combineOrderBooks(tradingPair);
                    socket.to(socket.id).emit(tradingPair, updatedOrderBook);
                });

                poloniexService.on('update', async (tradingPair) => {
                    logger.info(`Sending update from Poloniex for ${tradingPair} via socketIo`);
                    const updatedOrderBook = await orderBookService.combineOrderBooks(tradingPair);
                    socket.to(socket.id).emit(tradingPair, updatedOrderBook);
                });
            });

            socket.on('unsubscribe', (tradingPair) => {
                bittrexService.removeListener(tradingPair);
                poloniexService.removeListener(tradingPair);
            });
        });

        socketIo.on('disconnect', () => {

        });
    }
}

module.exports = exports = new SocketIoService();
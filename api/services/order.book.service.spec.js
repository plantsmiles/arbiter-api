require('dotenv').config();

describe('OrderBookService', () => {
    describe('combineOrderBooks', () => {
        let orderBookService;

        beforeEach('get fresh service', () => {
            orderBookService = require('./order.book.service');
        });

        afterEach('destroy service', () => {
            orderBookService = undefined;
        });

        it('should combine orderBook', async () => {
            const exchangeOrderBook = {asks: [[0.005, 23]], bids: [[0.001, 2]]};
            const tradingPair = 'BTC-ETH';

            let bittrexServiceStub = sinon.stub().resolves(exchangeOrderBook);
            let poloniexServiceStub = sinon.stub().resolves(exchangeOrderBook);

            orderBookService.bittrexService.getOrderBook = bittrexServiceStub;
            orderBookService.poloniexService.getOrderBook = poloniexServiceStub;

            const result = await orderBookService.combineOrderBooks(tradingPair);

            expect(bittrexServiceStub).to.have.been.calledOnce;
            expect(poloniexServiceStub).to.have.been.calledOnce;

            expect(result.asks.length).to.equal(1);
            expect(result.asks[0].asks).to.equal(0.005);
            expect(result.asks[0].bittrexVolume).to.equal(Number(23).toFixed(5));
            expect(result.asks[0].poloniexVolume).to.equal(Number(23).toFixed(5));
            expect(result.asks[0].totalVolume).to.equal(Number(46).toFixed(5));
            expect(result.asks[0].overlap).to.equal(true);

            expect(result.bids.length).to.equal(1);
            expect(result.bids[0].bids).to.equal(0.001);
            expect(result.bids[0].bittrexVolume).to.equal(Number(2).toFixed(5));
            expect(result.bids[0].poloniexVolume).to.equal(Number(2).toFixed(5));
            expect(result.bids[0].totalVolume).to.equal(Number(4).toFixed(5));
            expect(result.bids[0].overlap).to.equal(true);
        });
    });
});
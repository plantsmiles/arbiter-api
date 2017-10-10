require('dotenv').config();

describe('PoloniexService', () => {

    describe('Constructor', () => {
        let poloniexService;

        beforeEach('get fresh service', () => {
            poloniexService = require('./poloniex.service');
        });

        afterEach('destroy service', () => {
            poloniexService = undefined;
        });

        it('should be created with three properties', () => {
            expect(poloniexService.exchangeName).to.equal('Poloniex');
            expect(poloniexService.exchangeMap).to.be.an('map');
        });

    });

    describe('updateOrderBook', () => {
        let poloniexService;

        beforeEach('get fresh service', () => {
            poloniexService = require('./poloniex.service');
        });

        afterEach('destroy service', () => {
            poloniexService = undefined;
        });

        it('should retrieve orderBook', async () => {
            const poloniexApiResponse = {asks: [[0.005, 23]], bids: [[0.001, 2]]};
            const tradingPair = 'BTC-ETH';

            let poloniexApiStub = sinon.stub().resolves(poloniexApiResponse);
            let waitAndRefreshStub = sinon.stub(poloniexService, '_waitAndRefresh').resolves({});

            poloniexService.poloniexApi.returnOrderBook = poloniexApiStub;
            poloniexService._waitAndRefresh = waitAndRefreshStub;

            await poloniexService.updateOrderBook(tradingPair);

            expect(poloniexApiStub).to.have.been.calledOnce;
            expect(poloniexService.exchangeMap.get(tradingPair).asks.length).to.equal(1);
            expect(poloniexService.exchangeMap.get(tradingPair).bids.length).to.equal(1);

            waitAndRefreshStub.restore();
        });
    });
});
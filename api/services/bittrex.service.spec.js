require('dotenv').config();

const requestPromise = require('request-promise');
const queryString = require('query-string');

describe('BittrexService', () => {

    describe('Constructor', () => {
        let bittrexService;

        beforeEach('get fresh service', () => {
            bittrexService = require('./bittrex.service');
        });

        afterEach('destroy service', () => {
           bittrexService = undefined;
        });

        it('should be created with three properties', () => {
            expect(bittrexService.exchangeName).to.equal('Bittrex');
            expect(bittrexService.exchangeMap).to.be.an('map');
        });

    });

    describe('updateOrderBook', () => {
        let bittrexService;

        beforeEach('get fresh service', () => {
            bittrexService = require('./bittrex.service');
        });

        afterEach('destroy service', () => {
            bittrexService = undefined;
        });

        it('should retrieve orderBook', async () => {
            const apiResponse =`{"success":true,"message":"","result":{"buy":[{"Quantity":33.3,"Rate":0.06234507}], "sell":[{"Quantity":1,"Rate":0.06234507}]}}`;
            const tradingPair = 'BTC-ETH';

            let requestPromiseStub = sinon.stub().resolves(apiResponse);
            let waitAndRefreshStub = sinon.stub(bittrexService, '_waitAndRefresh').resolves({});

            bittrexService.requestPromise = requestPromiseStub;
            bittrexService._waitAndRefresh = waitAndRefreshStub;

            await bittrexService.updateOrderBook(tradingPair);

            expect(requestPromiseStub).to.have.been.calledOnce;
            expect(bittrexService.exchangeMap.get(tradingPair).asks.length).to.equal(1);
            expect(bittrexService.exchangeMap.get(tradingPair).bids.length).to.equal(1);

            waitAndRefreshStub.restore();
        });
    });

});
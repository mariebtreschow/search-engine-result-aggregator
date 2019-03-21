const _ = require('lodash');
const assert = require('chai').assert;

const aggregator = require('../aggregator.js');

describe('Should be able to extract title and url from google and yahoo search enginge result', () => {

    it('should only be able to search for google and yahoo', (done) => {
        let array = ['google', 'yahoo'];
        assert.isTrue(aggregator.validateSearchEngines(array));
        done();
    });

    it('should only be able to search for google and yahoo not bing', (done) => {
        let array = ['bing', 'yahoo'];
        assert.isFalse(aggregator.validateSearchEngines(array));
        done();
    });

    it('should only be able to search for google and yahoo not bing', (done) => {
        let string = 'horse';
        assert.isTrue(aggregator.validateKeyword(string));
        done();
    });

    it('should be able to get a response from google and yahoo only', (done) => {
        aggregator.search(['Google', 'Yahoo'], 'Horse').then((results) => {
            _.each(results, (result) => {
                assert.property(result, 'title');
                assert.property(result, 'source');
                assert.property(result, 'url');
                assert.isArray(result.source);
                assert.isObject(result);
            });
            assert.isArray(results);
            done();
        });
    }).timeout(10000);
});

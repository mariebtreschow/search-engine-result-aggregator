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
    it('should be able to get a response from google and yahoo for keyword Horse', (done) => {
        aggregator.search(['Google', 'Yahoo'], 'Horse').then((results) => {
            const unique = [...new Set(results.map(item => item.url))];
            assert.isTrue(unique.length === results.length, 'list of results should only have unique values');
            _.each(results, (result) => {
                assert.property(result, 'title', 'should include title');
                assert.property(result, 'source', 'should include source');
                assert.property(result, 'url', 'should include url');
                assert.isArray(result.source, 'source should be an array');
                assert.isObject(result, 'each result is an object');
            });
            assert.isArray(results, 'list of results must be in an array');
            done();
        });
    }).timeout(10000);
    it('should be able to get a response from google and yahoo for keyword Amsterdam', (done) => {
        aggregator.search(['Google', 'Yahoo'], 'Amsterdam').then((results) => {
            const unique = [...new Set(results.map(item => item.url))];
            assert.isTrue(unique.length === results.length, 'list of results should only have unique values');
            _.each(results, (result) => {
                assert.property(result, 'title', 'should include title');
                assert.property(result, 'source', 'should include source');
                assert.property(result, 'url', 'should include url');
                assert.isArray(result.source, 'source should be an array');
                assert.isObject(result, 'each result is an object');
            });
            assert.isArray(results, 'list of results must be in an array');
            done();
        });
    }).timeout(10000);
});

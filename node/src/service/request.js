const cheerio = require('cheerio');
const request = require('request-promise');

const requestSearchEngine = (url, query) => new Promise((resolve, reject) => {
    const options = {
        uri: url + query,
        resolveWithFullResponse: true,
        transform: (body) => (cheerio.load(body))
    }
    return request(options).then(($) => {
        resolve($);
    }).catch((error) => {
        reject(error);
    });
});

module.exports = {
    requestSearchEngine
}

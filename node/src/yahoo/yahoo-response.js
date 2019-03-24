const { requestSearchEngine } = require('../service/request.js');
const { refactorSearchEngineResponse, addElement } = require('../utils/parser.js');

const YAHOO_BASE_URL = 'https://search.yahoo.com/search?q=';

const getYahooResponse = (query) => new Promise((resolve, reject) => {
    let titles = [];
    let urls = [];
    requestSearchEngine(YAHOO_BASE_URL, query).then(($) => {
        $('h3').map((_,title) => {
            titles.push(addElement($(title).text(), 'Yahoo'));
         });
        $('h3').find('a').each((index, link) => {
            urls.push($(link).attr('href'));
        });
        resolve(refactorSearchEngineResponse(titles, urls));
     }).catch((error) => {
        reject(error);
    });
});

module.exports = {
    getYahooResponse
}

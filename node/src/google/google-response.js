const { requestSearchEngine } = require('../service/request.js');
const { refactorSearchEngineResponse, addElement } = require('../utils/parser.js');

const GOOGLE_BASE_URL = 'https://www.google.com/search?q=';

const getGoogleResponse = (query) => new Promise((resolve, reject) => {
    let titles = [];
    let urls = [];
    requestSearchEngine(GOOGLE_BASE_URL, query).then(($) => {
        $('h3').map((_,title) => {
            titles.push(addElement($(title).text(), 'Google'));
         });
        $('cite').map((_,url) => {
            urls.push($(url).text());
        });
        resolve(refactorSearchEngineResponse(titles, urls));
    }).catch((error) => {
        reject(error);
    });
});

module.exports = {
    getGoogleResponse
}

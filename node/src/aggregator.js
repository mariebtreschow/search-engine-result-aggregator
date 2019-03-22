const _ = require('lodash');
const cheerio = require('cheerio');
const request = require('request-promise');

const VALID_SEARCH_ENGINES = ['google', 'yahoo'];
const GOOGLE_BASE_URL = 'https://www.google.com/search?q=';
const YAHOO_BASE_URL = 'https://search.yahoo.com/search?q=';
const HTTP = 'http';

const validateSearchEngines = searchEngines => {
    let isValid = true;
    if (searchEngines.length > 2) {
        isValid = false;
    }
    searchEngines.forEach((engine) => {
        if ((typeof engine !== 'string') || !VALID_SEARCH_ENGINES.includes(engine.toLowerCase())) {
            isValid = false;
        }
    });
    return isValid;
};

const validateKeyword = keyword => {
    return typeof keyword === 'string';
};

const addElement = (title, source, url) => {
    return {title: title, url: url, source: [source]};
};

const refactorSearchEngineResponse = (titles, urls) => {
    return titles.map((value, index) => {
        if (value.url === undefined && urls[index]) {
            let url = urls[index]
            return {...value, url};
        }
    });
};

const getGoogleResponse = query => new Promise((resolve, reject) => {
    const options = {
        uri: GOOGLE_BASE_URL + query,
        resolveWithFullResponse: true,
        transform: (body) => {
            return cheerio.load(body);
        }
    };
    return request(options).then(($) => {
        let titles = [];
        let urls = [];
        $('h3').map((_,title) => {
            let t = $(title).text();
            titles.push(addElement(t, 'Google'));
         });
        $('cite').map((_,url) => {
            let u = $(url).text();
            urls.push(u);
        });
         resolve(refactorSearchEngineResponse(titles, urls));
    }).catch((error) => {
        reject(error);
    });
});

const getYahooResponse = query => new Promise((resolve, reject) => {
    const options = {
        uri: YAHOO_BASE_URL + query,
        resolveWithFullResponse: true,
        transform: (body) => {
            return cheerio.load(body);
        }
    };
    return request(options).then(($) => {
        let titles = [];
        let urls = [];
        $('h3').map((_,title) => {
            let t = $(title).text();
            titles.push(addElement(t, 'Yahoo'));
         });
        $('h3').find('a').each((index, link) => {
            let u = $(link).attr("href");
            urls.push(u);
        });
        resolve(refactorSearchEngineResponse(titles, urls));
     }).catch((error) => {
        reject(error);
    });
});

const findDuplicatedUrls = arrayOfTitles => {
    let duplicatedUrls = [];
    var report = arrayOfTitles.reduce((obj, b) => {
      obj[b] = ++obj[b] || 1;
      return obj;
    }, {});
     _.filter(report, (values, key) => {
        if (values > 1) {
            duplicatedUrls.push(key);
        }
    });
    return duplicatedUrls;
};

// TODO: simplify
const parseAndRemoveDuplicatedResults = arrays => {
    let google = arrays[0];
    let yahoo = arrays[1];

    let combinedResult = _.compact(google.concat(yahoo));
    let urlsOnly = combinedResult.map(item => item.url);
    let duplicatedUrls = findDuplicatedUrls(urlsOnly);
    let foundIndexes = [];

    duplicatedUrls.forEach((url) => {
        foundIndexes.push(_.findIndex(combinedResult, ['url', url]));
    });
    foundIndexes.forEach((i) => {
        combinedResult.splice(i, 1);
    });
    combinedResult.forEach((result) => {
        duplicatedUrls.forEach((url) => {
            if (result.url === url) {
                let engine = (result.source[0] === 'Yahoo' ? 'Google' : 'Yahoo'); // fix this - hardcoded
                result.source.push(engine);
            }
        });
    });
    return combinedResult;
};

const search = ( searchEngines, keyword ) => {
    if (validateSearchEngines(searchEngines) && validateKeyword(keyword)) {
        let search = searchEngines.map(engine => engine.toLowerCase());
        const promises  = [];
        if (search.includes('google')) {
            promises.push(getGoogleResponse(keyword))
        }
        if (search.includes('yahoo')) {
            promises.push(getYahooResponse(keyword))
        }
        return Promise.all(promises).then((values) => {
            return parseAndRemoveDuplicatedResults(values);
        });
    } else {
        return Promise.reject({
            error: 'Validation error',
            message: 'Not a valid search engine or keyword was not a string'
        });
    }
}

module.exports = {
    validateKeyword,
    validateSearchEngines,
    search,
};

const _ = require('lodash');
const { getYahooResponse} = require('./yahoo/yahoo-response.js');
const { getGoogleResponse} = require('./google/google-response.js');

const VALID_SEARCH_ENGINES = ['google', 'yahoo'];

const validateSearchEngines = (searchEngines) => {
    let isValid = true;
    if (searchEngines.length > 2) {
        isValid = false;
    }
    searchEngines.forEach((engine) => {
        if ((typeof engine !== 'string')
        || !VALID_SEARCH_ENGINES.includes(engine.toLowerCase())) {
            isValid = false;
        }
    });
    return isValid;
};

const validateKeyword = (keyword) => (typeof keyword === 'string');

const findDuplicatedUrls = (urls) => {
    let duplicatedUrls = [];
    var report = urls.reduce((obj, b) => {
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

const parseAndRemoveDuplicatedResults = (arrays) => {
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
                let engine = (result.source[0] === 'Yahoo' ?
                 'Google' : 'Yahoo'); // fix this - hardcoded
                result.source.push(engine);
            }
        });
    });
    return combinedResult;
};

const search = (searchEngines, keyword) => {
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

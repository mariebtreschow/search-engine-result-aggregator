const _ = require('lodash');
const cheerio = require('cheerio');
const request = require('request-promise');

const VALID_SEARCH_ENGINES = ['google', 'yahoo'];
const HTTP = 'http';

const addElement = (title, source, url) => {
    return {title: title, url: url, source: [source]};
};

const getGoogleResponse = query => new Promise((resolve, reject) => {
    const options = {
        uri: `https://www.google.com/search?q=${query}`,
        resolveWithFullResponse: true,
        transform: function (body) {
            return cheerio.load(body);
        }
    };
    return request(options).then(($) => {
        let results = [];
        let urls = [];
        $('h3').map((_,title) => {
            let t = $(title).text();
            results.push(addElement(t, 'Google'));
         });
        $('cite').map((_,url) => {
            let u = $(url).text();
            urls.push(u);
        });
        results = results.map((value, index) => {
           if (value.url === undefined && urls[index]) {
               let url = urls[index]
              return {...value, url};
          }
          });
         resolve(results);
    }).catch((error) => {
        reject(error);
    });
});

const getYahooResponse = query => new Promise((resolve, reject) => {
    const options = {
        uri: `https://search.yahoo.com/search?q=${query}`,
        resolveWithFullResponse: true,
        transform: function (body) {
            return cheerio.load(body);
        }
    };
    return request(options).then(($) => {
        let results = [];
        let urls = [];
        $('h3').map((_,title) => {
            let t = $(title).text();
            results.push(addElement(t, 'Yahoo'));
         });
         $('a').map((_,url) => {
            let u = $(url).text();
            urls.push(u);
        });
        // TODO: get href link from a tag in span
        
         // results = results.map((value, index) => {
         //    if (value.url === undefined && urls[index]) {
         //        let url = urls[index]
         //       return {...value, url};
         //     }
         //  });
         resolve(results);
     }).catch((error) => {
        reject(error);
    });
});

const validateSearchEngines = searchEngines => {
    let isValid = true;
    if (searchEngines.length > 2) {
        isValid = false;
    }
    _.each(searchEngines, (engine) => {
        if (!_.isString(engine) || !_.includes(VALID_SEARCH_ENGINES, engine.toLowerCase())) {
            isValid = false;
        }
    });
    return isValid;
};

const validateKeyword = keyword => {
    return _.isString(keyword);
}

const findDuplicatedTitles = arrayOfTitles => {
    let duplicatedTitels = [];
    var report = arrayOfTitles.reduce(function(obj, b) {
      obj[b] = ++obj[b] || 1;
      return obj;
    }, {});
     _.filter(report, (values, key) => {
        if (values > 1) {
            duplicatedTitels.push(key);
        }
    });
    return duplicatedTitels;
}

const paresResponse = arrays => {
    let array1 = arrays[0];
    let array2 = arrays[1];

    let combinedResult = _.compact(array1.concat(array2));
    let getAllTitles = combinedResult.map(item => item.title);
    let duplicatedTitels = findDuplicatedTitles(getAllTitles);
    let foundIndexes = [];

    _.each(duplicatedTitels, (duplicatedTitle) => {
        foundIndexes.push(_.findIndex(combinedResult, ['title', duplicatedTitle]));
    });
    _.each(foundIndexes, (i) => {
        combinedResult.splice(i, 1);
    });
    _.each(combinedResult, (result) => {
        _.each(duplicatedTitels, (duplicatedTitle) => {
            if (result.title === duplicatedTitle) {
                let engine = (result.source[0] === 'Yahoo' ? 'Google' : 'Yahoo'); // TODO: hardcoded
                result.source.push(engine)
            }
        });
    });
    return combinedResult;
};

module.exports = {
    validateKeyword: validateKeyword,
    validateSearchEngines: validateSearchEngines,
    search: function(searchEngines, keyword) {

        if (validateSearchEngines(searchEngines) && validateKeyword(keyword)) {
            searchEngines = searchEngines.map(engine => engine.toLowerCase());
            const promises  = [];
            if (searchEngines.includes('google')) {
                promises.push(getGoogleResponse(keyword))
            }
            if (searchEngines.includes('yahoo')) {
                promises.push(getYahooResponse(keyword))
            }
            return Promise.all(promises).then((values) => {
                return paresResponse(values);
            });
        } else {
            reject('Not a valid search enginge or keyword');
        }

    }
}

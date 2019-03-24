
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

module.exports = {
    addElement,
    refactorSearchEngineResponse
}

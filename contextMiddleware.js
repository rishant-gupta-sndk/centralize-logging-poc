const { v4: uuidv4 } = require('uuid');
const { asyncLocalStorage } = require('./utilities/logger');

const contextMiddleware = (req, res, next) => {
    asyncLocalStorage.run({}, () => {
        const store = asyncLocalStorage.getStore();
        store.traceId = req.headers['x-trace-id'] || `${uuidv4()}`;
        store.user = req.headers['x-user'] || 'guest';
        store.path = req.path;
        preFetchBasicInfo(req, store);
        next();
    });
};

const preFetchBasicInfo = (req, store) => {
    //Todo: req find below basic field for trace the test processing.
    // store.testSummaryUniqueRef <= testSummaryUniqueRef || test_id || testId
}

module.exports = contextMiddleware;

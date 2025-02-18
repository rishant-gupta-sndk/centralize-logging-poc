const rootPath = process.cwd();
const { v4: uuidv4 } = require('uuid');
const { AsyncLocalStorage } = require('async_hooks');

const asyncLocalStorage = new AsyncLocalStorage();

function Logger(name, clazz) {
    this.clazz = clazz;
    if(!Logger.app) {
        Logger.app = name;
        Logger.init();
    }
}

Logger.init = function() {
    var bunyan = require('bunyan');
    Logger.logger = bunyan.createLogger({
        name: Logger.app,
        streams: [{
            type: 'rotating-file',
            path: rootPath + '/logs/' + Logger.app + "-info.log",
            period: '6h',
            count: 4
        }]
    });
}

/**
 * Extracts the caller function/method name from the stack trace.
 */
Logger.getCallerFunctionName = function () {
    const err = new Error();
    const stackLines = err.stack.split('\n');
    const callerLine = stackLines[3] || stackLines[2];
    const match = callerLine.match(/at (\S+)/);
    return match ? match[1] : 'UnknownFunction';
};

/**
 * Gets request-specific context.
 */
Logger.getContext = function () {
    return asyncLocalStorage.getStore() || {};
};

/**
 * Sets a value in the current request context.
 */
Logger.setContext = function (key, value) {
    const store = asyncLocalStorage.getStore();
    if (store) {
        store[key] = value;
    }
};

/**
 * Returns context headers for inter-microservice communication.
 */
Logger.getContextHeaders = function () {
    const context = Logger.getContext();
    return {
        'x-trace-id': context.traceId || `${uuidv4()}`,
        'x-user': context.user || 'guest',
        'x-trace-path': context.tracePath || '',
    };
};

Logger.prototype.info = function (log) {
    const methodName = Logger.getCallerFunctionName();
    const context = Logger.getContext();
    // Logger.logger.info({ context }, `[${this.clazz}::${methodName}]: ${log}`);
    Logger.logger.info({ ...context, class: this.clazz, method: methodName }, `${log}`);
};

Logger.prototype.warn = function (log) {
    const methodName = Logger.getCallerFunctionName();
    const context = Logger.getContext();
    // Logger.logger.warn({ context }, `[${this.clazz}::${methodName}]: ${log}`);
    Logger.logger.warn({ ...context, class: this.clazz, method: methodName }, `${log}`);
};

Logger.prototype.error = function (log) {
    const methodName = Logger.getCallerFunctionName();
    const context = Logger.getContext();
    // Logger.logger.error({ context }, `[${this.clazz}::${methodName}]: ${log}`);
    Logger.logger.error({ ...context, class: this.clazz, method: methodName }, `${log}`);
};

module.exports = { Logger, asyncLocalStorage };
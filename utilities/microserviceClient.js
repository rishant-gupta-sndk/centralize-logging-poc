const axios = require('axios');
const { Logger } = require('./logger');

class MicroserviceClient {
    static async callService(url, method = 'GET', data = null) {
        const log = new Logger('ExpressAPI', 'MicroserviceClient');
        const headers = Logger.getContextHeaders();

        log.info(`Calling microservice: ${url} with headers: ${JSON.stringify(headers)}`);

        try {
            const response = await axios({
                url,
                method,
                data,
                headers
            });

            log.info(`Response from ${url}: ${JSON.stringify(response.data)}`);
            return response.data;
        } catch (error) {
            log.error(`Error calling ${url}: ${error.message}`);
            throw error;
        }
    }
}

module.exports = MicroserviceClient;

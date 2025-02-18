const express = require('express');
const bodyParser = require('body-parser');
const { Logger } = require('./utilities/logger');
const contextMiddleware = require('./contextMiddleware');
const userRoutes = require('./routes/users');

const app = express();
const PORT = 3000;
const log = new Logger('ExpressAPI', 'Server');

app.use(bodyParser.json());
app.use(contextMiddleware); // Apply the middleware globally
app.use('/users', userRoutes);

app.listen(PORT, () => {
    log.info(`Server is running on port ${PORT}`);
});
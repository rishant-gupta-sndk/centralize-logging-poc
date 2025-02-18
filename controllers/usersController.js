const {Logger} = require('../utilities/logger');
const MicroserviceClient = require('../utilities/microserviceClient');
const log = new Logger('ExpressAPI', 'UsersController');
let users = [];

exports.getUsers = (req, res) => {
    log.info('Fetching all users 1');
    simplePrint();
    log.info('Fetching all users 2 ');
    res.json(users);
};

simplePrint = () => {
    log.info('Hello Rishant');
}

exports.addUser = (req, res) => {
    const user = req.body;
    users.push(user);
    // **Set custom context from anywhere**
    Logger.setContext('lastUserAdded', user.name);
    log.info(`User added: ${JSON.stringify(user)}`);
    res.status(201).json(user);
};

exports.getUserById = (req, res) => {
    const user = users.find(u => u.id === parseInt(req.params.id));
    if (user) {
        log.info(`User found: ${JSON.stringify(user)}`);
        res.json(user);
    } else {
        log.warn(`User with ID ${req.params.id} not found`);
        res.status(404).json({ error: 'User not found' });
    }
};

exports.updateUser = (req, res) => {
    const index = users.findIndex(u => u.id === parseInt(req.params.id));
    if (index !== -1) {
        users[index] = req.body;
        log.info(`User updated: ${JSON.stringify(req.body)}`);
        res.json(users[index]);
    } else {
        log.info(`User with ID ${req.params.id} not found for update`);
        res.status(404).json({ error: 'User not found' });
    }
};

exports.deleteUser = (req, res) => {
    const index = users.findIndex(u => u.id === parseInt(req.params.id));
    if (index !== -1) {
        const deletedUser = users.splice(index, 1);
        log.info(`User deleted: ${JSON.stringify(deletedUser[0])}`);
        res.json(deletedUser[0]);
    } else {
        log.warn(`User with ID ${req.params.id} not found for deletion`);
        res.status(404).json({ error: 'User not found' });
    }
};

exports.getUserOrders = async (req, res) => {
    try {
        log.info(`Fetching orders for user: ${req.body.user}`);
        // const userId = Logger.getContext().userId;

        const orders = await MicroserviceClient.callService(`http://order-service/orders?userId=${req.body.user}`);
        res.json(orders);
    } catch (error) {
        log.error(`Failed to fetch orders: ${error.message}`);
        res.status(500).json({ error: 'Failed to fetch orders' });
    }
};
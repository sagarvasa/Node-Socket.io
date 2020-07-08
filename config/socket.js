const env = process.env.NODE_ENV || 'development';

/* Socket configuration based on environment
   replace with original values to get configure socket instance
*/
const development = {
    pingInterval: 1000, //If The underlying TCP connection is not closed properly due to a network issue, a client may have to wait up to [pingTimeout + pingInterval] ms before getting a disconnect event.
    pingTimeout: 500,
    transports: ["websocket"] //transports to allow connections to. no polling
}

const staging = {
    pingInterval: 1000,
    pingTimeout: 500,
    transports: ["websocket"]
}

const dev = {
    pingInterval: 1000,
    pingTimeout: 500,
    cookie: false,
    transports: ["websocket"]
}

const production = {
    pingInterval: 1000,
    pingTimeout: 500,
    cookie: false,
    transports: ["websocket"]
}

const config = { development, staging, dev, production };

module.exports = config[env] || config['development'];
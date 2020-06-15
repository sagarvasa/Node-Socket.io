const env = process.env.NODE_ENV || 'development';

/* database configuration based on environment
   replace with original values to get connected with database
*/
const development = {
    "host": "127.0.0.1",
    "port": 27017,
    "database": "node_socket",
    "username": process.env.DB_USER || "admin",
    "password": process.env.DB_PASS || "admin",
    "pool_size": 3,
    "timeout": 30000 // (30 * 1000ms = 30 sec)
}

const staging = {
    "host": "staging-abc.docdb.amazonaws.com",
    "port": 27017,
    "database": "node_socket",
    "username": process.env.DB_USER,
    "password": process.env.DB_PASS,
    "pool_size": 5,
    "timeout": 30000
}

const dev = {
    "host": "dev-abc.docdb.amazonaws.com",
    "port": 27017,
    "database": "node_socket",
    "username": process.env.DB_USER,
    "password": process.env.DB_PASS,
    "pool_size": 10,
    "timeout": 30000
}

const production = {
    "host": "prd-abc.docdb.amazonaws.com",
    "port": 27017,
    "database": "node_socket",
    "username": process.env.DB_USER,
    "password": process.env.DB_PASS,
    "pool_size": 10,
    "timeout": 30000
}

const config = { development, staging, dev, production };

module.exports = config[env] || config['development'];
const logger = require("../utility/logger");
const db_config = require("../../config/db");
const mongoose = require("mongoose");

const { host, port, database, username, password } = db_config;
let url = "mongodb://" + username + ":" + password + "@" + host + ":" + port + "/" + database;
let options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    poolSize: db_config.pool_size,
    socketTimeoutMS: db_config.timeout,
    useFindAndModify: false,
    useCreateIndex: true
}

mongoose.connect(url, options).catch((err) => {
    logger.error('error in initially connecting database:: ' + err);
});

let connection = mongoose.connection;
connection.on('error', function (err) {
    logger.error('db connection error event ' + err);
})
connection.on('connected', function () {
    logger.info('database connected successfully');
})
connection.on('disconnected', function () {
    logger.info('database disconnected');
})
connection.on('reconnected', function () {
    logger.info('database re-connected successfully');
})

let gracefulExit = function() { 
    mongoose.connection.close();
  }

module.exports = {mongoose, gracefulExit}
const { createLogger, format, transports } = require('winston');
const { combine, timestamp, colorize, simple } = format;
const util = require("util");
const constants = require("./constants");
const env = process.env.NODE_ENV;

const winstonLogger = createLogger({
    format: combine(
        colorize({ all: true }),
        timestamp(),
        simple()
    ),
    transports: [new transports.Console()]
})

class Logger {
    constructor() {
        this.correlationId;
        this.app = "node-socket.io";
        this.env = env;
        this.logger = winstonLogger;
        this.info = this.info.bind(this);
        this.error = this.error.bind(this);
    }

    info(message, res) {
        let logmessage = {
            app: this.app,
            env: this.env,
            level: "info",
            message: util.inspect(message, true, null),
        }
        if (res && res.get(constants.corr_id)) {
            logmessage['correlation_id'] = res.get(constants.corr_id)
        }
        this.logger.log(logmessage);
    }

    error(message, res) {
        let logmessage = {
            app: this.app,
            env: this.env,
            level: "error",
            message: util.inspect(message, true, null),
        }
        if (res && res.get(constants.corr_id)) {
            logmessage['correlation_id'] = res.get(constants.corr_id)
        }
        this.logger.log(logmessage);
    }
}

module.exports = new Logger();


var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var app = express();
var uuid = require("shortid");
var flash = require("connect-flash");
var session = require('express-session');
var port = process.env.PORT || 3000;

const logger = require("./server/utility/logger");
const constants = require("./server/utility/constants");
const passport = require("./server/core/auth/index")

let connection;

try {
    connection = require("./server/helper/mongo_connection");
} catch(e) {
    logger.error("Error in connecting Database "+ e)
}

// View engine setup
app.set('views', path.join(__dirname, 'server/core/views'));
app.set('view engine', 'ejs');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static('public'));

app.use(session({
    saveUninitialized: false,
    resave: false,
    secret: constants.secret_key
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT,DELETE");
    res.setHeader("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader(constants.corr_id, req.get(constants.corr_id) ? req.get(constants.corr_id) : uuid.generate());
    next();
})

require("./server/core/routes/index")(app);


app.use(function (req, res, next) {
    logger.error("not found matching route: "+ req.path, res);
    res.status(constants.not_found);

    // respond with html page
    if (req.accepts('html')) {
        res.render('404', { url: req.url });
        return;
    }

    // respond with json
    if (req.accepts('json')) {
        res.send({ error: 'Not found' });
        return;
    }

    // default to plain-text. send()
    res.type('txt').send('Not found');

});

app.listen(port, function () {
    logger.info("server is up and running on port " + port);
})


// gracefully close connection when process is about to exit
process.on('SIGINT', () => {
    if(connection) {
        connection.gracefulExit();
        logger.info("SIGINT:: successfully closed mongo connection ");
        process.exit(0);
    } else {
        process.exit(0)
    }
});

/*
process.on('SIGTERM', () => {
    if(connection) {
        connection.gracefulExit((err, data) => {
            logger.info("SIGTERM:: successfully closed mongo connection " +JSON.stringify(data));
            process.exit(0)
        })
    } else {
        process.exit(0);
    }
});
*/

module.exports = app;


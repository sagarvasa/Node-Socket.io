const config = require("../../../config/socket");

const initialize = function(app) {
    // Create http Server Using express instance
    const httpServer = require("http").Server(app);

    // Options to configure Socket
    const options = {
        transports: config.transports
    }

    // Create IO Instance using http server
    const io = require("socket.io")(httpServer, options);

    // Pass io to io_events function to seperately handle socket events
    io_events(io);

    return httpServer;
}

// Seperately handling each namespace for better listening/emitting events
function io_events(io) {
    require("./rooms")(io);
    require("./chat")(io);
}

module.exports = initialize;

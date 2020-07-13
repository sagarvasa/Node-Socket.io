const logger = require("../../utility/logger");
const roomsModel = require("../models/rooms");

const NAME_SPACE = "/rooms";

const rooms = function (io) {

    io.of(NAME_SPACE).on('connection', async function (socket) {

        socket.on("create_room", async function (room_name) {
            logger.info("Create_room:: room name:: " + room_name);
            try {
                let query = { title: new RegExp("^" + room_name + "$", "i") }
                let room = await roomsModel.findOne(query);
                if (room) {
                    logger.error("Create_room:: Duplicate room name");
                    socket.emit("room_err", { message: "Room name already exists" });
                } else {
                    let room_model = new roomsModel({ title: room_name });
                    let new_room = await room_model.save();

                    socket.emit("create-room-success", {message: "Room created successfully! Please enter into the room by clicking on link from active room list"})

                    // Sending data to all connected socket within namespace
                    io.of(NAME_SPACE).emit('update_rooms_list', new_room);
                    logger.info("Create_room:: new room:: " + JSON.stringify(new_room));

                    /* emit --> current , broadcast --> all other except current socket
                    socket.emit('update_rooms_list', new_room);
                    socket.broadcast.emit('update_rooms_list', new_room);
                    */
                }
            } catch (err) {
                logger.error("Create_room:: Error:: " + err.message);
                socket.emit("room_err", { message: "Something bad happened! Please try again after sometime" });
            }
        })

    })
}

module.exports = rooms;
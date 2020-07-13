const logger = require("../../utility/logger");
const roomsModel = require("../models/rooms");
const usersModel = require("../models/user");

const NAME_SPACE = "/rooms/id";

const chat = function (io) {

    io.of(NAME_SPACE).on('connection', function (socket) {

        socket.on("join_room", async function (id, username) {
            logger.info("Chat:: join_room event:: id:: " + id);
            try {
                let room = await roomsModel.findById(id);
                if (!room) {
                    logger.error("join_room:: room doesn't exists");
                    socket.emit("chat_err", { message: "Room doesn't exists" });
                } else {
                    let new_room = await roomsModel.addUserToRoom(room, socket, username);
                    socket.join(new_room._id);
                    let { users, counter } = await roomsModel.getActiveUsersFromRoom(new_room, socket, username);
                    let users_obj = await usersModel.getUserDetailByUsernames(users);
                    logger.info("Chat:: join_room event:: users :: " + JSON.stringify(users_obj));
                    let appended_user_obj = users_obj.filter((user) => user.username === username);
                    socket.broadcast.to(new_room._id).emit('update_users_list', appended_user_obj, 1)
                    socket.emit('update_users_list', users_obj, 0);
                }
            } catch (err) {
                logger.error("join_room:: Error:: " + err.message);
                socket.emit("chat_err", { message: "Something bad happened! Please try again after sometime" });
            }
        });

        socket.on("message", async function (id, message) {
            logger.info("Chat:: Message event:: room id:: " + id);
            socket.in(id).emit('add_msg', message);
        });

        socket.on("disconnect", async function () {
            logger.info("Chat:: disconnect event");
            try {
                let rooms = await roomsModel.find();
                roomsModel.removeUserFromRooms(rooms, socket, async (err, room) => {
                    logger.info("Chat:: successfully removed connection from db");
                    socket.leave(room._id);
                    let { users, counter } = await roomsModel.getActiveUsersFromRoom(room, socket, "");
                    let users_obj = await usersModel.getUserDetailByUsernames(users);
                    socket.in(room._id).emit("remove_user", users_obj, 0)
                });
                
            } catch (err) {
                logger.error("disconnect:: Error:: " + err.message);
                socket.emit("chat_err", { message: "Something bad happened! Please try again after sometime" });
            }
        })

        /*
        socket.on("logout", async function (room_id) {
            logger.info("Chat:: logout event");
            try {
                let room = await roomsModel.findById(room_id);
                let rooms = room.map(Array);
                await roomsModel.removeUserFromRooms(rooms, socket, (err, room) => {
                    logger.info("Chat:: logout:: successfully removed connection from db");
                    socket.leave(room._id);
                });
                
            } catch (err) {
                logger.error("logout:: Error:: " + err.message);
                socket.emit("chat_err", { message: "Something bad happened! Please try again after sometime" });
            }
        })*/

    })

}

module.exports = chat;
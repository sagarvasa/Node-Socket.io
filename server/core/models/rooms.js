const mongoose = require("mongoose");
const { Schema } = mongoose;

let roomSchema = new Schema({

    title: {
        type: String,
        required: true
    },
    connections: {
        type: [
            {
                user_id: String,
                socket: String
            }
        ]
    }

})

roomSchema.statics.removeUserFromRooms = function (rooms, socket, callback) {
    try {
        rooms.forEach((room) => {
            let active_connections = room.connections.filter((connection) => connection.socket != socket.id);
            room.connections = active_connections || [];
            room.save(() => callback(null, room));
        })
    } catch (err) {
        callback(err)
    }
}

roomSchema.statics.addUserToRoom = function (room, socket, username) {
    return new Promise(async (resolve, reject) => {
        let connection = {
            "user_id": username,
            "socket": socket.id
        }
        room.connections.push(connection);
        let new_room = await room.save().catch((e) => reject(e));
        resolve(new_room);
    })
}

roomSchema.statics.getActiveUsersFromRoom = function (room, socket, username) {
    return new Promise((resolve, reject) => {
        let users = [];
        let unique_obj = {};
        let counter = 0;
        room.connections.forEach((connection) => {
            let id = connection.user_id;

            if (connection.user_id === id) {
                counter++;
            }

            if (!unique_obj[id]) {
                users.push(id);
            }
            unique_obj[id] = true;
        });
        resolve({ users, counter });
    })
}

let roomModel = mongoose.model("rooms", roomSchema, "rooms");


module.exports = roomModel;
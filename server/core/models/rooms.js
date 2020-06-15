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

let roomModel = mongoose.model("rooms", roomSchema, "rooms")

module.exports = roomModel;
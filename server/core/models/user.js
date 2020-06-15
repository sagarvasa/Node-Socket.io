const mongoose = require("mongoose");
const { Schema } = mongoose;

// use bcrypt if saving username or password
let userSchema = new Schema({

    username: {
        type: String,
        trim: true,
        required: true,
        unique: true,
        minlength: 5,
        maxlength: 10
    },
    mobile: {
        type: String,
        trim: true,
        required: true,
        unique: true,
        validate: {
            validator: function(v) {
              return /\d{10}/.test(v);
            },
            message: props => `${props.value} is not a valid phone number!`
          },
    }

})

let userModel = mongoose.model("user_auths", userSchema, "user_auths")

module.exports = userModel;
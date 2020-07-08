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
        maxlength: 50
    },
    mobile: {
        type: String,
        trim: true,
        required: true,
        unique: false,
        validate: {
            validator: function(v) {
              return /\d{10}/.test(v);
            },
            message: props => `${props.value} is not a valid phone number!`
          },
    },
    name: {
      type: String,
      trim: true,
      required: true,
      unique: false,
      minlength: 3,
      maxlength: 10
  }

})

userSchema.statics.getUserDetailByUsernames = function(ids) {
  return new Promise(async (resolve, reject) => {
    let users = [];
    let counter = 0;
    ids.forEach(async (id) => {
      let user = await this.find({username: id});
      counter++;
      if(user && user.length) users.push(user[0]);

      if(ids.length === counter) resolve(users);
    })
  })
}

let userModel = mongoose.model("user_auths", userSchema, "user_auths")

module.exports = userModel;
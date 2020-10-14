const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, "Email is required"],
    match: [/^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/, "Invalid email format"],
    unique: true,
    // validate: {
    //   validator: function (e) {
    //     return this.model("User")
    //       .findOne({ email: e })
    //       .then(user => !user); // returns false
    //   },
    //   message: props => `${props.value} is already used by another user`,
    // },
  },
  password: {
    type: String,
    required: true,
  },
  createdEvents: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
    },
  ],
});

module.exports = mongoose.model("User", userSchema);

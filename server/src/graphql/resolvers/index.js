const Event = require("../../models/event");
const User = require("../../models/user");
const bcrypt = require("bcryptjs");

module.exports = {
  events: () => {
    return Event.find()
      .populate({
        path: "creator",
        populate: {
          path: "createdEvents",
        },
      })
      .then(events => {
        return events;
      })
      .catch(err => {
        console.log({ EventsQueryError: err });
        throw err;
      });
  },
  users: () => {
    return User.find()
      .populate({
        path: "createdEvents",
        populate: {
          path: "creator",
        },
      })
      .then(users => {
        return users;
      })
      .catch(err => {
        console.log({ UsersQueryError: err });
        throw err;
      });
  },
  createEvent: async args => {
    const { title, description, price, date, creator } = args.eventInput;

    try {
      const event = new Event({
        title,
        description,
        price,
        date,
        creator,
      });

      const user = await User.findOne({ _id: creator });

      if (!user) {
        const error = { message: "User not found", httpStatusCode: 404 };

        throw error;
      }

      const newEvent = await event.save();

      user.createdEvents.push(event);
      const updatedUser = await user.save();

      console.log({ updatedUser });

      return { ...newEvent._doc, creator: updatedUser };
    } catch (error) {
      console.log({ CreateEventError: error });
      throw error;
    }
  },
  createUser: async args => {
    try {
      const { email, password } = args.userInput;
      const hasUser = await User.findOne({ email });

      if (hasUser) {
        // throw new Error("Email has already been used");
        const error = {
          message: "Email has already been used",
          httpStatusCode: 409,
        };

        // throw new Error(JSON.stringify(error));
        throw error;
      }

      const hashedPassword = await bcrypt.hash(password, 12);
      const user = new User({
        email,
        password: hashedPassword,
      });

      const newUser = await user.save();

      // return { _id: newUser._id, email: newUser.email };
      // return { ...newUser._doc, password: null };
      return newUser;
    } catch (error) {
      console.log({ CreateUserError: error });
      throw error;
    }
  },
};

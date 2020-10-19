const Event = require("../../models/event");
const User = require("../../models/user");
const CustomError = require("../../utils/error");

module.exports = {
  /* =========================
            QUERY 
     =========================
  */

  events: () => {
    try {
      return Event.find().populate({
        path: "creator",
        populate: {
          path: "createdEvents",
        },
      });
    } catch (error) {
      console.log({ EventsQueryError: error });
      throw error;
    }
  },

  /* =========================
            MUTATION 
     =========================
  */

  createEvent: async (args, req) => {
    if (!req.isAuth) {
      throw CustomError("Unauthorized", 401);
    }

    const { title, description, price, date } = args.eventInput;

    try {
      const event = new Event({
        title,
        description,
        price,
        date,
        creator: req.currentUser,
      });

      const user = await User.findOne({ _id: req.currentUser });

      if (!user) {
        throw CustomError("User not found", 404);
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
};

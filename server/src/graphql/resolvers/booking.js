const Booking = require("../../models/booking");
const Event = require("../../models/event");
const User = require("../../models/user");
const CustomError = require("../../utils/error");

module.exports = {
  /* =========================
            QUERY 
     =========================
  */

  bookings: async (args, req) => {
    if (!req.isAuth) {
      throw CustomError("Unauthorized", 401);
    }

    try {
      return await Booking.find()
        .populate({
          path: "event",
          populate: { path: "creator" },
        })
        .populate({ path: "user", populate: { path: "createdEvents" } });
    } catch (error) {
      console.log({ BookingsError: error });
      throw error;
    }
  },

  /* =========================
            MUTATION 
     =========================
  */

  bookEvent: async (args, req) => {
    if (!req.isAuth) {
      throw CustomError("Unauthorized", 401);
    }

    const { userId, eventId } = args;

    const findEvent = Event.findOne({ _id: eventId });
    const findUser = User.findOne({ _id: userId });

    try {
      const [hasEvent, hasUser] = await Promise.all([findEvent, findUser]);

      if (!hasEvent) {
        throw CustomError("Event not found", 404);
      }

      if (!hasUser) {
        throw CustomError("User not found", 404);
      }

      const booking = new Booking({ user: userId, event: eventId });
      const newBooking = await booking.save();

      // return newBooking;
      return { ...newBooking._doc, event: hasEvent, user: hasUser };
    } catch (error) {
      console.log({ BookEventError: error });
      throw error;
    }
  },
  cancelBooking: async (args, req) => {
    if (!req.isAuth) {
      throw CustomError("Unauthorized", 401);
    }

    const { bookingId } = args;
    try {
      const booking = await Booking.findOne({ _id: bookingId })
        .populate({
          path: "event",
          populate: { path: "creator" },
        })
        .populate({ path: "user", populate: { path: "createdEvents" } });

      if (!booking) {
        throw CustomError("Booking not found", 404);
      }

      await Booking.deleteOne({ _id: bookingId });

      return booking;
    } catch (error) {
      console.log({ CancelBookingError: error });
      throw error;
    }
  },
};

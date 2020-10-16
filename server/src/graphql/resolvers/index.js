const AuthResolver = require("./auth");
const EventResolver = require("./events");
const BookingResolver = require("./booking");

module.exports = {
  ...AuthResolver,
  ...EventResolver,
  ...BookingResolver,
};

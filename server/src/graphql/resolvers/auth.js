const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../../models/user");
const CustomError = require("../../utils/error");

module.exports = {
  /* =========================
            QUERY 
     =========================
  */

  users: async () => {
    try {
      return await User.find().populate({
        path: "createdEvents",
        populate: {
          path: "creator",
        },
      });
    } catch (error) {
      console.log({ UsersQueryError: error });
      throw error;
    }
  },
  login: async ({ email, password }) => {
    try {
      const user = await User.findOne({ email });

      if (!user) {
        throw CustomError("Incorrect email/password", 403);
      }

      const passwordMatch = await bcrypt.compare(password, user.password);

      if (!passwordMatch) {
        throw CustomError("Incorrect email/password", 403);
      }

      const token = jwt.sign(
        { _id: user._id, email },
        process.env.JWT_SECRET_KEY,
        { expiresIn: "1h" }
      );

      return { token };
    } catch (error) {
      console.log({ LoginError: error });
      throw error;
    }
  },

  /* =========================
            MUTATION 
     =========================
  */

  createUser: async args => {
    try {
      console.log({ args });
      const { email, password } = args.userInput;
      const hasUser = await User.findOne({ email });

      if (hasUser) {
        throw CustomError("Email has already been used", 409);
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

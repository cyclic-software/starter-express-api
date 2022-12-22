import jwt from "jsonwebtoken";
import User from "../models/user_model.js";
// import bcrypt from "bcrypt";

export const signIn = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email: email, password: password });
    if (!user) {
      return res.status(200).json({ errorMessage: "Email or Password is incorrect." });
    }

    user.isLoggedIn = true;
    await user.save();
    const accessToken = jwt.sign(user.email, process.env.ACCESS_TOKEN_SECRET);

    res.status(200).json({ token: accessToken });
  } catch (e) {
    console.log(e);
    res.status(500).json({ errorMessage: e.message });
  }
};

export const signUp = async (req, res, next) => {
  try {
    const { firstName, lastName, email, password } = req.body;
    const isUserExist = await User.findOne({ email: email });
    if (isUserExist) {
      return res.status(200).json({ errorMessage: "Email already exists" });
    }

    // const encryptedPassword = await bcrypt.encode(password);
    var newUser = new User({ firstName, lastName, email, password });
    newUser = await newUser.save();

    console.log(req.body);
    res.status(200).json({ user: newUser });
  } catch (e) {
    console.log(e);
    res.status(500).json({ errorMessage: e.message });
  }
};

export const signOut = async (req, res, next) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(200).json({ errorMessage: "Email is incorrect." });
    }

    user.isLoggedIn = false;
    await user.save();

    res.status(200).json({});
  } catch (e) {
    console.log(e);
    res.status(500).json({ errorMessage: e.message });
  }
};

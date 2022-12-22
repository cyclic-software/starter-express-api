import User from "../models/user_model.js";

export const getUserInfo = async (req, res, next) => {
  try {
    const email = req.email;
    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(200).json({ errorMessage: "User isn't exists" });
    }

    res.status(200).json({ firstName: user.firstName, lastName: user.lastName, openTime: user.openTime });
  } catch (e) {
    console.log(e);
    res.status(500).json({ errorMessage: e.message });
  }
};

export const updateUserInfo = async (req, res, next) => {
  try {
    const { firstName, lastName, openTime } = req.body;
    const user = await User.findOne({ email: req.email });
    if (!user) {
      return res.status(200).json({ errorMessage: "User isn't exists" });
    }

    user.firstName = firstName;
    user.lastName = lastName;
    user.openTime = openTime;
    await user.save();

    res.status(200).json({ ...req.body });
  } catch (e) {
    console.log(e);
    res.status(500).json({ errorMessage: e.message });
  }
};

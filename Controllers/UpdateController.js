const bcrypt = require("bcrypt");
const User = require("../Models/UserModel");

const updatePassword = async (req, res) => {
  const { password, confirmPassword } = req.body;
  const { token } = req.query; // Extract the token from the URL query parameters

  try {
    // Find the user by the reset token
    const user = await User.findOne({ resetToken: token });

    if (!user) {
      return res.status(404).json({ error: "Invalid or expired reset token" });
    }

    // Validate password and confirm password
    if (password !== confirmPassword) {
      return res
        .status(400)
        .json({ error: "Password and confirm password do not match" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Update the password
    user.password = hashedPassword;
    user.resetToken = null;
    await user.save();

    res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    console.error("Error updating password:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = { updatePassword };

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");
const User = require("../Models/UserModel");
const nodemailer = require("nodemailer");

const { JWT_SECRET } = process.env;

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "sinelizwintaku@gmail.com",
    pass: "vmle vfji jmuf unre",
  },
});

function sendResetEmail(email, resetLink) {
  const mailOptions = {
    from: "sinelizwintaku@gmail.com",
    to: email,
    subject: "Reset Password",
    text: `Click the following link to reset your password: ${resetLink}`,
  };
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Error sending reset email:", error);
    } else {
      console.log("Reset email sent successfully to:", info.accepted);
    }
  });
}

class ResetController {
  async resetPassword(req, res) {
    try {
      const { email } = req.body;

      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json({ error: "Email not found" });
      }

      const resetToken = generateResetToken();

      await saveResetToken(email, resetToken);

      const resetLink = `http://localhost:5173/password?token=${resetToken}`;
      sendResetEmail(email, resetLink);

      res.json({ message: "Password reset email sent" });
    } catch (error) {
      console.error("Error resetting password:", error);
      res.status(500).json({ error: "Failed to reset password" });
    }
  }

  generateToken(user) {
    const payload = {
      id: user.id,
      email: user.email,
    };

    const options = {
      expiresIn: "1h",
    };

    const token = jwt.sign(payload, JWT_SECRET, options);
    return token;
  }
}

function generateResetToken() {
  const token = uuidv4();
  return token;
}

async function saveResetToken(email, token) {
  try {
    const user = await User.findOneAndUpdate(
      { email },
      {
        resetToken: token,
        resetTokenExpiration: Date.now() + 3600000,
      }
    );
    return user;
  } catch (error) {
    throw new Error("Failed to save reset token");
  }
}

module.exports = new ResetController();

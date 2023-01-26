import User from "../models/User";
import bcrypt from "bcrypt";

export const getAdminLogin = (req, res) => {
  return res.render("./admin/adminLogin");
};

export const postAdminLogin = async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  if (!user) {
    return res
      .status(400)
      .render("./admin/adminLogin", {
        errorMessage: "아이디 / 비밀번호 가 틀렸습니다 ❌",
      });
  }
  const validationCheck = await bcrypt.compare(password, user.password);

  if (!validationCheck) {
    return res.status(400).render("./admin/adminLogin", {
      errorMessage: "아이디 / 비밀번호 가 틀렸습니다 ❌",
    });
  }
  if (!user.isAdmin) {
    return res.status(400).render("./admin/adminLogin", {
      errorMessage: "관리자가 아닙니다 관리자 에게 문의 해주세요 ❌",
    });
  }

  req.session.loggedIn = true;
  req.session.isAdmin = true;
  req.session.user = user;
  return res.redirect("/");
};

export const getAdminPage = (req, res) => {
  return res.render("./admin/adminPage");
};

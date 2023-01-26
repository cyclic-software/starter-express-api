import User from "../models/User";
import bcrypt from "bcrypt";
import fetch from "node-fetch";
import nodemailer from "nodemailer";
import { v4 as uuidv4 } from "uuid";
import Verification from "../models/Verification";
import logger, { loggerInfo } from "../common/logger";

/** 이메일 관련 파리미터 및 함수 [시작] */
const config = {
  service: "gmail",
  host: "smtp.gmail.com",
  port: "587",
  secure: false,
  auth: {
    user: process.env.GOOGLE_MAIL,
    pass: process.env.GOOGLE_PASSWORD,
  },
};

const sendMailer = async (data) => {
  const transporter = nodemailer.createTransport(config);
  transporter.sendMail(data, (err, info) => {
    if (err) {
      console.log(err);
    } else {
      return info.response;
    }
  });
};

/** 이메일 관련 파리미터 및 함수 [끝]*/

export const postCertification = async (req, res) => {
  const { imp_uid } = req.body; // request의 body에서 imp_uid 추출
  try {
    const getToken = await (
      await fetch("https://api.iamport.kr/users/getToken", {
        method: "POST", // POST method
        headers: { "Content-Type": "application/json" }, // "Content-Type": "application/json"
        body: JSON.stringify({
          imp_key: process.env.SHOP_API_KEY, // REST API키
          imp_secret: process.env.SHOP_API_SECRET, // REST API Secret
        }),
      })
    ).json();

    const { access_token } = getToken.response; // 인증 토큰

    const getCertifications = await (
      await fetch(`https://api.iamport.kr/certifications/${imp_uid}`, {
        // imp_uid 전달
        method: "GET", // GET method
        headers: { Authorization: access_token }, // 인증 토큰 Authorization header에 추가
      })
    ).json();

    const certificationsInfo = getCertifications.response;

    const { name, birth, phone } = certificationsInfo;

    const user = await User.findOne({ phoneNum: phone });

    if (user) {
      logger.error(`${loggerInfo()} 이미 존재하는 핸드폰 번호 입니다`);
      return res.send({
        status: "fail",
        message: "이미 존재하는 핸드폰 번호 입니다",
      });
    }
    logger.info(`${loggerInfo()} 인증이 완료 되었습니다`);
    return res.send({
      status: "success",
      message: "인증이 완료 되었습니다 ☕",
    });
  } catch (error) {
    //! 500 error
    logger.error(`${loggerInfo()} postCertification error`);
    console.log(error);
  }
};

export const getCheck = (req, res) => {
  //* 200 success
  logger.info(`${loggerInfo()} check.pug 랜더 성공`);
  return res.render("check");
};

export const postCheck = async (req, res) => {
  const { username, checkEmail } = req.body;
  const user = await User.findOne({ username });
  const verification = await Verification.findOne({ user });
  if (checkEmail === verification.code) {
    user.verified = true;
    await user.save();
  }
  //* 304 redirect
  logger.info(`${loggerInfo()} /login 리다이렉트 성공`);
  return res.redirect("/login");
};

export const getJoin = (req, res) => {
  //* 200 success
  return res.render("join");
};

export const postJoin = async (req, res) => {
  const { name, username, email, password, password2, region, phoneNum } = req.body;

  if (password !== password2) {
    //! 400 error 유저가 password과 password2를  잘못 입력했을때
    logger.error(`${loggerInfo()} 비밀번호가 일치하지 않습니다 ❌`);
    return res.status(400).render("join", {
      errorMessage: "비밀번호가 일치하지 않습니다 ❌",
    });
  }

  const validationChecker = await User.exists({
    $or: [{ username }, { email }],
  });

  if (validationChecker) {
    //! 401 error 유저가 password를 잘못 입력했을때
    logger.error(`${loggerInfo()} 이미 사용중인 이름/이메일 입니다 ❌`);
    return res.status(401).render("join", {
      errorMessage: "이미 사용중인 이름/이메일 입니다 ❌",
    });
  }
  const codeNum = uuidv4();
  const mailVar = {
    form: `${process.env.GOOGLE_MAIL}`,
    to: email,
    subject: `${username}님 Cafe Small House 에 오신것을 환영합니다!`,
    html: `
    <strong>Cafe Small House</strong>
    <br/>
    <hr/>
    <p style="font-size:25px">아래에 있는 확인 코드를 입력해주세요☕</p>
    <p style="color:#0984e3; font-size: 25px;">${codeNum}</p>
    <br/>
    <p> 더 열심히 하는 cafe small house가 되겠습니다</p>
    <p>&copy; ${new Date().getFullYear()} Cafe Small House</p>
    `,
  };
  try {
    const user = await User.create({
      name,
      username,
      email,
      password,
      region,
      phoneNum,
    });

    await Verification.create({
      code: codeNum,
      user,
    });

    await sendMailer(mailVar);
    //* 200 success 성공
    logger.info(`${loggerInfo()} check 랜더 성공 & 데이터 user 전달 성공`);
    return res.render("check", { user });
  } catch (error) {
    //! 500 error
    logger.error(`${loggerInfo()} ${error._message}`);
    return res.status(400).render("join", {
      errorMessage: error._message,
    });
  }
};

export const getLogin = (req, res) => {
  //* 200 success
  logger.info(`${loggerInfo()} login 랜더 성공`);
  return res.render("login");
};

export const postLogin = async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  if (!user) {
    //! 401 error 유저가 username을 잘못 입력했을때
    logger.error(`${loggerInfo()} 아이디 / 비밀번호 가 틀렸습니다 ❌`);
    return res.status(401).render("login", { errorMessage: "아이디 / 비밀번호 가 틀렸습니다 ❌" });
  }
  const validaionCheck = await bcrypt.compare(password, user.password);

  if (!validaionCheck) {
    //! 401 error 유저가 password를 잘못 입력했을때
    logger.error(`${loggerInfo()} 아이디 / 비밀번호 가 틀렸습니다 ❌`);
    return res.status(401).render("login", {
      errorMessage: "아이디 / 비밀번호 가 틀렸습니다 ❌",
    });
  }

  if (!user.verified) {
    //* 200 success
    logger.info(`${loggerInfo()} login 랜더 성공 & 데이터 user 전달 성공`);
    return res.render("check", { user });
  }

  req.session.loggedIn = true;
  req.session.user = user;
  //* 304 redirect
  logger.info(`${loggerInfo()} "/" 홈으로 리다이렉트 성공`);
  return res.redirect("/");
};

export const getEdit = (req, res) => {
  //* 200 success
  logger.info(`${loggerInfo()} edit-profile 랜더 성공`);
  return res.render("edit-profile");
};

export const postEdit = async (req, res) => {
  const {
    session: {
      user: { _id, avatar, email: sessionEmail, username: sessionUsername },
    },
    body: { name, email, username, region, phoneNum },
    file,
  } = req;
  let searchParam = [];
  if (sessionEmail !== email) {
    searchParam.push({ email });
  }
  if (sessionUsername !== username) {
    searchParam.push({ username });
  }
  if (searchParam.length > 0) {
    const foundUser = await User.findOne({ $or: searchParam });
    if (foundUser && foundUser._id.toString() !== _id) {
      //! 401 error 이미 존재 하는 계정이 있는 경우
      logger.error(`${loggerInfo()} 이미 있는 아아디나 이메일 입니다 ❌`);
      return res.status(401).render("edit-profile", {
        errorMessage: "이미 있는 아아디나 이메일 입니다 ❌",
      });
    }
  }
  const isHeroku = process.env.MODE === "production";
  const updateUser = await User.findByIdAndUpdate(
    _id,
    {
      avatar: file ? (isHeroku ? file.location : file.path) : avatar,
      name,
      email,
      username,
      region,
      phoneNum,
    },

    { new: true }
  );

  req.session.user = updateUser;
  //* 304 redirect
  logger.info(`${loggerInfo()} "/" 홈으로 리다이렉트 성공`);
  return res.redirect("/");
};

export const getChangePassword = (req, res) => {
  if (req.session.user.socialOnly === true) {
    //* 304 redirect
    logger.info(`${loggerInfo()} "/" 홈으로 리다이렉트 성공`);
    return res.redirect("/");
  }
  return res.render("change-password");
};

export const postChangePassword = async (req, res) => {
  const {
    session: {
      user: { _id },
    },
    body: { oldPassword, newPassword, newPasswordConfirmation },
  } = req;
  const user = await User.findById(_id);
  const validationChecker = await bcrypt.compare(oldPassword, user.password);

  if (!validationChecker) {
    //! 400 error 유저가 일치하는 비밀번호를 입력하지 않았을 경우
    logger.error(`${loggerInfo()} 비밀번호가 맞지 않습니다 ❌`);
    return res.status(400).render("change-password", {
      errorMessage: "비밀번호가 맞지 않습니다 ❌",
    });
  }

  if (newPassword !== newPasswordConfirmation) {
    //! 400 error 유저가 잘못된 비밀번호를 입력 했을 경우
    logger.error(`${loggerInfo()} 비밀번호가 다릅니다 ❌`);
    return res.status(400).redirect("change-password", {
      errorMessage: "비밀번호가 다릅니다 ❌",
    });
  }

  user.password = newPassword;
  await user.save();
  //* 304 redirect
  logger.info(`${loggerInfo()} "users/logout" logout.pug로 리다이렉트 성공`);
  return res.redirect("users/logout");
};

export const logout = (req, res) => {
  //* 304 redirect
  logger.info(`${loggerInfo()} "/" 홈으로 리다이렉트 성공`);
  req.session.destroy();
  return res.redirect("/");
};

export const remove = (req, res) => {
  return res.send("Delete Users ☕");
};

export const see = async (req, res) => {
  const { id } = req.params;
  const user = await User.findById(id)
    .populate("boards")
    .populate({
      path: "orders",
      populate: {
        path: "item",
      },
    });
  if (!user) {
    //! 404 error
    logger.error(`${loggerInfo()} 404 error`);
    return res.status(404).render("404");
  }
  return res.render("profile", { user });
};

/*********************************네이버 소셜 로그인 시작************************************ */
/*
기본 아이디어 :
먼저 네이버의 api 를 가지고 와서 로그인을 할수있도록 해줍니다 그런다음 콜백으로 넘겨서
네이버 아이디,이름,이메일 등의 정보를 가지고 와야 합니다 그럴때 access_token 이 필요한데
이렇게 전달되는 과정에 있어서 post로 왜 전달이 되지 않는지 현재 이곳에서 막혀있습니다
*/

export const naverLogin = (req, res) => {
  const config = {
    client_id: process.env.NAVER_CLIENT_ID,
    client_secret: process.env.NAVER_CLIENT_SECRET,
    state: process.env.RANDOM_STATE,
    redirectURI: process.env.MY_CALLBACK_URL,
  };

  const { client_id, client_secret, state, redirectURI } = config;

  const api_url =
    "https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=" +
    client_id +
    "&redirect_uri=" +
    redirectURI +
    "&state=" +
    state;
  //res.writeHead(200, { "Content-Type": "text/html;charset=utf-8" });
  //* 304 redirect
  logger.info(`${loggerInfo()} ${api_url}으로 리다이렉트 성공`);
  return res.redirect(api_url);
};

export const naverCallback = async (req, res) => {
  const baseUrl = "https://nid.naver.com/oauth2.0/token";
  const grantType = "grant_type=authorization_code";
  const config = {
    client_id: process.env.NAVER_CLIENT_ID,
    client_secret: process.env.NAVER_CLIENT_SECRET,
    redirectURI: process.env.MY_CALLBACK_URL,
    state: req.query.state,
    code: req.query.code,
  };
  const params = new URLSearchParams(config).toString();
  const finalUrl = `${baseUrl}?${grantType}&${params}`;
  const tokenRequest = await (
    await fetch(finalUrl, {
      method: "POST",
      headers: {
        Accept: "application/json",
      },
    })
  ).json();
  if ("access_token" in tokenRequest) {
    const { access_token } = tokenRequest;
    const apiUrl = "https://openapi.naver.com/v1/nid/me";
    const allData = await (
      await fetch(`${apiUrl}`, {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      })
    ).json();

    if (!allData.response.email) {
      //* 304 redirect
      logger.info(`${loggerInfo()} "/login"으로 리다이렉트 성공`);
      return res.redirect("/login");
    }
    const existingUser = await User.findOne({ email: allData.response.email });
    if (existingUser) {
      /**
       *   이전 코드
       *    - 이전에는 소셜로그인으로 가입하지 않고
       *      그냥 가입하고 소셜로 로그인하면 일반 로그인이 되게끔 하였습니다
       * */

      // req.session.loggedIn = true;
      // req.session.user = existingUser;
      // return res.redirect("/");

      /**
       *  수정 코드
       *  - 에러를 발생하도록 구성하였습니다
       */
      //! 400 error 이미 존재하는 계정이 있을 경우
      logger.error(`${loggerInfo()} 존재하는 계정입니다 일반 로그인으로 로그인 해주세요 ❌`);
      return res.status(400).render("login", {
        errorMessage: "존재하는 계정입니다 일반 로그인으로 로그인 해주세요 ❌",
      });
    } else {
      const user = await User.create({
        name: allData.response.name ? allData.response.name : "Unknown",
        username: allData.response.nickname,
        email: allData.response.email,
        password: "",
        socialOnly: true,
        region: "korea",
      });

      req.session.loggedIn = true;
      req.session.user = user;
      //* 304 redirect
      logger.info(`${loggerInfo()} "/" 홈으로 리다이렉트 성공`);
      return res.redirect("/");
    }
  } else {
    //* 304 redirect
    logger.info(`${loggerInfo()} "/login"으로 리다이렉트 성공`);
    return res.redirect("/login");
  }
};

/*********************************네이버 소셜 로그인 끝************************************ */

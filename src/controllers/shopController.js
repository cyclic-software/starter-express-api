import fetch from "node-fetch";
import Item from "../models/Item";
import Order from "../models/Order";
import User from "../models/User";

/*************************************** 결제 기능 구현중 */

export const getShopList = (req, res) => {
  return res.render("shop/shop-list");
};

export const postShopList = async (req, res) => {
  const {
    body: { name, content, amount },
    file,
  } = req;
  try {
    await Item.create({
      name,
      itemImg: file ? file.path : itemImg,
      content,
      amount,
    });

    return res.redirect("/");
  } catch (error) {
    return res.status(400).render("shop-list", {
      errorMessage: error._message ?? "",
    });
  }
};

export const getShopItem = async (req, res) => {
  const items = await Item.find({}).sort({ createdAt: "desc" }); // find vs findById
  return res.render("./shop/item-list", { items });
};

export const getShopSuccess = (req, res) => {
  return res.render("./shop/shop-success");
};

export const getShop = async (req, res) => {
  const { id } = req.params;
  const item = await Item.findById(id);
  if (!item) {
    return res.render("404");
  }
  return res.render("./shop/shop", { item });
};
//1. axios가 없다 => node-fetch로 대체
//2. Order 모델도 없다

export const postShop = async (req, res) => {
  try {
    //1. 굳이 body에서 받아와야하나? ************** => body-parser가 필요했음
    //2. 데이터 베이스 payments 스키마에 있음 ****************
    const { imp_uid, merchant_uid, id } = req.body; // req의 body에서 imp_uid, merchant_uid 추출
    const {
      session: { user },
    } = req;
    const userId = user._id;

    // 액세스 토큰(access token) 발급 받기
    const item = await Item.findById(id);
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
    //console.log(access_token);
    // imp_uid로 아임포트 서버에서 결제 정보 조회
    const getPaymentData = await (
      await fetch(`https://api.iamport.kr/payments/${imp_uid}`, {
        // imp_uid 전달
        method: "GET", // GET method
        headers: { Authorization: access_token }, // 인증 토큰 Authorization header에 추가
      })
    ).json();

    const paymentData = getPaymentData.response; // 조회한 결제 정보
    //console.log(paymentData.merchant_uid);
    //console.log("paymentData 확인하기:::", paymentData);
    // DB에서 결제되어야 하는 금액 조회
    const newOrder = await Order.create({
      merchantUid: merchant_uid,  
      amount: item.amount,
      cancelAmount: item.amount,
      payMethod: paymentData.pay_method,
      status: paymentData.status,
      item: item,
    });
    const userData = await User.findById(userId);

    //const order = await Order.findById(merchantUid);
    const amountToBePaid = newOrder.amount; // 결제 되어야 하는 금액

    // 결제 검증하기
    const { amount, status } = paymentData;

    if (amount === amountToBePaid) {
      // 결제 금액 일치. 결제 된 금액 === 결제 되어야 하는 금액
      await Order.findOneAndUpdate(newOrder.merchantUid, {
        $set: {
          merchantUid: paymentData.merchant_uid,
          amount: paymentData.amount,
          cancelAmount: paymentData.amount,
          payMethod: paymentData.pay_method,
          status: paymentData.status,
        },
      });

      // DB에 결제 정보 저장
      switch (status) {
        case "ready": // 가상계좌 발급
          const { vbank_num, vbank_date, vbank_name } = paymentData;
          /* 
            - DB에 가상계좌 발급 정보 저장
              const user = await User.findByIdAndUpdate(_id, {
                $set: { vbank_num, vbank_date, vbank_name },
              });
          
            - 가상계좌 발급 안내 문자메시지 발송
              현재 SMS가 없어서 안되는것으로 판단 향후 만들수있다면 꼭 만들어야겠음
              
              SMS.send({
                text: `가상계좌 발급이 성공되었습니다. 계좌 정보 ${vbank_num} ${vbank_date} ${vbank_name}`,
              });
          
          */

          userData.orders.push(newOrder);
          await userData.save();

          res.send({
            status: "vbankIssued",
            message: "가상계좌 발급 성공",
            vbank_num,
            vbank_date,
            vbank_name,
          });
          break;
        case "paid": // 결제 완료
          userData.orders.push(newOrder);
          await userData.save();
          res.send({ status: "success", message: "일반 결제 성공" });
          break;
      }
    } else {
      // 결제 금액 불일치. 위/변조 된 결제
      throw { status: "forgery", message: "위조된 결제시도" };
    }
  } catch (e) {
    res.status(400).send(e);
  }
};


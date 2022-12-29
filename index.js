const express = require("express");
const cors = require("cors");
const axios = require("axios");
const path = require("path");
const request = require("request");
const fs = require("fs");
const nodemailer = require("nodemailer");
const { Firebase } = require("./config.js");
const cityArrWithAllCity = require("./city");
require("dotenv").config();

const Razorpay = require("razorpay");
const razorpay = new Razorpay({
  key_id: process.env.KEY_ID,
  key_secret: process.env.KEY_SECRET,
});

const sheetdb = require("sheetdb-node");
const clientBrand = sheetdb({
  address: process.env.SPREADSHEET + "?sheet=Brand",
});
const clientSpreadsheetToDB = sheetdb({
  address: process.env.SPREADSHEET + "?sheet=SpreadsheetToDB",
});
const clientInfluencer = sheetdb({
  address: process.env.SPREADSHEET + "?sheet=Influencer",
});
const clientCampaign = sheetdb({
  address: process.env.SPREADSHEET + "?sheet=Campaign",
});
const clientNonInfluencer = sheetdb({
  address: process.env.SPREADSHEET + "?sheet=NonInfluencer",
});
const clientPinkskyPopup = sheetdb({
  address: process.env.SPREADSHEET + "?sheet=PinkskyPopup",
});
const clientNamePhonenumber = sheetdb({
  address: process.env.SPREADSHEET + "?sheet=NamePhonenumber",
});
const clientFeedback = sheetdb({
  address: process.env.SPREADSHEET + "?sheet=Feedback",
});

const app = express();
const PORT =
  process.env.NODE_ENV === "Production" ? process.env.PORT || 5000 : 5000;

app.use(express.json());
app.use(cors());

// WHATSAPP AND EMAIL SECTION
// 1. sending messages
app.post("/api/template/whatsapp", async (req, res) => {
  try {
    let queryType = req.query.type;
    let queryTo = req.query.to;
    var data = {};
    var transporter = nodemailer.createTransport({
      service: process.env.EML_PROVIDER,
      auth: {
        user: process.env.EML_USER,
        pass: process.env.EML_PASS,
      },
    });
    //coupon
    if (queryType === "coupon") {
      data = JSON.stringify({
        messaging_product: "whatsapp",
        to: queryTo,
        type: "template",
        template: {
          name: "sample_shipping_confirmation",
          language: {
            code: "en_US",
          },
          components: [
            {
              type: "body",
              parameters: [
                {
                  type: "text",
                  text: "something",
                },
              ],
            },
          ],
        },
      });

      var mailOptions = {
        from: process.env.EML_USER,
        to: "gargchitvan99@gmail.com",
        subject: "Test Coupon Email",
        text: `Hi there, is this thing working? <strong>This is strong string.</strong>`,
      };
    }

    const size = Object.keys(data).length;
    if (size > 0) {
      var config = {
        method: "post",
        url: process.env.WAPP_SENDMESSTEXT_UATURL_PRMNTOKN,
        headers: {
          "Content-Type": "application/json",
          Authorization: process.env.WAPP_AUTH_PRMNTOKN,
        },
        data: data,
      };

      axios(config)
        .then(function (response) {
          // console.log(JSON.stringify(response.data));
          transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
              res.status(200).json({ data: error, status: 0 });
            } else {
              res.status(200).json({
                data: { whatsapp: response.data, email: info.response },
                status: 1,
              });
            }
          });
        })
        .catch(function (error) {
          res.status(200).json({ data: error, status: 0 });
        });
    }
  } catch (error) {
    res.status(200).json({ data: error, status: 0 });
  }
});

// RAZORPAY SECTION
// 1. Webhook callback
app.post("/api/verify/razorpay", async (req, res) => {
  try {
    const secret = process.env.WEBHOOK_SECRET;

    const crypto = require("crypto");

    const shasum = crypto.createHmac("sha256", secret);
    shasum.update(JSON.stringify(req.body));
    const digest = shasum.digest("hex");

    if (digest === req.headers["x-razorpay-signature"]) {
      // require("fs").writeFileSync(
      //   "payment2.json",
      //   JSON.stringify(req.body, null, 4)
      // );
      console.log("something");
      if (req.body.event === "subscription.activated") {
        const updating = await Firebase.Brand.doc(
          req.body.payload.subscription.entity.notes.pinksky_id
        ).update({
          subscription: req.body,
        });
        res.status(200).json({ message: "Subscription Activated" });
      }

      if (req.body.event === "payment_link.paid") {
        if (req.body.payload.payment_link.entity.notes.influencer === "true") {
          const snapshot = await Firebase.Influencer.doc(
            req.body.payload.payment_link.entity.notes.pinksky_id
          ).get();
          if (snapshot.data().pinkskymember.isMember !== true) {
            const updated = await Firebase.Influencer.doc(
              req.body.payload.payment_link.entity.notes.pinksky_id
            ).update({
              pinkskymember: {
                isMember: true,
                cooldown: new Date(
                  new Date().setFullYear(new Date().getFullYear() + 1)
                ),
                history: req.body,
              },
            });
            res.status(200).json({ message: "Mapped User as member" });
          }
        } else if (
          req.body.payload.payment_link.entity.notes.non_Influencer === "true"
        ) {
          const nonsnapshot = await Firebase.NonInfluencer.doc(
            req.body.payload.payment_link.entity.notes.pinksky_id
          ).get();
          if (nonsnapshot.data().pinkskymember.isMember !== true) {
            await Firebase.NonInfluencer.doc(
              req.body.payload.payment_link.entity.notes.pinksky_id
            ).update({
              pinkskymember: {
                isMember: true,
                cooldown: new Date(
                  new Date().setFullYear(new Date().getFullYear() + 1)
                ),
                history: req.body,
              },
            });
            res.status(200).json({ message: "Mapped User as member" });
          }
        }else if (
          req.body.payload.payment_link.entity.notes.brand === "true"
        ) {
          const brandsnapshot = await Firebase.Brand.doc(
            req.body.payload.payment_link.entity.notes.pinksky_id
          ).get();
          if (brandsnapshot.data().pinkskymember.isMember !== true) {
            await Firebase.Brand.doc(
              req.body.payload.payment_link.entity.notes.pinksky_id
            ).update({
              pinkskymember: {
                isMember: true,
                cooldown: new Date(
                  new Date().setFullYear(new Date().getFullYear() + 1)
                ),
                history: req.body,
              },
            });
            res.status(200).json({ message: "Mapped User as member" });
          }
        }
      }
    }
  } catch (error) {
    res.status(500).json({
      message:
        "Error Occured Webhook configuring! Malicious Happening. " + error,
    });
  }
});

// 2. Pinksky subscription
app.post("/api/subscription/razorpay", async (req, res) => {
  try {
    let data = req.body;
    console.log(data);
    let planid = "";
    if (data.brandCategoryFormValue === "Cafe") {
      planid = process.env.PLN_CAFE;
    } else if (data.brandCategoryFormValue === "Club") {
      planid = process.env.PLN_CLUB;
    } else if (data.brandCategoryFormValue === "Booth") {
      planid = process.env.PLN_BOOTH;
    } else if (data.brandCategoryFormValue === "Salon") {
      planid = process.env.PLN_SALON;
    } else if (data.brandCategoryFormValue === "Gym") {
      planid = process.env.PLN_GYM;
    } else if (data.brandCategoryFormValue === "Professionals") {
      planid = process.env.PLN_PROFESSIONAL;
    } else {
      //nothing
    }

    const options = {
      plan_id: planid,
      customer_notify: 1,
      quantity: 1,
      total_count: data.monthFormValue.split(" ")[0],
      // start_at: 1495995837,
      // addons: [
      //   {
      //     item: {
      //       name: "Delivery charges",
      //       amount: 30000,
      //       currency: "INR"
      //     }
      //   }
      // ],
      notes: {
        pinksky_id: data.id,
        displayName: data.displayName,
      },
    };
    const response = await razorpay.subscriptions.create(options);

    res.status(200).json({
      url: response.short_url,
      message: "Generate Subscribe Link",
      heading: process.env.FRNT_SUBSCRIPTION_HEADING,
    });
  } catch (error) {
    res.status(500).json(error);
  }
});

// 3. Pinsky coupons
app.post("/api/getcouponmessage/razorpay", async (req, res) => {
  try {
    let response = req.body;

    if (response.isMember === false) {
      let paymentLink = {};
      let snapshot = null;
      if (response.isInfluencer === "true") {
        snapshot = await Firebase.Influencer.doc(response.id).get();
      }
      if (response.isBrand === "true") {
        snapshot = await Firebase.Brand.doc(response.id).get();
      }
      if (response.isNonInfluencer === "true") {
        snapshot = await Firebase.NonInfluencer.doc(response.id).get();
      }
      paymentLink = await razorpay.paymentLink.create({
        amount: parseInt(process.env.MEM_AMOUNT),
        currency: "INR",
        accept_partial: true,
        // first_min_partial_amount: 100,
        // description: "For XYZ purpose",
        customer: {
          name: snapshot.data().name,
          email: snapshot.data().email,
          contact: snapshot.data().whatsappnumber,
        },
        notify: {
          sms: true,
          email: true,
          whatsapp: true
        },
        reminder_enable: true,
        notes: {
          pinksky_id: response.id,
          influencer: response.isInfluencer,
          non_Influencer: response.isNonInfluencer,
          brand: response.isBrand,
        },
        // callback_url: "https://example-callback-url.com/",
        // callback_method: "get"
      });
      console.log(paymentLink);

      res.status(200).json({
        url: paymentLink.short_url,
        message: "Generate Coupon Payment Link",
        heading: process.env.FRNT_SUBSCRIPTION_HEADING,
      });
    } else {
      const snapshot = await Firebase.Coupons.doc(response.data.id).get();
      await Firebase.Coupons.doc(response.data.id).update({
        userCouponMapping: [...snapshot.data().userCouponMapping, response.id],
      });
      console.log("here 1");
      setTimeout(() => {
        console.log("here 2");

        res.status(200).json({ message: "Notified" });
      }, 2000);
    }
  } catch (error) {
    res.status(500).json(error);
  }
});

// SPREADSHEET SECTION
// 1. Sending data from firebase to spreadsheet
app.post("/api/firebasetospreadsheet", async (req, res) => {
  try {
    let isValid = 1;
    //Influencer
    const snapshot = await Firebase.Influencer.get();
    let influencerData = [];
    snapshot.docs.map(async (doc) => {
      if (doc.data().dbInserted === 0 || doc.data().dbInserted == undefined) {
        influencerData.push({
          id: doc.id,
          city: doc.data().city,
          email: doc.data().email,
          gender: doc.data().gender,
          instagramurl: doc.data().instagramurl,
          name: doc.data().name,
          phonenumber: doc.data().phonenumber,
          surname: doc.data().surname,
          whatsappnumber: doc.data().whatsappnumber,
        });
        await Firebase.Influencer.doc(doc.id).update({
          dbInserted: 1,
        });
      } else {
        console.log({ id: doc.id, dbInserted: doc.data().dbInserted });
      }
    });
    if (influencerData.length > 0) {
      clientInfluencer.create(influencerData).then(
        function (data) {
          console.log(data);
        },
        function (err) {
          isValid = 0;
          throw err;
        }
      );
    }

    //Brand
    const brandsnapshot = await Firebase.Brand.get();
    let brandData = [];
    brandsnapshot.docs.map(async (doc) => {
      if (doc.data().dbInserted === 0 || doc.data().dbInserted == undefined) {
        brandData.push({
          id: doc.id,
          companyname: doc.data().companyname,
          designation: doc.data().designation,
          email: doc.data().email,
          instagramurl: doc.data().instagramurl,
          name: doc.data().name,
          phonenumber: doc.data().phonenumber,
          city: doc.data().city,
          whatsappnumber: doc.data().whatsappnumber,
        });
        await Firebase.Brand.doc(doc.id).update({
          dbInserted: 1,
        });
      } else {
        console.log({ id: doc.id, dbInserted: doc.data().dbInserted });
      }
    });

    if (brandData.length > 0) {
      clientBrand.create(brandData).then(
        function (data) {
          console.log(data);
        },
        function (err) {
          isValid = 0;
          throw err;
        }
      );
    }

    //Campaign
    const campaignsnapshot = await Firebase.Campaign.get();
    let campaignData = [];
    campaignsnapshot.docs.map(async (doc) => {
      if (doc.data().dbInserted === 0 || doc.data().dbInserted == undefined) {
        campaignData.push({
          id: doc.id,
          brandcategory: doc.data().brandcategory,
          city: doc.data().city,
          name: doc.data().name,
          paidPrivilege: doc.data().viewerDetails.paidPrivilege,
          pinkskyPrivilege: doc.data().viewerDetails.pinkskyPrivilege,
        });
        await Firebase.Campaign.doc(doc.id).update({
          dbInserted: 1,
        });
      } else {
        console.log({ id: doc.id, dbInserted: doc.data().dbInserted });
      }
    });

    if (campaignData.length > 0) {
      clientCampaign.create(campaignData).then(
        function (data) {
          console.log(data);
        },
        function (err) {
          isValid = 0;
          throw err;
        }
      );
    }

    //NonInfluencer
    const noninfluencersnapshot = await Firebase.NonInfluencer.get();
    let noninfluencerData = [];
    noninfluencersnapshot.docs.map(async (doc) => {
      if (doc.data().dbInserted === 0 || doc.data().dbInserted == undefined) {
        noninfluencerData.push({
          id: doc.id,
          email: doc.data().email,
          instagramid: doc.data().instagramid,
          name: doc.data().name,
          whatsappnumber: doc.data().whatsappnumber,
        });
        await Firebase.NonInfluencer.doc(doc.id).update({
          dbInserted: 1,
        });
      } else {
        console.log({ id: doc.id, dbInserted: doc.data().dbInserted });
      }
    });

    if (noninfluencerData.length > 0) {
      clientNonInfluencer.create(noninfluencerData).then(
        function (data) {
          console.log(data);
        },
        function (err) {
          isValid = 0;
          throw err;
        }
      );
    }

    //Pinksky Popup
    const pinkskyPopupsnapshot = await Firebase.PinkskyPopup.get();
    let pinkskyPopupData = [];
    pinkskyPopupsnapshot.docs.map(async (doc) => {
      if (doc.data().dbInserted === 0 || doc.data().dbInserted == undefined) {
        pinkskyPopupData.push({
          id: doc.id,
          targetage: doc.data().age,
          brandname: doc.data().brandname,
          email: doc.data().email,
          targetgender: doc.data().gender,
          instagramid: doc.data().instagramid,
          name: doc.data().name,
          whatdoyousell: doc.data().whatdoyousell,
          yesnoppe: doc.data().yesnoppe,
          whatsappnumber: doc.data().whatsappnumber,
        });
        await Firebase.PinkskyPopup.doc(doc.id).update({
          dbInserted: 1,
        });
      } else {
        console.log({ id: doc.id, dbInserted: doc.data().dbInserted });
      }
    });

    if (pinkskyPopupData.length > 0) {
      clientPinkskyPopup.create(pinkskyPopupData).then(
        function (data) {
          console.log(data);
        },
        function (err) {
          isValid = 0;
          throw err;
        }
      );
    }

    //Random Data
    const randomDatasnapshot = await Firebase.RandomData.get();
    let randomData = [];
    randomDatasnapshot.docs.map(async (doc) => {
      if (doc.data().dbInserted === 0 || doc.data().dbInserted == undefined) {
        randomData.push({
          id: doc.id,
          category: doc.data().category,
          name: doc.data().name,
          number: doc.data().number,
          userid: doc.data().userid,
        });
        await Firebase.RandomData.doc(doc.id).update({
          dbInserted: 1,
        });
      } else {
        console.log({ id: doc.id, dbInserted: doc.data().dbInserted });
      }
    });

    if (randomData.length > 0) {
      clientNamePhonenumber.create(randomData).then(
        function (data) {
          console.log(data);
        },
        function (err) {
          isValid = 0;
          throw err;
        }
      );
    }

    //Feedback
    const feedbackDatasnapshot = await Firebase.Feedback.get();
    let feedbackData = [];
    feedbackDatasnapshot.docs.map(async (doc) => {
      if (doc.data().dbInserted === 0 || doc.data().dbInserted == undefined) {
        feedbackData.push({
          id: doc.id,

          name: doc.data().name,
          message: doc.data().message,
        });
        await Firebase.Feedback.doc(doc.id).update({
          dbInserted: 1,
        });
      } else {
        console.log({ id: doc.id, dbInserted: doc.data().dbInserted });
      }
    });

    if (feedbackData.length > 0) {
      clientFeedback.create(feedbackData).then(
        function (data) {
          console.log(data);
        },
        function (err) {
          isValid = 0;
          throw err;
        }
      );
    }

    if (isValid === 1) {
      res
        .status(200)
        .json({ message: "Excel Updated", url: process.env.SPREADSHEET_URL });
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

// 2. Sending data from spreadsheet to firebase
app.get("/api/spreadsheettofirebase", async (req, res) => {
  try {
    clientSpreadsheetToDB.read().then(
      function (data) {
        let value = JSON.parse(data);
        let interval = 60000;

        value.forEach((item, index) => {
          setTimeout(() => {
            let addvalue = {
              ...item,
              admin: false,
              campaignmapping: [],
              eventmapping: [],
              pinkskymember: {
                isMember: false,
                cooldown: null,
              },
              paymentdetails: {},
              isTeam: "new",
              status: "new",
              dob: "",
              address: "",
              isNonInfluencer: "",
              city: "",
              category: [
                {
                  href: "/influencer",
                  id: 2,
                  status: false,
                  label: "Lifestyle Category",
                  value: "Lifestyle",
                  icon: {
                    _store: {},
                    key: null,
                    _owner: null,
                    type: "img",
                    ref: null,
                    props: {
                      loading: "lazy",
                      src: "/static/media/healthy-lifestyle.adbd2600d92cbd99718b.png",
                      width: "25px",
                      height: "25px",
                    },
                  },
                },
              ],
            };
            axios
              .post(
                process.env.NODE_ENV === "Production"
                  ? process.env.BASE_URL_PRODUCTION
                  : process.env.BASE_URL_LOCAL +
                      "influencer/create?isProfileCompleted=0",
                addvalue
              )
              .then((response) => {
                res.status(200).json(response.data);
              })
              .catch((error) => {
                console.log(error);
                res.status(500).json(error.response.data);
              });
          }, index * interval);
        });
      },
      function (error) {
        console.log(error);
      }
    );
  } catch (err) {
    res.status(500).json(err);
  }
});

// AUTHENTICATION SECTION
// 1. Forgot Password
app.post("/api/forgotpassword", async (req, res) => {
  try {
    await Firebase.firebase
      .auth()
      .sendPasswordResetEmail(req.body.email)
      .catch((error) => {
        throw error;
      });
    console.log("email sent1");
    res.status(200).json({ message: "Forgot Password" });
  } catch (error) {
    res.status(500).json({ message: error });
  }
});

// 2. Sign into pinksky
app.post("/api/signin", async (req, res) => {
  try {
    const createUser = {
      email: req.body.email,
      password: req.body.password,
    };
    console.log(createUser);
    const userResponse = await Firebase.firebase
      .auth()
      .signInWithEmailAndPassword(createUser.email, createUser.password)
      .catch((error) => {
        throw error;
      });
    // console.log("userResponse.user.displayName", userResponse.user);
    if (userResponse.user.displayName != null) {
      if (userResponse.user.displayName.indexOf("Brand") != -1) {
        //Brand
        const snapshot = await Firebase.Brand.get();
        let brandData = [];
        snapshot.docs.map((doc) => {
          if (doc.data().email === createUser.email) {
            brandData.push({ id: doc.id, ...doc.data() });
          }
        });
        var difference =
          new Date().getTime() - brandData[0].updatedDate.toDate().getTime();

        var daysDifference = Math.floor(difference / 1000 / 60 / 60 / 24);
        console.log("daysDifference", daysDifference);
        if (daysDifference > 15) {
          console.log("inside", brandData[0].instagramurl);
          let brandSchema = null;
          const options = {
            method: "GET",
            url: process.env.RAPID_USERINFO_URL + brandData[0].instagramurl,
            headers: {
              "X-RapidAPI-Key": process.env.RapidAPIKey,
              "X-RapidAPI-Host": process.env.RapidAPIHost,
            },
          };

          await axios
            .request(options)
            .then(function (response) {
              console.log("inside2", response.data);

              brandSchema = {
                ...brandData[0],
                instagram: {
                  id: response.data.data.id,
                  is_business_account: response.data.data.is_business_account,
                  external_url: response.data.data.external_url,
                  followers: response.data.data.edge_followed_by.count,
                  edge_follow: response.data.data.edge_follow.count,
                  is_private: response.data.data.is_private,
                  is_verified: response.data.data.is_verified,
                },
                updatedDate: new Date(),
              };
              setTimeout(async () => {
                await Firebase.Brand.doc(brandData[0].id).update(brandSchema);
                res.status(200).json({
                  message: {
                    displayName: userResponse.user.displayName,
                    id: brandData[0].id,
                    // email: createUser.email,
                    email: brandData[0].email,
                    type: "Brand",
                    status: brandData[0].status,
                    member: false,
                    uuid: userResponse.user.uid,
                  },
                });
              }, 2000);
            })
            .catch(function (error) {
              throw error;
            });
        } else {
          res.status(200).json({
            message: {
              displayName: userResponse.user.displayName,
              id: brandData[0].id,
              email: brandData[0].email,
              type: "Brand",
              status: brandData[0].status,
              member: false,
              uuid: userResponse.user.uid,
            },
          });
        }
      } else if (
        userResponse.user.displayName.indexOf("Non_Influencer") != -1
      ) {
        let noninfluencerData = [];
        const snapshot = await Firebase.NonInfluencer.get();
        snapshot.docs.map((doc) => {
          if (doc.data().email === createUser.email) {
            noninfluencerData.push({ id: doc.id, ...doc.data() });
          }
        });

        let isMember = false;
        if (noninfluencerData[0].pinkskymember.cooldown === null) {
          isMember = false;
        } else {
          if (
            new Date(
              noninfluencerData[0].pinkskymember.cooldown.seconds * 1000
            ) < new Date()
          ) {
            await Firebase.NonInfluencer.doc(noninfluencerData[0].id).update({
              pinkskymember: {
                isMember: false,
                cooldown: null,
              },
            });
            isMember = false;
          } else {
            isMember = true;
          }
        }
        console.log("here", noninfluencerData);

        res.status(200).json({
          message: {
            displayName: userResponse.user.displayName,
            id: noninfluencerData[0].id,
            // email: createUser.email,
            email: noninfluencerData[0].email,

            type: "Non_Influencer",
            status: "",
            member: isMember,
            uuid: userResponse.user.uid,
          },
        });
      } else {
        console.log("2");
        let influencerData = [];
        const snapshot = await Firebase.Influencer.get();
        snapshot.docs.map((doc) => {
          if (doc.data().email === createUser.email) {
            influencerData.push({ id: doc.id, ...doc.data() });
          }
        });

        let isMember = false;
        if (influencerData[0].pinkskymember.cooldown == null) {
          console.log("Here 1");
          isMember = false;
        } else {
          console.log("Here 2");
          if (
            new Date(influencerData[0].pinkskymember.cooldown.seconds * 1000) <
            new Date()
          ) {
            await Firebase.Influencer.doc(influencerData[0].id).update({
              pinkskymember: {
                isMember: false,
                cooldown: null,
              },
            });
            isMember = false;
          } else {
            isMember = true;
          }
        }

        var difference =
          new Date().getTime() -
          influencerData[0].updatedDate.toDate().getTime();

        var daysDifference = Math.floor(difference / 1000 / 60 / 60 / 24);
        console.log("daysDifference", daysDifference);
        if (daysDifference > 15) {
          console.log("inside");
          let influencerSchema = null;
          const options = {
            method: "GET",
            url:
              process.env.RAPID_USERINFO_URL + influencerData[0].instagramurl,
            headers: {
              "X-RapidAPI-Key": process.env.RapidAPIKey,
              "X-RapidAPI-Host": process.env.RapidAPIHost,
            },
          };
          let instagramPostDetails = [];
          await axios
            .request(options)
            .then(function (response) {
              let sum = 0;
              let count = 0;

              response.data.data.edge_owner_to_timeline_media.edges.map(
                (item) => {
                  // console.log(item);
                  sum =
                    sum +
                    item.node.edge_media_to_comment.count +
                    item.node.edge_liked_by.count;
                  if (count <= 4) {
                    console.log("item.node.shortcode", item.node.shortcode);
                    let itemData = {
                      id: item.node.id,
                      shortcode: item.node.shortcode,
                      display_url: item.node.display_url,
                      caption:
                        item.node.edge_media_to_caption.edges[0].node.text,
                      edge_media_to_comment:
                        item.node.edge_media_to_comment.count,
                      edge_liked_by: item.node.edge_liked_by.count,
                    };

                    instagramPostDetails.push(itemData);
                  }
                  count++;
                }
              );
              console.log("SUM", sum);
              let engagementRate =
                sum / response.data.data.edge_followed_by.count;
              //* 1000;
              console.log("ENGAGEMENT RATE", engagementRate);

              influencerSchema = {
                ...influencerData[0],
                imgURL1: response.data.data.profile_pic_url_hd,
                imgURL2: instagramPostDetails[0].display_url,
                imgURL3: instagramPostDetails[1].display_url,
                imgURL4: instagramPostDetails[2].display_url,
                imgURL5: instagramPostDetails[3].display_url,
                instagram: {
                  engagementRate:
                    engagementRate.toString().replace(".", "").substring(0, 1) +
                    "." +
                    engagementRate.toString().replace(".", "").substring(1, 3),
                  id: response.data.data.id,
                  is_business_account: response.data.data.is_business_account,
                  external_url: response.data.data.external_url,
                  followers: response.data.data.edge_followed_by.count,
                  edge_follow: response.data.data.edge_follow.count,
                  is_private: response.data.data.is_private,
                  is_verified: response.data.data.is_verified,
                },
                updatedDate: new Date(),
              };
            })
            .catch(function (error) {
              throw error;
            });

          let interval = 8500;
          let lengthOfArray = instagramPostDetails.length - 1;
          // let influencerArr = [];
          console.log("lengthOfArray", lengthOfArray);
          instagramPostDetails.forEach((file, index) => {
            setTimeout(() => {
              console.log("hi people", interval * index);

              const d = new Date();
              let month = d.getMonth() + 1;
              let date = d.getDate();
              let year = d.getFullYear();
              let time = d.getTime();
              const fileName =
                index +
                "_" +
                userResponse.user.displayName +
                "_" +
                month +
                "_" +
                date +
                "_" +
                year +
                "_" +
                time +
                ".jpeg";
                let filePath = path.join(__dirname, "/images", fileName);
                //let filePath = "./images/" + fileName;
              const options = {
                url: file.display_url,
                method: "GET",
              };
              console.log("fileName", fileName);
              let getDownloadURL = "";
              request(options, async (err, resp, body) => {
                if (resp.statusCode === 200) {
                  console.log("res.statusCode", resp.statusCode);
                  var bucket = Firebase.admin.storage().bucket();

                  await bucket.upload(filePath);
                  let fileFirebaseURL = process.env.FIRESTORE_URL + fileName;
                  console.log("------Here------");
                  console.log(fileFirebaseURL);
                  axios
                    .get(fileFirebaseURL)
                    .then((response) => {
                      getDownloadURL =
                        process.env.FIRESTORE_URL +
                        `${fileName}?alt=media&token=${response.data.downloadTokens}`;
                      instagramPostDetails[index].new_url = getDownloadURL;
                      console.log("index", index);
                      fs.unlinkSync(filePath);
                      if (index === lengthOfArray) {
                        console.log("inside");

                        influencerSchema = {
                          ...influencerSchema,
                          imgURL1: instagramPostDetails[0]?.new_url,
                          imgURL2: instagramPostDetails[1]?.new_url,
                          imgURL3: instagramPostDetails[2]?.new_url,
                          imgURL4: instagramPostDetails[3]?.new_url,
                          imgURL5: instagramPostDetails[4]?.new_url,
                        };
                        console.log("influencerSchema", influencerSchema);
                        setTimeout(async () => {
                          console.log("inside2");

                          await Firebase.Influencer.doc(
                            influencerData[0].id
                          ).update(influencerSchema);

                          res.status(200).json({
                            message: {
                              displayName: userResponse.user.displayName,
                              id: influencerData[0].id,
                              email: influencerData[0].email,
                              type: "Influencer",
                              status: influencerData[0].status,
                              member: isMember,
                              uuid: userResponse.user.uid,
                            },
                          });
                        }, 4000);
                      }
                    })
                    .catch((error) => {
                      throw error;
                    });
                }
              }).pipe(fs.createWriteStream(filePath));
            }, index * interval);
          });
        } else {
          res.status(200).json({
            message: {
              displayName: userResponse.user.displayName,
              id: influencerData[0].id,
              email: influencerData[0].email,
              type: "Influencer",
              status: influencerData[0].status,
              member: isMember,
              uuid: userResponse.user.uid,
            },
          });
        }
      }
    } else {
      res.status(500).json({ message: "Invalid User" });
    }
  } catch (error) {
    res.status(500).json({ message: error });
  }
});

// PROFILE PAGE SECTION
// 1. Influencer
app.post("/api/influencer", async (req, res) => {
  try {
    console.log(req.body);
    const snapshot = await Firebase.Influencer.doc(req.body.id).get();

    let list = [];
    //add event and campaign different and show on profile
    snapshot.data().message.map(async (doc) => {
      if (doc.eventId) {
        console.log(doc.statusID);
        const eventsnapshot = await Firebase.Event.doc(doc.eventId).get();
        list.push({ ...doc, eventDetails: { ...eventsnapshot.data() } });
      }
      if (doc.campaignID) {
        console.log(doc.statusID);
        const campaignsnapshot = await Firebase.Campaign.doc(
          doc.campaignID
        ).get();
        list.push({ ...doc, campaignDetails: { ...campaignsnapshot.data() } });
      }
    });
    console.log("list", list);
    setTimeout(() => {
      let influencerprofiledata = {
        ...snapshot.data(),
        message: list,
      };
      console.log("influencerprofiledata", influencerprofiledata);

      res
        .status(200)
        .json({ data: [influencerprofiledata], message: "Fetched Influencer" });
    }, 2000);
  } catch (error) {
    res.status(500).json({ message: error });
  }
});

// 2. Non-influencer
app.post("/api/noninfluencer", async (req, res) => {
  try {
    console.log(req.body);
    const snapshot = await Firebase.NonInfluencer.doc(req.body.id).get();

    setTimeout(() => {
      let noninfluencerprofiledata = {
        ...snapshot.data(),
        // message: list,
      };
      console.log("noninfluencerprofiledata", noninfluencerprofiledata);

      res.status(200).json({
        data: [noninfluencerprofiledata],
        message: "Fetched Non Influencer",
      });
    }, 2000);
  } catch (error) {
    res.status(500).json({ message: error });
  }
});

// 3. Brand
app.post("/api/brand", async (req, res) => {
  try {
    console.log(req.body);
    const snapshot = await Firebase.Brand.doc(req.body.id).get();

    console.log("yahaan hoon");
    let brandprofiledata = {
      ...snapshot.data(),
    };

    res
      .status(200)
      .json({ data: [brandprofiledata], message: "Fetched Brand" });
  } catch (error) {
    res.status(500).json({ message: error });
  }
});

// COUPON, HOME, ADMIN PAGE SECTION
// 1. Coupons Page
app.get("/api/coupons", async (req, res) => {
  try {
    const snapshotcoupon = await Firebase.Coupons.get();
    let couponlist = [];
    snapshotcoupon.docs.map((doc) => {
      if (doc.data().isActive === 1) {
        couponlist.push({ id: doc.id, ...doc.data() });
      }
    });

    res.status(200).json({
      couponlist: couponlist,
      message: "Fetched Coupon Page",
    });
  } catch (error) {
    res.status(500).json({ message: error });
  }
});

// 2. Home Page
app.post("/api/home", async (req, res) => {
  try {
    const gallerySnapshot = await Firebase.Gallery.get();
    let gallery = [];
    let exhibitiongallery = [];
    gallerySnapshot.docs.map((doc) => {
      if (doc.data().isActive === 1) {
        if (doc.data().type === "event") {
          gallery.push({ id: doc.id, ...doc.data() });
        } else if (doc.data().type === "exhibition") {
          exhibitiongallery.push({ id: doc.id, ...doc.data() });
        } else {
          //nothing
        }
      }
    });

    //campaign
    const snapshot = await Firebase.Campaign.get();
    let campaignlist = [];
    snapshot.docs.map((doc) => {
      if (doc.data().isActive === 1) {
        campaignlist.push({ id: doc.id, ...doc.data() });
      }
    });

    //influencer
    const snapshotInfl = await Firebase.Influencer.get();
    let influencerlist = [];
    let isMember = false;
    let status = "new";
    snapshotInfl.docs.map((doc) => {
      if (doc.data().status === "accepted") {
        influencerlist.push({ id: doc.id, ...doc.data() });
      }
      if (doc.id === req.body.id) {
        isMember = doc.data().pinkskymember.isMember;
        status = doc.data().status;
      }
    });

    const snapshotNonInfluencer = await Firebase.NonInfluencer.get();
    snapshotNonInfluencer.docs.map((doc) => {
      if (doc.id === req.body.id) {
        isMember = doc.data()?.pinkskymember?.isMember;
      }
    });

    const snapshotBrand = await Firebase.Brand.get();
    snapshotBrand.docs.map((doc) => {
      if (doc.id === req.body.id) {
        isMember = doc.data()?.pinkskymember?.isMember;
        status = doc.data().status;
      }
    });

    //event
    const snapshotevent = await Firebase.Event.get();
    let eventlist = [];
    snapshotevent.docs.map((doc) => {
      if (doc.data().isActive === 1) {
        eventlist.push({ id: doc.id, ...doc.data() });
      }
    });

    //coupon
    const snapshotcoupon = await Firebase.Coupons.get();
    let couponlist = [];
    snapshotcoupon.docs.map((doc) => {
      if (doc.data().isActive === 1) {
        couponlist.push({ id: doc.id, ...doc.data() });
      }
    });

    res.status(200).json({
      isMember: isMember,
      status: status,
      gallerylist: gallery.sort((a, b) => b.createdDate - a.createdDate),
      exhibitiongallerylist: exhibitiongallery.sort(
        (a, b) => b.createdDate - a.createdDate
      ),
      campaignlist: campaignlist
        .sort((a, b) => b.createdDate - a.createdDate)
        .slice(0, 6),
      influencerlist: influencerlist
        .sort((a, b) => b.createdDate - a.createdDate)
        .slice(0, 6),
      eventlist: eventlist.sort((a, b) => b.createdDate - a.createdDate),
      couponlist: couponlist
        .sort((a, b) => b.createdDate - a.createdDate)
        .slice(0, 10),
      message: "Fetched Home",
    });
  } catch (error) {
    res.status(500).json({ message: error });
  }
});

// 3. Admin Pages
app.post("/api/admin/pinksky", async (req, res) => {
  try {
    let data = req.body;

    const getAdmin = await Firebase.Influencer.doc(data.adminid).get();
    console.log("entered", getAdmin.data().admin);

    if (getAdmin.data().admin) {
      if (data.changesTrigger == "" || data.changesTrigger == undefined) {
        //globalAdmin = false;
        console.log("step00");
        const snapshotGallerydata = await Firebase.Gallery.get();
        let gallerylist = [];
        console.log("step0");
        snapshotGallerydata.docs.map((doc) => {
          console.log("step0");
          if (doc.data()?.isActive === 1) {
            gallerylist.push({ id: doc.id, ...doc.data() });
          } else {
            //move
          }
        });

        let ramdomdatalist = [];

        console.log("step1");
        const snapshotCoupon = await Firebase.Coupons.get();
        let couponlist = [];
        snapshotCoupon.docs.map((doc) => {
          if (doc.data()?.isActive === 1) {
            couponlist.push({ id: doc.id, ...doc.data() });
          } else {
            //move
          }
        });
        console.log("step2");
        const snapshotCamp = await Firebase.Campaign.get();
        let campaignlist = [];
        let rawcampaignlist = [];
        snapshotCamp.docs.map((doc) => {
          if (doc.data()?.isActive === 1) {
            campaignlist.push({ id: doc.id, ...doc.data() });
          }
          rawcampaignlist.push({ id: doc.id, ...doc.data() });
        });
        console.log("step3");
        //event
        const snapshotevent = await Firebase.Event.get();
        let eventlist = [];
        let raweventlist = [];
        snapshotevent.docs.map((doc) => {
          if (doc.data().isActive === 1) {
            eventlist.push({ id: doc.id, ...doc.data() });
          }
          raweventlist.push({ id: doc.id, ...doc.data() });
        });
        console.log("step4");
        //influencer
        const snapshotInfl = await Firebase.Influencer.get();
        let influencerlist = [];

        console.log("step5");
        snapshotInfl.docs.map((doc) => {
          let localcampaignmapping = [];
          let localeventmapping = [];
          if (doc.data().status === "new") {
            influencerlist.push({
              id: doc.id,
              ...doc.data(),
            });
          } else if (doc.data().status === "accepted") {
            console.log("influencerlist6", doc.id);
            console.log("influencerlist6?", doc.data()?.campaignmapping);
            if (
              doc.data()?.campaignmapping === undefined ||
              doc.data()?.campaignmapping.length === 0
            ) {
              localcampaignmapping = [];
            } else {
              console.log("influencerlist66");
              doc.data().campaignmapping.map((nesitem) => {
                console.log("influencerlist666");
                localcampaignmapping.push({
                  ...nesitem,
                  name:
                    rawcampaignlist.filter(
                      (fun) => fun.id === nesitem.campaignId
                    )[0].name || "",
                  category:
                    rawcampaignlist.filter(
                      (fun) => fun.id === nesitem.campaignId
                    )[0].category || [],
                });
              });
            }

            console.log("influencerlist7");
            if (
              doc.data()?.eventmapping === undefined ||
              doc.data()?.eventmapping.length === 0
            ) {
              localeventmapping = [];
            } else {
              console.log("influencerlist77");
              doc.data().eventmapping.map((nesitem) => {
                console.log("influencerlist777");

                localeventmapping.push({
                  ...nesitem,
                  name:
                    raweventlist.filter((fun) => fun.id === nesitem.eventId)[0]
                      .name || "",
                });
              });
            }
            console.log("influencerlist1");
            influencerlist.push({
              id: doc.id,
              ...doc.data(),
              campaignmapping: localcampaignmapping,
              eventmapping: localeventmapping,
            });
            console.log("influencerlist2");
          } else {
            console.log("influencerlist3");
          }
        });
        console.log("influencerlist4");

        console.log("step6");
        //brand
        const snapshotbrand = await Firebase.Brand.get();
        let brandlist = [];

        snapshotbrand.docs.map((doc) => {
          let localinfluemapping = [];
          let locallaunchmapping = [];
          console.log("step6kyahai--");
          if (doc.data()?.status === "new") {
            brandlist.push({ id: doc.id, ...doc.data() });
          } else if (doc.data()?.status === "accepted") {
            doc.data().message.map((item) => {
              if (item?.isShowAdmin === true) {
                locallaunchmapping.push(item);
              } else {
                //continue
              }
            });
            console.log("step6?");
            doc.data().influencermapping.map((nesitem) => {
              console.log("Datataatat", nesitem);
              localinfluemapping.push({
                ...nesitem,
                name:
                  influencerlist.filter(
                    (fun) => fun.id === nesitem.influencerId
                  )[0]?.name || "",
                surname:
                  influencerlist.filter(
                    (fun) => fun.id === nesitem.influencerId
                  )[0]?.surname || "",
                phonenumber:
                  influencerlist.filter(
                    (fun) => fun.id === nesitem.influencerId
                  )[0]?.phonenumber || "",
                whatsappnumber:
                  influencerlist.filter(
                    (fun) => fun.id === nesitem.influencerId
                  )[0]?.whatsappnumber || "",
                instagramurl:
                  influencerlist.filter(
                    (fun) => fun.id === nesitem.influencerId
                  )[0]?.instagramurl || "",
                email:
                  influencerlist.filter(
                    (fun) => fun.id === nesitem.influencerId
                  )[0]?.email || "",
                category:
                  influencerlist.filter(
                    (fun) => fun.id === nesitem.influencerId
                  )[0]?.category || "",
              });
            });
            console.log("step6??");
            brandlist.push({
              id: doc.id,
              ...doc.data(),
              influencermapping: localinfluemapping,
              launchmapping: locallaunchmapping,
            });
          }
        });

        let pinkskypopuplist = [];

        console.log("step8");
        res.status(200).json({
          campaignlist: campaignlist,
          influencerlist: influencerlist,
          brandlist: brandlist,
          eventlist: eventlist,
          pinkskypopuplist: pinkskypopuplist,
          couponlist: couponlist,
          ramdomdatalist: ramdomdatalist,
          gallerylist: gallerylist,
          message: "Fetched Admin",
        });
      } else if (data.changesTrigger == "influencer") {
        console.log("step2");
        const snapshotCamp = await Firebase.Campaign.get();
        let rawcampaignlist = [];
        snapshotCamp.docs.map((doc) => {
          rawcampaignlist.push({ id: doc.id, ...doc.data() });
        });
        console.log("step3");
        //event
        const snapshotevent = await Firebase.Event.get();
        // let eventlist = [];
        let raweventlist = [];
        snapshotevent.docs.map((doc) => {
          raweventlist.push({ id: doc.id, ...doc.data() });
        });
        console.log("step4");
        //influencer
        const snapshotInfl = await Firebase.Influencer.get();
        let influencerlist = [];

        console.log("step5");
        snapshotInfl.docs.map((doc) => {
          let localcampaignmapping = [];
          let localeventmapping = [];
          if (doc.data().status === "new") {
            influencerlist.push({
              id: doc.id,
              ...doc.data(),
            });
          } else if (doc.data().status === "accepted") {
            console.log("influencerlist6");
            doc.data().campaignmapping.map((nesitem) => {
              console.log("influencerlist66");
              localcampaignmapping.push({
                ...nesitem,
                name:
                  rawcampaignlist.filter(
                    (fun) => fun.id === nesitem.campaignId
                  )[0].name || "",
                category:
                  rawcampaignlist.filter(
                    (fun) => fun.id === nesitem.campaignId
                  )[0].category || [],
              });
            });
            console.log("influencerlist7");
            doc.data().eventmapping.map((nesitem) => {
              localeventmapping.push({
                ...nesitem,
                name:
                  raweventlist.filter((fun) => fun.id === nesitem.eventId)[0]
                    .name || "",
              });
            });
            console.log("influencerlist1");
            influencerlist.push({
              id: doc.id,
              ...doc.data(),
              campaignmapping: localcampaignmapping,
              eventmapping: localeventmapping,
            });
            console.log("influencerlist2");
          } else {
            console.log("influencerlist3");
          }
        });
        res.status(200).json({
          campaignlist: [],
          influencerlist: influencerlist,
          brandlist: [],
          eventlist: [],
          pinkskypopuplist: [],
          couponlist: [],
          gallerylist: [],
          message: "Fetched Admin",
        });
      } else if (data.changesTrigger == "brand") {
        console.log("step2");
        const snapshotCamp = await Firebase.Campaign.get();

        let rawcampaignlist = [];
        snapshotCamp.docs.map((doc) => {
          rawcampaignlist.push({ id: doc.id, ...doc.data() });
        });
        console.log("step3");
        //event
        const snapshotevent = await Firebase.Event.get();
        let raweventlist = [];
        snapshotevent.docs.map((doc) => {
          raweventlist.push({ id: doc.id, ...doc.data() });
        });
        console.log("step4");
        //influencer
        const snapshotInfl = await Firebase.Influencer.get();
        let influencerlist = [];

        console.log("step5");
        snapshotInfl.docs.map((doc) => {
          let localcampaignmapping = [];
          let localeventmapping = [];
          if (doc.data().status === "new") {
            influencerlist.push({
              id: doc.id,
              ...doc.data(),
            });
          } else if (doc.data().status === "accepted") {
            console.log("influencerlist6");
            doc.data().campaignmapping.map((nesitem) => {
              console.log("influencerlist66");
              localcampaignmapping.push({
                ...nesitem,
                name:
                  rawcampaignlist.filter(
                    (fun) => fun.id === nesitem.campaignId
                  )[0].name || "",
                category:
                  rawcampaignlist.filter(
                    (fun) => fun.id === nesitem.campaignId
                  )[0].category || [],
              });
            });
            console.log("influencerlist7");
            doc.data().eventmapping.map((nesitem) => {
              localeventmapping.push({
                ...nesitem,
                name:
                  raweventlist.filter((fun) => fun.id === nesitem.eventId)[0]
                    .name || "",
              });
            });
            console.log("influencerlist1");
            influencerlist.push({
              id: doc.id,
              ...doc.data(),
              campaignmapping: localcampaignmapping,
              eventmapping: localeventmapping,
            });
            console.log("influencerlist2");
          } else {
            console.log("influencerlist3");
          }
        });

        const snapshotbrand = await Firebase.Brand.get();
        let brandlist = [];

        snapshotbrand.docs.map((doc) => {
          let localinfluemapping = [];
          let locallaunchmapping = [];
          if (doc.data()?.status === "new") {
            brandlist.push({ id: doc.id, ...doc.data() });
          } else if (doc.data()?.status === "accepted") {
            doc.data().message.map((item) => {
              if (item.isShowAdmin === true) {
                locallaunchmapping.push(item);
              }
            });
            doc.data().influencermapping.map((nesitem) => {
              localinfluemapping.push({
                ...nesitem,
                name:
                  influencerlist.filter(
                    (fun) => fun.id === nesitem.influencerId
                  )[0].name || "",
                surname:
                  influencerlist.filter(
                    (fun) => fun.id === nesitem.influencerId
                  )[0].surname || "",
                phonenumber:
                  influencerlist.filter(
                    (fun) => fun.id === nesitem.influencerId
                  )[0].phonenumber || "",
                whatsappnumber:
                  influencerlist.filter(
                    (fun) => fun.id === nesitem.influencerId
                  )[0].whatsappnumber || "",
                instagramurl:
                  influencerlist.filter(
                    (fun) => fun.id === nesitem.influencerId
                  )[0].instagramurl || "",
                email:
                  influencerlist.filter(
                    (fun) => fun.id === nesitem.influencerId
                  )[0].email || "",
                category:
                  influencerlist.filter(
                    (fun) => fun.id === nesitem.influencerId
                  )[0].category || "",
              });
            });
            brandlist.push({
              id: doc.id,
              ...doc.data(),
              influencermapping: localinfluemapping,
              launchmapping: locallaunchmapping,
            });
          }
        });
        res.status(200).json({
          campaignlist: [],
          influencerlist: [],
          brandlist: brandlist,
          eventlist: [],
          pinkskypopuplist: [],
          couponlist: [],
          gallerylist: [],
          message: "Fetched Admin",
        });
      } else if (data.changesTrigger == "campaign") {
        console.log("step2");
        const snapshotCamp = await Firebase.Campaign.get();
        let campaignlist = [];

        snapshotCamp.docs.map((doc) => {
          if (doc.data()?.isActive === 1) {
            campaignlist.push({ id: doc.id, ...doc.data() });
          }
        });
        res.status(200).json({
          campaignlist: campaignlist,
          influencerlist: [],
          brandlist: [],
          eventlist: [],
          pinkskypopuplist: [],
          couponlist: [],
          gallerylist: [],
          message: "Fetched Admin",
        });
      } else if (data.changesTrigger == "event") {
        const snapshotevent = await Firebase.Event.get();
        let eventlist = [];

        snapshotevent.docs.map((doc) => {
          if (doc.data().isActive === 1) {
            eventlist.push({ id: doc.id, ...doc.data() });
          }
        });
        res.status(200).json({
          campaignlist: [],
          influencerlist: [],
          brandlist: [],
          eventlist: eventlist,
          pinkskypopuplist: [],
          couponlist: [],
          gallerylist: [],
          message: "Fetched Admin",
        });
      } else if (data.changesTrigger == "member") {
        console.log("step1");
        const snapshotCoupon = await Firebase.Coupons.get();
        let couponlist = [];
        snapshotCoupon.docs.map((doc) => {
          if (doc.data()?.isActive === 1) {
            couponlist.push({ id: doc.id, ...doc.data() });
          } else {
            //move
          }
        });
        res.status(200).json({
          campaignlist: [],
          influencerlist: [],
          brandlist: [],
          eventlist: [],
          pinkskypopuplist: [],
          couponlist: couponlist,
          gallerylist: [],
          message: "Fetched Admin",
        });
      } else if (data.changesTrigger == "gallery") {
        const snapshotGallerydata = await Firebase.Gallery.get();
        let gallerylist = [];
        console.log("step0");
        snapshotGallerydata.docs.map((doc) => {
          console.log("step0");
          if (doc.data()?.isActive === 1) {
            gallerylist.push({ id: doc.id, ...doc.data() });
          } else {
            //move
          }
        });
        res.status(200).json({
          campaignlist: [],
          influencerlist: [],
          brandlist: [],
          eventlist: [],
          pinkskypopuplist: [],
          couponlist: [],
          gallerylist: gallerylist,
          message: "Fetched Admin",
        });
      } else {
        res.status(401).json({ message: "Failed!" });
      }
    } else {
      res.status(401).json({ message: "Failed!" });
    }
  } catch (error) {
    res.status(500).json({ message: error });
  }
});

// FILTER SECTION
// 1. City filter
app.post("/api/city/filter", async (req, res) => {
  try {
    const data = req.body;
    console.log(data.city);

    let cityvaluearray = [];
    cityArrWithAllCity.map((m) => {
      if (m.value.toLowerCase().indexOf(data.city) !== -1) {
        cityvaluearray.push({ ...m, status: true });
      }
      // else {
      //   cityvaluearray.push({ ...m, status: false });
      // }
    });
    setTimeout(() => {
      res.status(200).json({
        data: cityvaluearray,
        message: "Filtered City",
      });
    }, 1200);
  } catch (error) {
    res.status(500).json({ message: error });
  }
});

// 2. Admin brand filter
app.post("/api/brands/filter", async (req, res) => {
  try {
    let data = req.body;

    const snapshot = await Firebase.Brand.get();
    let list = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    let namesorted;

    if (data.inputValue.toLowerCase() === process.env.ADMIN_BRAND_FILTER_TEXT) {
      namesorted = list;
    } else if (data.inputValue !== "") {
      namesorted = list.filter((item) => {
        if (
          item.companyname
            .toLowerCase()
            .indexOf(data.inputValue.toString().toLowerCase()) !== -1
        ) {
          return item;
        }
      });
    } else {
      namesorted = list;
    }
    console.log("citysorted length", namesorted.length);

    res.status(200).json({ data: namesorted, message: "Filtered Brand" });
  } catch (error) {
    res.status(500).json({ message: error });
  }
});

// 3. Admin event filter
app.post("/api/events/filter", async (req, res) => {
  try {
    let data = req.body;

    const snapshot = await Firebase.Event.get();
    let list = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    let namesorted;
    console.log("step 1");
    if (data.inputValue.toLowerCase() === process.env.ADMIN_EVENT_FILTER_TEXT) {
      namesorted = list;
    } else if (data.inputValue !== "") {
      console.log("step 2");
      namesorted = list.filter((item) => {
        if (
          item.name
            .toLowerCase()
            .indexOf(data.inputValue.toString().toLowerCase()) !== -1
        ) {
          return item;
        }
      });
    } else {
      namesorted = list;
    }
    console.log("citysorted length", namesorted.length);

    res.status(200).json({ data: namesorted, message: "Filtered Event" });
  } catch (error) {
    res.status(500).json({ message: error });
  }
});

// 4. Admin coupons filter
app.post("/api/coupons/filter", async (req, res) => {
  try {
    let data = req.body;

    const snapshot = await Firebase.Coupons.get();
    let list = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    let namesorted;
    console.log("step 1");
    if (
      data.inputValue.toLowerCase() === process.env.ADMIN_COUPON_FILTER_TEXT
    ) {
      namesorted = list;
    } else if (data.inputValue !== "") {
      console.log("step 2");
      namesorted = list.filter((item) => {
        if (
          item.description
            .toLowerCase()
            .indexOf(data.inputValue.toString().toLowerCase()) !== -1
        ) {
          return item;
        }
      });
    } else {
      namesorted = list;
    }
    console.log("namesorted length", namesorted.length);

    res.status(200).json({ data: namesorted, message: "Filtered Coupons" });
  } catch (error) {
    res.status(500).json({ message: error });
  }
});

// 5. Influencer filter
app.post("/api/influencer/filter", async (req, res) => {
  try {
    let data = req.body;

    const snapshot = await Firebase.Influencer.get();
    let list = [];

    snapshot.docs.map((doc) => {
      console.log(doc.id);
      if (doc.data().status === "accepted") {
        list.push({ id: doc.id, ...doc.data() });
      } else {
        //nothing
      }
    });

    let namesorted;
    let agesorted;
    let gendersorted;
    let followersorted;
    let categorysorted;
    let citysorted;

    if (
      data.inputValue.toLowerCase() === process.env.ADMIN_INFLUENCER_FILTER_TEXT
    ) {
      namesorted = list;
    } else if (data.inputValue !== "") {
      namesorted = list.filter((item) => {
        if (
          item.name
            .toLowerCase()
            .indexOf(data.inputValue.toString().toLowerCase()) !== -1
        ) {
          return item;
        }
      });
    } else {
      namesorted = list;
    }
    if (data.radioAgeValue !== "All") {
      agesorted = namesorted.filter((item) => {
        const ageDifMs = Date.now() - new Date(item.dob).getTime();
        const ageDate = new Date(ageDifMs);
        const age = Math.abs(ageDate.getUTCFullYear() - 1970);

        if (data.radioAgeValue === "lessthan20") {
          return age < 20;
        } else if (data.radioAgeValue === "lessthan25") {
          return age < 25;
        } else if (data.radioAgeValue === "lessthan30") {
          return age < 30;
        } else if (data.radioAgeValue === "greaterthan30") {
          return age > 30;
        }
      });
    } else {
      agesorted = namesorted;
    }
    if (data.radioGenderValue !== "All") {
      gendersorted = agesorted.filter((item) => {
        if (data.radioGenderValue === "Male") {
          return item.gender === "Male";
        } else if (data.radioGenderValue === "Female") {
          return item.gender === "Female";
        } else if (data.radioGenderValue === "Other") {
          return item.gender === "Other";
        }
      });
    } else {
      gendersorted = agesorted;
    }
    if (data.radioFollowerValue !== "All") {
      followersorted = gendersorted.filter((item) => {
        if (data.radioFollowerValue === "greaterthan1M") {
          return item.instagram.followers > 1000000;
        } else if (data.radioFollowerValue === "greaterthan100K") {
          return item.instagram.followers > 100000;
        } else if (data.radioFollowerValue === "greaterthan20K") {
          return item.instagram.followers > 20000;
        } else if (data.radioFollowerValue === "greaterthan1000") {
          return item.instagram.followers > 1000;
        } else if (data.radioFollowerValue === "lessthan1000") {
          return item.instagram.followers <= 1000;
        }
      });
    } else {
      followersorted = gendersorted;
    }
    let selectedCategory = [];
    let mySetCategory = new Set();
    data.radioInfluencerValue
      .filter((item) => item.status === true)
      .map((categ) => selectedCategory.push(categ.label));
    if (selectedCategory[0] !== "All") {
      followersorted.map((element) => {
        element.category.filter((nesele) => {
          if (Object.values(nesele).some((r) => selectedCategory.includes(r))) {
            mySetCategory.add(element);
          }
        });
      });
      categorysorted = Array.from(mySetCategory);
    } else {
      categorysorted = followersorted;
    }

    let selectedCity = [];
    let mySetCity = new Set();
    data.radioCityValue
      .filter((item) => item.status === true)
      .map((categ) => selectedCity.push(categ.value));
    if (selectedCity[0] !== "All") {
      categorysorted.map((element) => {
        if (Object.values(element).some((r) => selectedCity.includes(r))) {
          mySetCity.add(element);
        }
      });
      citysorted = Array.from(mySetCity);
    } else {
      citysorted = categorysorted;
    }
    console.log("citysorted length", citysorted.length);
    res.status(200).json({ data: citysorted, message: "Filtered Influencer" });
  } catch (error) {
    res.status(500).json({ message: error });
  }
});

// 6. Campaign filter
app.post("/api/campaign/filter", async (req, res) => {
  try {
    let data = req.body;

    const snapshot = await Firebase.Campaign.get();
    let list = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    let namesorted;

    let categorysorted;
    let citysorted;
    let specialValuesorted;
    let brandcategorysorted;
    console.log("list length", list.length);
    if (data.inputValue.toLowerCase() === "allcampaigndata") {
      namesorted = list;
    } else if (data.inputValue !== "") {
      namesorted = list.filter((item) => {
        if (
          item.name
            .toLowerCase()
            .indexOf(data.inputValue.toString().toLowerCase()) !== -1
        ) {
          return item;
        }
      });
    } else {
      namesorted = list;
    }

    let selectedCategory = [];
    let mySetCategory = new Set();
    data.radioInfluencerValue
      .filter((item) => item.status === true)
      .map((categ) => selectedCategory.push(categ.label));
    if (selectedCategory[0] !== "All") {
      namesorted.map((element) => {
        element.category.filter((nesele) => {
          if (Object.values(nesele).some((r) => selectedCategory.includes(r))) {
            mySetCategory.add(element);
          }
        });
      });
      categorysorted = Array.from(mySetCategory);
    } else {
      categorysorted = namesorted;
    }
    let selectedCity = [];
    let mySetCity = new Set();
    data.radioCityValue
      .filter((item) => item.status === true)
      .map((categ) => selectedCity.push(categ.value));
    if (selectedCity[0] !== "All") {
      categorysorted.map((element) => {
        if (Object.values(element).some((r) => selectedCity.includes(r))) {
          mySetCity.add(element);
        }
      });
      citysorted = Array.from(mySetCity);
    } else {
      citysorted = categorysorted;
    }
    console.log("citysorted length", citysorted.length);
    if (data.radioSpecialValue !== "All") {
      specialValuesorted = citysorted.filter((item) => {
        if (data.radioSpecialValue === "Pinksky Privilege") {
          return item.viewerDetails.pinkskyPrivilege === true;
        } else if (data.radioSpecialValue === "Paid Privilege") {
          return item.viewerDetails.paidPrivilege === true;
        }
      });
    } else {
      specialValuesorted = citysorted;
    }

    let brandselectedCategory = [];
    let myBrandSetCategory = new Set();
    data.radioBrandValue
      .filter((item) => item.status === true)
      .map((categ) => brandselectedCategory.push(categ.label));

    if (brandselectedCategory[0] !== "All") {
      specialValuesorted.map((element) => {
        if (brandselectedCategory.includes(element.brandcategory)) {
          myBrandSetCategory.add(element);
        }
      });
      brandcategorysorted = Array.from(myBrandSetCategory);
    } else {
      brandcategorysorted = specialValuesorted;
    }
    console.log("brandcategorysorted length", brandcategorysorted.length);
    res.status(200).json({
      data: brandcategorysorted.sort((a, b) => b.createdDate - a.createdDate),
      message: "Filtered Campaign",
    });
  } catch (error) {
    res.status(500).json({ message: error });
  }
});

// REGISTER SECTION
// 1. Influencer registeration
app.post("/api/influencer/create", async (req, res) => {
  let userResponse = undefined;

  let influencerData = req.body;
  try {
    let isProfileCompletedQuery = req.query.isProfileCompleted;
    console.log("influencerData", req.body);

    const createUser = {
      email: influencerData.email,
      password: influencerData.password,
      name:
        isProfileCompletedQuery +
        "_Influencer_" +
        influencerData.name.replace(" ", "") +
        "_" +
        influencerData.surname.replace(" ", ""),
    };
    console.log("createUser", createUser);

    //login here
    if (createUser.email != undefined && createUser.password != undefined) {
      if (influencerData.isNonInfluencer.uuid.toString().length > 2) {
        let getUserByUuid = await Firebase.admin
          .auth()
          .getUser(influencerData.isNonInfluencer.uuid.toString());

        await Firebase.admin.auth().updateUser(getUserByUuid?.uid, {
          password: createUser.password,
          emailVerified: false,
          disabled: false,
          displayName: createUser.name,
        });

        userResponse = {
          email: influencerData.email,
          uid: getUserByUuid?.uid,
        };
        console.log("def", userResponse);
      } else {
        console.log("abc");
        userResponse = await Firebase.admin.auth().createUser({
          email: createUser.email,
          password: createUser.password,
          emailVerified: false,
          disabled: false,
          displayName: createUser.name,
        });
      }

      console.log("userResponse email");
      if (userResponse.email !== undefined && userResponse.uid !== undefined) {
        let influencerSchema = null;
        const options = {
          method: "GET",
          url: process.env.RAPID_USERINFO_URL + influencerData.instagramurl,
          headers: {
            "X-RapidAPI-Key": process.env.RapidAPIKey,
            "X-RapidAPI-Host": process.env.RapidAPIHost,
          },
        };

        //Here -- axios
        let instagramPostDetails = [];
        let onGoingStatus = 200;
        // let breakMovement = true;
        await axios
          .request(options)
          .then(function (response) {
            if (response.data.data.is_private === false) {
              let sum = 0;
              let count = 0;

              response.data.data.edge_owner_to_timeline_media.edges.map(
                (item) => {
                  // console.log(item);
                  sum =
                    sum +
                    item.node.edge_media_to_comment.count +
                    item.node.edge_liked_by.count;
                  if (count <= 4) {
                    console.log("item.node.shortcode", item.node.shortcode);
                    let itemData = {
                      id: item.node.id,
                      shortcode: item.node.shortcode,
                      display_url: item.node.display_url,
                      caption:
                        item.node.edge_media_to_caption.edges[0].node.text,
                      edge_media_to_comment:
                        item.node.edge_media_to_comment.count,
                      edge_liked_by: item.node.edge_liked_by.count,
                    };

                    instagramPostDetails.push(itemData);
                  }
                  count++;
                }
              );

              let engagementRate =
                sum / response.data.data.edge_followed_by.count;
              // * 1000;

              console.log(
                "engagementRate",
                engagementRate.toString().replace(".", "")
              );
              influencerSchema = {
                ...influencerData,
                instagram: {
                  engagementRate:
                    engagementRate.toString().replace(".", "").substring(0, 1) +
                    "." +
                    engagementRate.toString().replace(".", "").substring(1, 3),
                  id: response.data.data.id,
                  is_business_account: response.data.data.is_business_account,
                  external_url: response.data.data.external_url,
                  followers: response.data.data.edge_followed_by.count,
                  edge_follow: response.data.data.edge_follow.count,
                  is_private: response.data.data.is_private,
                  is_verified: response.data.data.is_verified,
                },
              };
              onGoingStatus = 200;
            } else {
              onGoingStatus = 401;
            }
          })
          .catch(function (error) {
            throw error;
          });

        if (onGoingStatus === 401) {
          const err = new TypeError(
            "Please Register With Public Instagram Account"
          );
          throw err;
        } else {
          let interval = 9000;
          let lengthOfArray = instagramPostDetails.length - 1;
          let influencerArr = [];
          console.log("lengthOfArray", lengthOfArray);
          instagramPostDetails.forEach((file, index) => {
            setTimeout(() => {
              console.log("hi people", interval * index);

              const d = new Date();
              let month = d.getMonth() + 1;
              let date = d.getDate();
              let year = d.getFullYear();
              let time = d.getTime();
              const fileName =
                index +
                "_" +
                createUser.name +
                "_" +
                month +
                "_" +
                date +
                "_" +
                year +
                "_" +
                time +
                ".jpeg";
                let filePath = path.join(__dirname, "/images", fileName);
                //let filePath = "./images/" + fileName;
              const options = {
                url: file.display_url,
                method: "GET",
              };
              console.log("fileName", fileName);
              let getDownloadURL = "";
              request(options, async (err, resp, body) => {
                if (resp.statusCode === 200) {
                  console.log("res.statusCode", resp.statusCode);
                  var bucket = Firebase.admin.storage().bucket();

                  await bucket.upload(filePath);
                  let fileFirebaseURL = process.env.FIRESTORE_URL + fileName;
                  console.log("------Here------");
                  console.log(fileFirebaseURL);
                  axios
                    .get(fileFirebaseURL)
                    .then(async (response) => {
                      getDownloadURL =
                        process.env.FIRESTORE_URL +
                        `${fileName}?alt=media&token=${response.data.downloadTokens}`;
                      instagramPostDetails[index].new_url = getDownloadURL;
                      console.log("index", index);
                      fs.unlinkSync(filePath);
                      if (index === lengthOfArray) {
                        console.log("inside");
                        if (
                          influencerData.isNonInfluencer.uuid.toString()
                            .length > 2
                        ) {
                          const snapshotNonInfluencer =
                            await Firebase.NonInfluencer.doc(
                              influencerData.isNonInfluencer.id.toString()
                            ).get();
                          influencerSchema = {
                            ...influencerSchema,
                            pinkskymember:
                              snapshotNonInfluencer.data().pinkskymember,
                            isProfileCompleted: isProfileCompletedQuery,
                            imgURL1: instagramPostDetails[0].new_url,
                            imgURL2: instagramPostDetails[1].new_url,
                            imgURL3: instagramPostDetails[2].new_url,
                            imgURL4: instagramPostDetails[3].new_url,
                            imgURL5: instagramPostDetails[4].new_url,
                            message: [
                              {
                                statusID: "100",
                                campaignID: "",
                                campaignName: "",
                              },
                            ],
                            createdDate: new Date(),
                            updatedDate: new Date(),
                          };
                        } else {
                          influencerSchema = {
                            ...influencerSchema,
                            isProfileCompleted: isProfileCompletedQuery,
                            imgURL1: instagramPostDetails[0].new_url,
                            imgURL2: instagramPostDetails[1].new_url,
                            imgURL3: instagramPostDetails[2].new_url,
                            imgURL4: instagramPostDetails[3].new_url,
                            imgURL5: instagramPostDetails[4].new_url,
                            message: [
                              {
                                statusID: "100",
                                campaignID: "",
                                campaignName: "",
                              },
                            ],
                            createdDate: new Date(),
                            updatedDate: new Date(),
                          };
                        }

                        console.log("influencerSchema", influencerSchema);
                        Firebase.Influencer.add(influencerSchema);
                        setTimeout(async () => {
                          console.log("inside2");

                          const snapshot = await Firebase.Influencer.get();
                          snapshot.docs.map((doc) => {
                            if (doc.data().email === createUser.email) {
                              influencerArr.push({ id: doc.id, ...doc.data() });
                            }
                          });
                          //setting up coupon from noninfluencer
                          if (
                            influencerData.isNonInfluencer.uuid.toString()
                              .length > 2 &&
                            influencerSchema.pinkskymember.isMember === true
                          ) {
                            const snapshotCoupon = await Firebase.Coupons.get();
                            snapshotCoupon.docs.map(async (doc) => {
                              if (
                                doc
                                  .data()
                                  .userCouponMapping.includes(
                                    influencerData.isNonInfluencer.id.toString()
                                  )
                              ) {
                                await Firebase.Coupons.doc(doc.id).update({
                                  userCouponMapping: [
                                    ...doc.data().userCouponMapping,
                                    influencerArr[0].id,
                                  ],
                                });
                              }
                            });
                          }
                          res.status(200).json({
                            message: {
                              displayName: createUser.name,
                              id: influencerArr[0].id,
                              // email: createUser.email,
                              email: influencerArr[0].email,
                              type: "Posted Influencer",
                              uuid: userResponse?.uid,
                              member: false,
                              status: "new",
                            },
                          });
                        }, 3000);
                      }
                    })
                    .catch((error) => {
                      throw error;
                    });
                }
              }).pipe(fs.createWriteStream(filePath));
            }, index * interval);
          });
        }
      } else {
        res.status(500).json({
          message:
            "Something Went wrong. User response is not defined. Please try again.",
        });
      }
    }
  } catch (error) {
    if (userResponse?.uid == undefined || userResponse?.uid == "") {
      res.status(500).json({
        message:
          createUser.email +
          " is already an pinksky user. Try sigging up with another id.",
      });
    } else {
      console.log(userResponse?.uid);
      if (influencerData.isNonInfluencer.uuid.length > 2) {
        //non influencer is safe
      } else {
        await Firebase.admin.auth().deleteUser(userResponse?.uid);
      }
      console.log("error", error.message);
      res.status(500).json({ message: error.message });
    }
  }
});

// 2. Brand registeration
app.post("/api/brand/create", async (req, res) => {
  try {
    let brandData = req.body;
    console.log("brandData", req.body);
    const createUser = {
      email: brandData.email,
      password: brandData.password,
      name: "Brand_" + brandData.companyname.replace(" ", ""),
    };
    console.log("createUser", createUser);

    if (createUser.email != undefined && createUser.password != undefined) {
      const userResponse = await Firebase.admin.auth().createUser({
        email: createUser.email,
        password: createUser.password,
        emailVerified: false,
        disabled: false,
        displayName: createUser.name,
      });

      console.log("userResponse email", userResponse.email);
      if (userResponse.email != undefined && userResponse.uid != undefined) {
        let brandSchema = null;
        const options = {
          method: "GET",
          url: process.env.RAPID_USERINFO_URL + brandData.instagramurl,
          headers: {
            "X-RapidAPI-Key": process.env.RapidAPIKey,
            "X-RapidAPI-Host": process.env.RapidAPIHost,
          },
        };
        let instagramPostDetails = [];
        let onGoingStatus = 200;
        await axios
          .request(options)
          .then(function (response) {
            if (response.data.data.is_private === false) {
              let profileItemData = {
                id: "1",
                display_url: response.data.data.profile_pic_url_hd,
              };

              instagramPostDetails.push(profileItemData);

              brandSchema = {
                ...brandData,
                instagram: {
                  id: response.data.data.id,
                  is_business_account: response.data.data.is_business_account,
                  external_url: response.data.data.external_url,
                  followers: response.data.data.edge_followed_by.count,
                  edge_follow: response.data.data.edge_follow.count,
                  is_private: response.data.data.is_private,
                  is_verified: response.data.data.is_verified,
                },
              };
              onGoingStatus = 200;
            } else {
              onGoingStatus = 401;
            }
          })
          .catch(function (error) {
            throw error;
          });
        if (onGoingStatus === 401) {
          const err = new TypeError(
            "Please Register With Public Instagram Account"
          );
          throw err;
        } else {
          let interval = 9000;
          let lengthOfArray = instagramPostDetails.length - 1;
          let brandArr = [];

          console.log("lengthOfArray", lengthOfArray);
          instagramPostDetails.forEach((file, index) => {
            setTimeout(() => {
              console.log("hi people", interval * index);

              const d = new Date();
              let month = d.getMonth() + 1;
              let date = d.getDate();
              let year = d.getFullYear();
              let time = d.getTime();
              const fileName =
                index +
                "_" +
                createUser.name +
                "_" +
                month +
                "_" +
                date +
                "_" +
                year +
                "_" +
                time +
                ".jpeg";
              let filePath = path.join(__dirname, "/images", fileName);
              //let filePath = "./images/" + fileName;
              const options = {
                url: file.display_url,
                method: "GET",
              };
              console.log("fileName", fileName);
              let getDownloadURL = "";
              request(options, async (err, resp, body) => {
                if (resp.statusCode === 200) {
                  console.log("res.statusCode", resp.statusCode);
                  var bucket = Firebase.admin.storage().bucket();

                  await bucket.upload(filePath);
                  let fileFirebaseURL = process.env.FIRESTORE_URL + fileName;
                  console.log("------Here------");
                  console.log(fileFirebaseURL);

                  axios
                    .get(fileFirebaseURL)
                    .then((response) => {
                      getDownloadURL =
                        process.env.FIRESTORE_URL +
                        `${fileName}?alt=media&token=${response.data.downloadTokens}`;
                      instagramPostDetails[index].new_url = getDownloadURL;
                      console.log("index", index);
                      fs.unlinkSync(filePath);
                      if (index === lengthOfArray) {
                        console.log("inside");

                        brandSchema = {
                          ...brandSchema,

                          imgURL: instagramPostDetails[0].new_url,
                          message: [
                            {
                              statusID: "100",
                              influencerID: "",
                              influencerName: "",
                            },
                          ],

                          createdDate: new Date(),
                          updatedDate: new Date(),
                        };
                      }

                      Firebase.Brand.add(brandSchema);
                      setTimeout(async () => {
                        console.log("inside2");

                        const snapshot = await Firebase.Brand.get();

                        snapshot.docs.map((doc) => {
                          if (doc.data().email === createUser.email) {
                            brandArr.push({ id: doc.id, ...doc.data() });
                          }
                        });

                        res.status(200).json({
                          message: {
                            displayName: createUser.name,
                            id: brandArr[0].id,
                            // email: createUser.email,
                            email: brandArr[0].email,
                            type: "Posted Brand",
                            uuid: userResponse?.uid,
                            member: false,
                            status: "new",
                          },
                        });
                      }, 4000);
                    })
                    .catch((error) => {
                      throw error;
                    });
                }
              }).pipe(fs.createWriteStream(filePath));
            }, index * interval);
          });
        }
      }
    }
  } catch (error) {
    console.log("error", error);
    res.status(500).json({ message: error.message });
  }
});

// 3. Non-influencer registeration
app.post("/api/noninfluencer/create", async (req, res) => {
  try {
    let data = req.body;

    const createUser = {
      email: data.email,
      password: data.password,
      name: "Non_Influencer_" + data.name.replace(" ", ""),
    };

    const userResponse = await Firebase.admin.auth().createUser({
      email: createUser.email,
      password: createUser.password,
      emailVerified: false,
      disabled: false,
      displayName: createUser.name,
    });
    if (userResponse.email != undefined && userResponse.uid != undefined) {
      let noninfluencerData = {
        ...data,
        createdDate: new Date(),
        updatedDate: new Date(),
      };
      const response = await Firebase.NonInfluencer.add(noninfluencerData);

      setTimeout(async () => {
        let noninfluencerArr = [];
        const snapshot = await Firebase.NonInfluencer.get();
        snapshot.docs.map((doc) => {
          if (doc.data().email === createUser.email) {
            noninfluencerArr.push({ id: doc.id, ...doc.data() });
          }
        });

        res.status(200).json({
          message: {
            displayName: createUser.name,
            id: noninfluencerArr[0].id,
            email: noninfluencerArr[0].email,
            type: "Posted Non Influencer",
            uuid: userResponse?.uid,
            member: false,
            status: "",
          },
        });
      }, 2000);
    }
  } catch (error) {
    console.log("error", error);
    res.status(500).json({ message: error });
  }
});

// ADMIN SECTION
// 1. Campaign create
app.post(
  "/api/campaign/create",
  Firebase.multer.single("file"),
  async (req, res) => {
    try {
      let { file, body } = req;
      let campaignFile = file;
      let campaignFileSplit = campaignFile.fileRef.metadata.id.split("/");
      let campaignFileFirebaseURL = `https://firebasestorage.googleapis.com/v0/b/${campaignFileSplit[0]}/o/${campaignFileSplit[1]}`;
      console.log("campaignFileSplit", campaignFileSplit);
      console.log("campaignFileFirebaseURL", campaignFileFirebaseURL);
      let getDownloadURL = "";
      await axios
        .get(campaignFileFirebaseURL)
        .then((response) => {
          getDownloadURL = `https://firebasestorage.googleapis.com/v0/b/${campaignFileSplit[0]}/o/${campaignFileSplit[1]}?alt=media&token=${response.data.downloadTokens}`;
        })
        .catch((error) => {
          res.status(500).json({ message: error });
        });
      var object = JSON.parse(body.data);
      let campaignData = {
        ...object,
        getDownloadURL: getDownloadURL,
        createdDate: new Date(),
        updatedDate: new Date(),
      };

      setTimeout(async () => {
        const response = await Firebase.Campaign.add(campaignData);
        console.log("response", response.data);
        res.status(200).json({ message: "Posted Campaign" });
      }, 2000);
    } catch (error) {
      console.log("error", error);
      res.status(500).json({ message: error });
    }
  }
);

// 2. Event create
app.post(
  "/api/event/create",
  Firebase.multer.single("file"),
  async (req, res) => {
    try {
      let { file, body } = req;
      let couponFile = file;
      let couponFileSplit = couponFile.fileRef.metadata.id.split("/");
      let couponFileFirebaseURL = `https://firebasestorage.googleapis.com/v0/b/${couponFileSplit[0]}/o/${couponFileSplit[1]}`;
      console.log("couponFileSplit", couponFileSplit);
      console.log("couponFileFirebaseURL", couponFileFirebaseURL);
      let getDownloadURL = "";
      await axios
        .get(couponFileFirebaseURL)
        .then((response) => {
          getDownloadURL = `https://firebasestorage.googleapis.com/v0/b/${couponFileSplit[0]}/o/${couponFileSplit[1]}?alt=media&token=${response.data.downloadTokens}`;
        })
        .catch((error) => {
          res.status(500).json({ message: error });
        });
      var object = JSON.parse(body.data);
      let eventData = {
        ...object,
        getDownloadURL: getDownloadURL,
        createdDate: new Date(),
        updatedDate: new Date(),
      };

      setTimeout(async () => {
        const response = await Firebase.Event.add(eventData);

        res.status(200).json({ message: "Posted Event" });
      }, 2000);
    } catch (error) {
      console.log("error");
      res.status(500).json({ message: error });
    }
  }
);

// 3. Coupon create
app.post(
  "/api/coupon/create",
  Firebase.multer.single("file"),
  async (req, res) => {
    try {
      let { file, body } = req;
      let couponFile = file;
      let couponFileSplit = couponFile.fileRef.metadata.id.split("/");
      let couponFileFirebaseURL = `https://firebasestorage.googleapis.com/v0/b/${couponFileSplit[0]}/o/${couponFileSplit[1]}`;
      console.log("couponFileSplit", couponFileSplit);
      console.log("couponFileFirebaseURL", couponFileFirebaseURL);
      let getDownloadURL = "";
      await axios
        .get(couponFileFirebaseURL)
        .then((response) => {
          getDownloadURL = `https://firebasestorage.googleapis.com/v0/b/${couponFileSplit[0]}/o/${couponFileSplit[1]}?alt=media&token=${response.data.downloadTokens}`;
        })
        .catch((error) => {
          res.status(500).json({ message: error });
        });
      var object = JSON.parse(body.data);
      let couponData = {
        ...object,
        url: getDownloadURL,
        createdDate: new Date(),
        updatedDate: new Date(),
      };

      setTimeout(async () => {
        const response = await Firebase.Coupons.add(couponData);
        console.log("response", response.data);
        res.status(200).json({ message: "Posted coupon" });
      }, 2000);
    } catch (error) {
      console.log("error", error);
      res.status(500).json({ message: error });
    }
  }
);

// 4. Gallery create
app.post(
  "/api/gallery/create",
  Firebase.multer.single("file"),
  async (req, res) => {
    try {
      let { file, body } = req;
      let couponFile = file;
      let couponFileSplit = couponFile.fileRef.metadata.id.split("/");
      let couponFileFirebaseURL = `https://firebasestorage.googleapis.com/v0/b/${couponFileSplit[0]}/o/${couponFileSplit[1]}`;
      console.log("couponFileSplit", couponFileSplit);
      console.log("couponFileFirebaseURL", couponFileFirebaseURL);
      let getDownloadURL = "";
      await axios
        .get(couponFileFirebaseURL)
        .then((response) => {
          getDownloadURL = `https://firebasestorage.googleapis.com/v0/b/${couponFileSplit[0]}/o/${couponFileSplit[1]}?alt=media&token=${response.data.downloadTokens}`;
        })
        .catch((error) => {
          res.status(500).json({ message: error });
        });
      var object = JSON.parse(body.data);

      let couponData = {
        ...object,

        url: getDownloadURL,
        createdDate: new Date(),
        updatedDate: new Date(),
      };

      setTimeout(async () => {
        const response = await Firebase.Gallery.add(couponData);
        console.log("response", response.data);
        res.status(200).json({ message: "Posted Gallery" });
      }, 2000);
    } catch (error) {
      console.log("error", error);
      res.status(500).json({ message: error });
    }
  }
);

// 5. Get gallery links
app.post(
  "/api/firestorelink/create",
  Firebase.multer.single("file"),
  async (req, res) => {
    try {
      let { file } = req;
      let newFile = file;
      let newFileSplit = newFile.fileRef.metadata.id.split("/");
      let newFileFirebaseURL = `https://firebasestorage.googleapis.com/v0/b/${newFileSplit[0]}/o/${newFileSplit[1]}`;
      console.log("newFileSplit", newFileSplit);
      console.log("newFileFirebaseURL", newFileFirebaseURL);
      let getDownloadURL = "";
      await axios
        .get(newFileFirebaseURL)
        .then((response) => {
          getDownloadURL = `https://firebasestorage.googleapis.com/v0/b/${newFileSplit[0]}/o/${newFileSplit[1]}?alt=media&token=${response.data.downloadTokens}`;
          console.log("getDownloadURL", getDownloadURL);
        })
        .catch((error) => {
          res.status(500).json({ message: error });
        });

      setTimeout(() => {
        console.log("up");
        res
          .status(200)
          .json({ data: getDownloadURL, message: "Posted coupon" });
      }, 1500);
    } catch (error) {
      console.log("down");
      console.log("error", error);
      res.status(500).json({ message: error });
    }
  }
);

// 6. Accept Handle
app.put("/api/acceptstatus/update", async (req, res) => {
  try {
    console.log("hello");
    const data = req.body;
    console.log("Here");

    //checked
    if (data.type === "influencerNewRequest") {
      const id = data.id;
      console.log(id);
      const snapshot = await Firebase.Influencer.doc(id).get();
      let influencerData = [
        ...snapshot.data().message,
        {
          statusID: "101",
          campaignID: "",
          campaignName: "",
        },
      ];

      await Firebase.Influencer.doc(id).update({
        status: "accepted",
        message: influencerData,
      });
      res.status(200).json({ message: "Accepted Influencer" });
    }
    //checked
    else if (data.type === "influencerCampaignRequest") {
      const data = req.body;

      const snapshot = await Firebase.Influencer.get();

      let influencerData = [];
      let influencerDataMessage = [];

      snapshot.docs.map((doc) => {
        if (doc.id === data.influencerid) {
          influencerData.push(...doc.data().campaignmapping);
          influencerDataMessage.push(...doc.data().message);
        }
      });

      let objIndex = influencerData.findIndex(
        (obj) => obj.campaignId == data.campaignid
      );

      influencerData[objIndex].status = "accepted";
      influencerData[objIndex].closingPrice = data.closingPrice;
      console.log("influencerData ", influencerData);
      const campaignsnapshot = await Firebase.Campaign.doc(
        data.campaignid
      ).get();

      influencerDataMessage.push({
        statusID: "201",
        campaignID: data.campaignid,
        campaignName: campaignsnapshot.data().name,
        closingPrice: data.closingPrice,
      });

      await Firebase.Influencer.doc(data.influencerid).update({
        campaignmapping: influencerData,
        message: influencerDataMessage,
      });
      res.status(200).json({ message: "Mapped Campaign with Influencer" });
    } else if (data.type === "influencerCampaignPaymentRequest") {
      console.log("inside influencerCampaignPaymentRequest");
      const data = req.body;

      const snapshot = await Firebase.Influencer.doc(data.influencerid).get();

      let influencerData = [...snapshot.data().campaignmapping];
      let influencerDataMessage = [...snapshot.data().message];

      console.log("inside influencerCampaignPaymentRequest 2");
      let objIndex = snapshot
        .data()
        .campaignmapping.findIndex((obj) => obj.campaignId == data.campaignid);

      influencerData[objIndex].paymentStatus = "accepted";

      console.log("inside influencerCampaignPaymentRequest 3");
      const campaignsnapshot = await Firebase.Campaign.doc(
        data.campaignid
      ).get();
      console.log("inside influencerCampaignPaymentRequest 4");
      var dateObj = new Date();
      var month = dateObj.getUTCMonth() + 1; //months from 1-12
      var year = dateObj.getUTCFullYear();

      influencerDataMessage.push({
        statusID: "401",
        campaignID: data.campaignid,
        campaignName: campaignsnapshot.data().name,
        closingPrice: influencerData[objIndex].closingPrice,
        settlementMonth: year + "/" + month,
        viewerDetails: campaignsnapshot.data().viewerDetails,
      });
      console.log("inside influencerCampaignPaymentRequest 5", influencerData);
      await Firebase.Influencer.doc(data.influencerid).update({
        campaignmapping: influencerData,
        message: influencerDataMessage,
      });
      res
        .status(200)
        .json({ message: "Mapped Payment Campaign with Influencer" });
    } else if (data.type === "brandNewRequest") {
      const id = req.body.id;
      const snapshot = await Firebase.Brand.get();
      let brandData = [];
      snapshot.docs.map((doc) => {
        if (doc.id === id) {
          brandData.push(...doc.data().message);
        }
      });
      brandData.push({
        statusID: "101",
        influencerID: "",
        influencerName: "",
      });

      await Firebase.Brand.doc(id).update({
        status: "accepted",
        message: brandData,
      });
      res.status(200).json({ message: "Accepted Brand" });
    } else if (data.type === "influencerHireRequest") {
      const data = req.body;
      console.log(data);
      const snapshot = await Firebase.Brand.doc(data.brandid).get();
      let brandData = [...snapshot.data().influencermapping];
      let brandDataMessage = [...snapshot.data().message];
      console.log("step1");
      let objIndex = brandData.findIndex(
        (obj) => obj.influencerId == data.influencerid
      );
      brandData[objIndex].status = "accepted";
      const influencersnapshot = await Firebase.Influencer.doc(
        data.influencerid
      ).get();
      console.log("step2", influencersnapshot.data().name);
      brandDataMessage.push({
        statusID: "201",
        influencerID: data.influencerid,
        influencerName: influencersnapshot.data().name,
      });
      console.log("step3");
      await Firebase.Brand.doc(data.brandid).update({
        influencermapping: brandData,
        message: brandDataMessage,
      });
      res.status(200).json({ message: "Mapped Influencer with Brand" });
    }

    //working
    else if (data.type === "influencerEventRequest") {
      const data = req.body;
      const snapshot = await Firebase.Influencer.doc(data.influencerid).get();
      let influencerData = [];
      let influencerDataMessage = [];
      influencerData.push(...snapshot.data().eventmapping);
      influencerDataMessage.push(...snapshot.data().message);

      console.log("influencerData before", influencerData);
      let objIndex = influencerData.findIndex(
        (obj) => obj.eventId == data.eventid
      );
      influencerData[objIndex].status = "accepted";
      const eventsnapshot = await Firebase.Event.doc(data.eventid).get();

      influencerDataMessage.push({
        statusID: "301",
        eventId: data.eventid,
        eventName: eventsnapshot.data().name,
      });
      console.log("data", {
        eventmapping: influencerData,
        message: influencerDataMessage,
      });
      await Firebase.Influencer.doc(data.influencerid).update({
        eventmapping: influencerData,
        message: influencerDataMessage,
      });
      res.status(200).json({ message: "Accept Event with Influencer" });
    } else if (data.type === "influencerPinkskyTeamNewRequest") {
      let snapshot = await Firebase.Influencer.doc(data.influencerid).get();

      let influencerDataMessage = [
        ...snapshot.data().message,
        {
          statusID: "104",
          influencerId: data.influencerid,
          influencerName: snapshot.data().name,
        },
      ];
      await Firebase.Influencer.doc(data.influencerid).update({
        isTeam: "accepted",
        message: influencerDataMessage,
      });
      res.status(200).json({ message: "Updated Influencer Hiring" });
    } else if (data.type === "launchAcceptReject") {
      let snapshot = await Firebase.Brand.doc(data.details.brandid).get();

      let brandDataMessage = [...snapshot.data().message];

      let objIndex = brandDataMessage.findIndex(
        (obj) => obj.launchName == data.details.launchName
      );

      brandDataMessage[objIndex].isShowAdmin = false;
      console.log(brandDataMessage);
      await Firebase.Brand.doc(data.details.brandid).update({
        message: brandDataMessage,
      });
      res.status(200).json({ message: "Updated Message in Launch" });
    }
  } catch (error) {
    res.status(500).json({ message: error });
  }
});

// 7. Accept Handle Form Data
app.put(
  "/api/acceptstatus/update/formdata",
  Firebase.multer.single("file"),
  async (req, res) => {
    try {
      console.log("hello");
      const data = req.body;
      var object = JSON.parse(data.data);
      console.log("Here");

      //checked
      if (object.type === "influencerCampaignPaymentRequest") {
        let campaignFile = req.file;
        let campaignFileSplit = campaignFile.fileRef.metadata.id.split("/");
        let campaignFileFirebaseURL = `https://firebasestorage.googleapis.com/v0/b/${campaignFileSplit[0]}/o/${campaignFileSplit[1]}`;

        let getDownloadURL = "";
        await axios
          .get(campaignFileFirebaseURL)
          .then((response) => {
            getDownloadURL = `https://firebasestorage.googleapis.com/v0/b/${campaignFileSplit[0]}/o/${campaignFileSplit[1]}?alt=media&token=${response.data.downloadTokens}`;
          })
          .catch((error) => {
            res.status(500).json({ message: error });
          });

        console.log("1");
        let snapshot = await Firebase.Influencer.doc(object.influencerid).get();

        let campaignmapping = [];

        // await snapshot.data().campaignmapping.map((camp) => {
        //   if (camp.paymentStatus === "initiated") {
        //     campaignmapping.push({
        //       ...camp,
        //       paymentURL: getDownloadURL,
        //       paymentStatus: "completed",
        //     });
        //   } else {
        //     campaignmapping.push(...camp);
        //   }
        // });
        await snapshot.data().campaignmapping.map((camp) => {
          if (camp.paymentStatus === "new") {
            campaignmapping.push({
              ...camp,
              paymentURL: getDownloadURL,
              paymentStatus: "accepted",
            });
          } else {
            campaignmapping.push(...camp);
          }
        });
        console.log("3");
        let influencerDataMessage = [];

        snapshot.data().message.map((item) => {
          if (item.statusID === "401") {
            influencerDataMessage.push({ ...item, paymentURL: getDownloadURL });
          } else {
            influencerDataMessage.push({ ...item });
          }
        }),
          await Firebase.Influencer.doc(object.influencerid).update({
            campaignmapping: campaignmapping,
            message: influencerDataMessage,
          });
        res.status(200).json({ message: "Updated Influencer with payment" });
      }
    } catch (error) {
      res.status(500).json({ message: error });
    }
  }
);

// 8. Reject Handle
app.put("/api/rejectstatus/update", async (req, res) => {
  try {
    let data = req.body;
    console.log(req.body);

    if (data.type === "influencerNewRequest") {
      const id = req.body.id;
      const snapshot = await Firebase.Influencer.get();
      let influencerData = [];
      snapshot.docs.map((doc) => {
        if (doc.id === id) {
          influencerData.push(...doc.data().message);
        }
      });
      influencerData.push({
        statusID: "102",
        campaignID: "",
        campaignName: "",
      });
      await Firebase.Influencer.doc(id).update({
        status: "rejected",
        message: influencerData,
      });
      res.status(200).json({ message: "Rejected Influencer" });
    } else if (data.type === "influencerCampaignRequest") {
      const data = req.body;

      const snapshot = await Firebase.Influencer.get();
      let influencerData = [];
      let influencerDataMessage = [];
      snapshot.docs.map((doc) => {
        if (doc.id === data.influencerid) {
          influencerData.push(...doc.data().campaignmapping);
          influencerDataMessage.push(...doc.data().message);
        }
      });
      console.log("influencerData before", influencerData);
      let objIndex = influencerData.findIndex(
        (obj) => obj.campaignId == data.campaignid
      );
      influencerData[objIndex].status = "rejected";
      const campaignsnapshot = await Firebase.Campaign.doc(
        data.campaignid
      ).get();

      influencerDataMessage.push({
        statusID: "202",
        campaignID: data.campaignid,
        campaignName: campaignsnapshot.data().name,
      });

      await Firebase.Influencer.doc(data.influencerid).update({
        campaignmapping: influencerData,
        message: influencerDataMessage,
      });
      res.status(200).json({ message: "UnMapped Campaign with Influencer" });
    }
    //working
    else if (data.type === "influencerCampaignPaymentRequest") {
      let snapshot = await Firebase.Influencer.doc(data.influencerid).get();

      const campaignsnapshot = await Firebase.Campaign.doc(
        data.campaignid
      ).get();

      let campaignmapping = [];

      snapshot.data().campaignmapping.map((camp) => {
        if (camp.campaignId === data.campaignid) {
          campaignmapping.push({
            ...camp,
            paymentStatus: "rejected",
          });
        } else {
          campaignmapping.push(...camp);
        }
      });

      let influencerDataMessage = [
        ...snapshot.data().message,
        {
          statusID: "402",
          campaignID: data.campaignid,
          campaignName: campaignsnapshot.data().name,
          reason: data.reason,
        },
      ];

      await Firebase.Influencer.doc(data.influencerid).update({
        campaignmapping: [...campaignmapping],
        message: influencerDataMessage,
      });
      res
        .status(200)
        .json({ message: "Updated Influencer with payment rejection" });
    } else if (data.type === "brandNewRequest") {
      const id = req.body.id;
      const snapshot = await Firebase.Brand.get();
      let brandData = [];
      snapshot.docs.map((doc) => {
        if (doc.id === id) {
          brandData.push(...doc.data().message);
        }
      });
      brandData.push({ statusID: "102", influencerID: "", influencerName: "" });
      await Firebase.Brand.doc(id).update({
        status: "rejected",
        message: brandData,
      });
      res.status(200).json({ message: "Rejected Brand" });
    } else if (data.type === "influencerHireRequest") {
      const data = req.body;

      const snapshot = await Firebase.Brand.doc(data.brandid).get();
      let brandData = [...snapshot.data().influencermapping];
      let brandDataMessage = [...snapshot.data().message];
      console.log("step1");
      let objIndex = brandData.findIndex(
        (obj) => obj.influencerId == data.influencerid
      );
      brandData[objIndex].status = "rejected";
      const influencersnapshot = await Firebase.Influencer.doc(
        data.influencerid
      ).get();
      console.log("step2", influencersnapshot.data().name);
      brandDataMessage.push({
        statusID: "202",
        influencerID: data.influencerid,
        influencerName: influencersnapshot.data().name,
      });
      console.log("step3");
      await Firebase.Brand.doc(data.brandid).update({
        influencermapping: brandData,
        message: brandDataMessage,
      });
      res.status(200).json({ message: "UnMapped Influencer with Brand" });
    } else if (data.type === "influencerEventRequest") {
      const data = req.body;
      const snapshot = await Firebase.Influencer.doc(data.influencerid).get();
      let influencerData = [];
      let influencerDataMessage = [];
      influencerData.push(...snapshot.data().eventmapping);
      influencerDataMessage.push(...snapshot.data().message);

      console.log("influencerData before", influencerData);
      let objIndex = influencerData.findIndex(
        (obj) => obj.eventId == data.eventid
      );
      influencerData[objIndex].status = "rejected";
      const eventsnapshot = await Firebase.Event.doc(data.eventid).get();

      influencerDataMessage.push({
        statusID: "302",
        eventId: data.eventid,
        eventName: eventsnapshot.data().name,
      });
      console.log("data", {
        eventmapping: influencerData,
        message: influencerDataMessage,
      });
      await Firebase.Influencer.doc(data.influencerid).update({
        eventmapping: influencerData,
        message: influencerDataMessage,
      });
      res.status(200).json({ message: "Rejected Event with Influencer" });
    } else if (data.type === "influencerPinkskyTeamNewRequest") {
      let snapshot = await Firebase.Influencer.doc(data.influencerid).get();

      let influencerDataMessage = [
        ...snapshot.data().message,
        {
          statusID: "105",
          influencerId: data.influencerid,
          influencerName: snapshot.data().name,
        },
      ];
      await Firebase.Influencer.doc(data.influencerid).update({
        isTeam: "rejected",
        message: influencerDataMessage,
      });
      res.status(200).json({ message: "Updated Influencer Not Hiring" });
    }
  } catch (error) {
    res.status(500).json({ message: error });
  }
});

// 9. Remove Campaign - In-active
app.put("/api/removecampaign/update", async (req, res) => {
  try {
    const id = req.body.id;
    delete req.body.id;
    const data = { isActive: 0 };

    await Firebase.Campaign.doc(id).update(data);
    res.status(200).json({ message: "Updated Campaign" });
  } catch (error) {
    res.status(500).json({ message: error });
  }
});

// 10. Remove Event - In-active
app.put("/api/removeevent/update", async (req, res) => {
  try {
    const id = req.body.id;
    delete req.body.id;
    const data = { isActive: 0 };

    await Firebase.Event.doc(id).update(data);
    res.status(200).json({ message: "Updated Event" });
  } catch (error) {
    res.status(500).json({ message: error });
  }
});

// 11. Remove Coupons - In-active
app.put("/api/removecoupon/update", async (req, res) => {
  try {
    const id = req.body.id;
    delete req.body.id;
    const data = { isActive: 0 };

    await Firebase.Coupons.doc(id).update(data);
    res.status(200).json({ message: "Updated Coupon" });
  } catch (error) {
    res.status(500).json({ message: error });
  }
});

// 12. Add more into gallery
app.put("/api/gallery/update", async (req, res) => {
  try {
    const id = req.body.id;
    delete req.body.id;
    const data = req.body;

    let snapshot = await Firebase.Gallery.doc(id).get();
    let highlightData = [...snapshot.data().highlights, ...data.highlights];
    console.log(highlightData);

    await Firebase.Gallery.doc(id).update({ highlights: highlightData });
    res.status(200).json({ message: "Updated Coupon" });
  } catch (error) {
    res.status(500).json({ message: error });
  }
});

// MODAL FETCHING DATA SECTION
// 1. Name + Number data create
app.post("/api/randomdata/create", async (req, res) => {
  try {
    const data = req.body;
    console.log(data);

    await Firebase.RandomData.add(data);
    res.status(200).json({ message: "Posted RandomData" });
  } catch (error) {
    console.log("error", error);
    res.status(500).json({ message: error });
  }
});

// 2. Feedback data create
app.post("/api/feedbackdata/create", async (req, res) => {
  try {
    const data = req.body;
    console.log(data);

    await Firebase.Feedback.add(data);
    res.status(200).json({ message: "Posted Feedback" });
  } catch (error) {
    console.log("error", error);
    res.status(500).json({ message: error });
  }
});

// 3. Pinkskypopup data create
app.post("/api/pinkskypopupentry/create", async (req, res) => {
  try {
    let data = req.body;

    let pinkskypopupentryData = {
      ...data,
      createdDate: new Date(),
      updatedDate: new Date(),
    };

    setTimeout(async () => {
      const response = await Firebase.PinkskyPopup.add(pinkskypopupentryData);

      res.status(200).json({ message: "Posted PinkskyPopup" });
    }, 2000);
  } catch (error) {
    console.log("error", error);
    res.status(500).json({ message: error });
  }
});

// 4. Adding payment details influencers
app.post("/api/influencerpayment/create", async (req, res) => {
  try {
    let data = req.body;

    const response = await Firebase.Influencer.doc(data.influencerid).get();
    let paymentdetails = {
      upi: data.upi,
    };

    await Firebase.Influencer.doc(data.influencerid).update({
      ...response.data(),
      paymentdetails,
    });
    res.status(200).json({ message: "Posted Influencer Payment" });
  } catch (error) {
    console.log("error", error);
    res.status(500).json({ message: error });
  }
});

// 4. Updating influencers details
app.put("/api/influencer/update", async (req, res) => {
  try {
    const data = req.body;
    const id = req.body.body.id;
    console.log(data);
    delete req.body.body.id;
    let message = "";
    message = "Updated Influencer";

    await Firebase.Influencer.doc(id).update(data.body);
    res.status(200).json({ message: message });
  } catch (error) {
    res.status(500).json({ message: error });
  }
});

// 5. Updating Brand details
app.put("/api/brand/update", async (req, res) => {
  try {
    const data = req.body;
    const id = req.body.body.id;
    console.log(data);
    delete req.body.body.id;
    let message = "";

    message = "Updated Brand";

    await Firebase.Brand.doc(id).update(data.body);
    res.status(200).json({ message: message });
  } catch (error) {
    res.status(500).json({ message: error });
  }
});

// MAPPING SECTION
// 1. Mapping brand with influencer - Hire me
app.put("/api/mappingbrandwithinfluencer/update", async (req, res) => {
  try {
    const data = req.body;
    console.log(data);

    const snapshot = await Firebase.Brand.get();
    let brandData = [];
    let brandDataMessage = [];
    let checkStatus = "";
    snapshot.docs.map((doc) => {
      if (doc.id === data.brandId) {
        if (doc.data().influencermapping.length > 0) {
          brandData.push(...doc.data().influencermapping);
        }

        brandDataMessage.push(...doc.data().message);
        checkStatus = doc.data().status;
      }
    });
    console.log("checkStatus", checkStatus);
    if (checkStatus === "new") {
      res.status(400).json({
        message: "Your status is pending for making changes on Pinksky.",
      });
    } else {
      brandData.push({ influencerId: data.influencerId, status: "new" });
      const influencersnapshot = await Firebase.Influencer.doc(
        data.influencerId
      ).get();
      brandDataMessage.push({
        statusID: "200",
        influencerID: data.influencerId,
        influencerName: influencersnapshot.data().name,
      });

      //Added in brand json
      await Firebase.Brand.doc(data.brandId).update({
        influencermapping: brandData,
        message: brandDataMessage,
      });
      res.status(200).json({ message: "Updated Brand" });
    }
  } catch (error) {
    res.status(500).json({ message: error });
  }
});

// 2. Mapping influencer with event - Join now
app.put("/api/mappinginfluencerwithevent/update", async (req, res) => {
  try {
    const data = req.body;

    const snapshot = await Firebase.Influencer.doc(data.influencerId).get();
    let influencerData = [...snapshot.data().eventmapping];
    let influencerDataMessage = [...snapshot.data().message];
    console.log(data);

    console.log("step1");
    if (influencerData.find((item) => item.eventId === data.eventId)) {
      let objIndex = influencerData.findIndex(
        (obj) => obj.eventId == data.eventId
      );
      influencerData[objIndex].status = "new";
      influencerData[objIndex].eventId = data.eventId;
    } else {
      influencerData.push({
        eventId: data.eventId,
        status: "new",
      });
    }
    console.log("step2");

    const eventsnapshot = await Firebase.Event.doc(data.eventId).get();

    influencerDataMessage.push(...snapshot.data().message, {
      statusID: "300",
      eventId: data.eventId,
      eventName: eventsnapshot.data().name,
    });

    console.log("influencerData after ", {
      eventmapping: influencerData,
      message: influencerDataMessage,
    });
    await Firebase.Influencer.doc(data.influencerId).update({
      eventmapping: influencerData,
      message: influencerDataMessage,
    });
    res.status(200).json({ message: "Updated Influencer" });
  } catch (error) {
    res.status(500).json({ message: error });
  }
});

// 3. Mapping influencer with campaign - Apply Now
app.put("/api/mappinginfluencerwithcampaign/update", async (req, res) => {
  try {
    const data = req.body;

    const snapshot = await Firebase.Influencer.get();
    let influencerData = [];
    let influencerDataMessage = [];
    snapshot.docs.map((doc) => {
      if (doc.id === data.influencerId) {
        if (doc.data().campaignmapping.length > 0) {
          influencerData.push(...doc.data().campaignmapping);
        }

        influencerDataMessage.push(...doc.data().message);
      }
    });
    console.log("influencerData before ", influencerData);
    const campaignsnapshot = await Firebase.Campaign.doc(data.campaignId).get();

    if (influencerData.find((item) => item.campaignId === data.campaignId)) {
      let objIndex = influencerData.findIndex(
        (obj) => obj.campaignId == data.campaignId
      );
      influencerData[objIndex].status = "new";
      influencerData[objIndex].biddingprice = data.biddingprice;
      influencerData[objIndex].campaignId = data.campaignId;
      influencerData[objIndex].closingPrice = "";
    } else {
      influencerData.push({
        campaignId: data.campaignId,
        biddingprice: data.biddingprice,
        status: "new",
        viewerDetails: campaignsnapshot.data().viewerDetails,
      });
    }

    influencerDataMessage.push({
      statusID: "200",
      campaignID: data.campaignId,
      campaignName: campaignsnapshot.data().name,
    });

    console.log("influencerData after ", influencerData);
    await Firebase.Influencer.doc(data.influencerId).update({
      campaignmapping: influencerData,
      message: influencerDataMessage,
    });
    res.status(200).json({ message: "Updated Influencer" });
  } catch (error) {
    res.status(500).json({ message: error });
  }
});

// 4. Mapping influencer with campaign adding deliverable links - Send it
app.put("/api/mappinginfluencerwithcampaignlinks/update", async (req, res) => {
  try {
    const data = req.body;
    console.log(data);

    let snapshot = await Firebase.Influencer.doc(data.influencerId).get();

    const campaignsnapshot = await Firebase.Campaign.doc(data.campaignId).get();
    console.log("step1");
    let campaignmappinglocal = [];
    let influencerDataMessage = [
      ...snapshot.data().message,
      {
        statusID: "400",
        campaignID: data.campaignId,
        campaignName: campaignsnapshot.data().name,
      },
    ];
    console.log("check", snapshot.data().campaignmapping);
    snapshot.data().campaignmapping.map((camp) => {
      console.log("step2");
      if (camp.campaignId === data.campaignId) {
        console.log("step3");
        let revnumber = camp.revision + 1 || 0;
        console.log(revnumber);
        if (revnumber === 0) {
          console.log("step4");
          campaignmappinglocal.push({
            ...camp,
            links: [{ url: data.links, revision: revnumber }],
            revision: revnumber,
            paymentStatus: "new",
          });
        } else {
          console.log("step5");
          campaignmappinglocal.push({
            ...camp,
            links: [...camp.links, { url: data.links, revision: revnumber }],
            revision: revnumber,
            paymentStatus: "new",
          });
        }
      } else {
        console.log("step6");
        campaignmappinglocal.push({ ...camp });
      }
    });

    console.log("campaignmapping", campaignmappinglocal);
    console.log("campaignmapping", influencerDataMessage);
    await Firebase.Influencer.doc(data.influencerId).update({
      campaignmapping: [...campaignmappinglocal],
      message: influencerDataMessage,
    });
    res.status(200).json({ message: "Updated Influencer with link" });
  } catch (error) {
    res.status(500).json({ message: error });
  }
});

//----------------------------------------------------------------------

app.listen(PORT, () => console.log("Running @5000"));

import nodemailer from 'nodemailer';
import mailGen from 'mailgen';
import dotenv from 'dotenv'

dotenv.config();

const transporter = nodemailer.createTransport({
  // host: "smtp.forwardemail.net",
  host: "smtp.zoho.com",
  service:  "Zoho",
  port: 465,
  secure: true,
  auth: {
    // TODO: replace `user` and `pass` values from <https://forwardemail.net>
      user: process.env.MAILER_USERNAME,
      pass: process.env.MAILER_PASSWORD,
  }
});

let mailGenerator = new mailGen({
    theme: "cerberus",
    product: {
      name: "TripMatch Experience",
      link: "https://tripmatch.com",
      logo: ""
    }
});

// async..await is not allowed in global scope, must use a wrapper
export  default async function main(params) {

  var email = {
    body: {
        name: params.toName || params.toEmail,
        intro: params.message || 'Welcome to Mailgen! We\'re very excited to have you on board.',
        action: {
            instructions: 'To get started with TripMatch, please click here:',
            button: {
                color: '#22BC66', // Optional action button color
                text: 'Confirm your account',
                link: params.link
            }
        },
        outro: 'Need help, or have questions? Just reply to this email, we\'d love to help.'
    }
  };

  var emailBody = mailGenerator.generate(email);
  // send mail with defined transport object
  const info = await transporter.sendMail({
    from: "TripMatch Team, " + process.env.MAILER_USERNAME, // sender address
    to: params.toEmail, // list of receivers
    subject: params.subject, // Subject line
    text: params.message, // plain text body
    html: `<b>${emailBody}</b>`, // html body
  });
  
  console.log("Message sent: %s", info.messageId);
  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

  //
  // NOTE: You can go to https://forwardemail.net/my-account/emails to see your email delivery status and preview
  //       Or you can use the "preview-email" npm package to preview emails locally in browsers and iOS Simulator
  //       <https://github.com/forwardemail/preview-email>
  //
}

// main().catch(console.error);
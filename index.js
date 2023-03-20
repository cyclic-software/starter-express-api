const express = require('express')
const app = express()

const _ = require('lodash');
const nodemailer = require('nodemailer')

exports.SendMails = (req,res) => {
    let {emails, Subject, body} = req.body
  var transporter = nodemailer.createTransport({
    service: 'gmail',
    port: 465,
    secure: false,
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASSWORD
    },
  });

  if (_.isArray(emails)) {
    emails.forEach((email, i) => {
      var mailOptions = {
        from: process.env.EMAIL,
        to: email,
        subject: Subject,
        text: body
      };

      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      });
      if (i === emails.length - 1) {
        transporter.close();
      }
    });
  } else {
    var mailOptions = {
      from: 'gyandas12998@gmail.com',
      to: emails,
      subject: Subject,
      html: `<!DOCTYPE html>
            <html>
            <head>
           <body>
           <p>`${data}`</p>
            
            </body>
            </html>`
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    });
  }
};


exports.validateEmail = (email) => {
  return String(email).toLowerCase().match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
};

app.all('/', SendMails)


app.listen(process.env.PORT || 3000)

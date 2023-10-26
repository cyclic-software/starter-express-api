const express = require('express');
const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');
const ejs = require('ejs');
const formidable = require('formidable');

var app = express();
var cors = require('cors');
port = 8888;
const API = "AIzaSyAudZ2GG8YYJBDJjVLojkPUMy9FsbTg-rA";

app.get("/",(req,res) => {
  res.send("Welcome to node server");
});

app.get("/download",(req,res) => {
  ejs.renderFile('download_view.ejs', {}, {}, (err, template) => {
    if(err) throw err;
    else res.send(template);
  });
})

app.get("/view", (req,res) => {
  res.render('view',{loadPage: false,url:undefined});
})

app.post("/view-page",(req,res) => {
  const form = new formidable.IncomingForm();
  let body = {};
  form.parse(req,(err,fields,files) => {
    if(err) {
      res.send("Some error occured");
      throw err;
    }
    body = fields;
    let url = String(body.url[0]);
    if(!url.startsWith("http")) {
      url = `https://drive.google.com/u/0/uc?id=${url}&export=download`
    }
    res.render('view',{loadPage: true, url})
  });
})

app.post("/download-file", (req,res) => {
  const form = new formidable.IncomingForm();
  let body = {};
  form.parse(req,(err,fields,files) => {
    if(err) {
      res.send("Some error occured");
      throw err;
    }
    body = fields;
    let url = String(body.url[0]);
    if(url.includes("drive.google.com")) {
      let spl = url.split("/");
      let id = spl[spl.length - 2];
      url = `https://www.googleapis.com/drive/v3/files/${id}/?alt=media&key=${API}`;
    }
    fileName = body.name[0];
    protocol = body.protocol[0];
    let proto = https;
    if(protocol === 'http') proto = http;
    let file = fs.createWriteStream(fileName);
    proto.get(url, response => {
      response.pipe(file);
      file.on('finish',() => {
        file.close();
        console.log('Download completed');
        filePath = path.join(__dirname,fileName);
        res.download(filePath);
      });
    });
  });
});

app.listen(port,() => {
  console.log(`Server is running on ${port}`);
});
app.use(express.urlencoded({extended:true}));
app.set('view engine','ejs');
// app.use(cors({
//   origin:'http://localhost:8888', 
//   credentials:true,            //access-control-allow-credentials:true
//   optionSuccessStatus:200
// }));
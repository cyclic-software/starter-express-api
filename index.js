
const { Telegraf } = require('telegraf');
// require('dotenv').config();//"dotenv": "^16.3.1",
// const fs = require('fs');
const express = require('express');
const https = require('https');
const { MongoClient } = require('mongodb');
const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);
const data_api = 'https://ogiedata.com/api/data/';
const airtime_api = 'https://ogiedata.com/api/topup/';
const bill_api = 'https://ogiedata.com/api/billpayment/';
const cablesub_api = 'https://ogiedata.com/api/cablesub/';
const rechargePin_api = 'https://ogiedata.com/api/rechargepin/';
let admin = null;
const ogiedataSecretKey = process.env.OGIEDATA_SECRET_KEY;
const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;

// Global variable to store the database connection
let client;

var filestorage = {};
const url = "mongodb+srv://zunascodata:ZunascoDATA123@zunascodatadb.kvvooq0.mongodb.net/?retryWrites=true&w=majority";
const dbName = 'zunascodatadb';
const collectionName = 'zdcollection';

getDataFromdb();

async function getDataFromdb() {
    try {
        client = new MongoClient(url);
        await client.connect();
        console.log('Connected to the database.');
        const db = client.db(dbName);
        const collection = db.collection(collectionName);
        
        const query = {"mongodb":true};        
        // Read - Find a JSON object by its name
        const foundObject = await collection.findOne(query);
        console.log('Retrieved JSON object:', foundObject);
        if (foundObject) {
            // Close the connection after the operations
            await client.close();
            console.log('Connection to MongoDB closed');
            filestorage = foundObject.userdata;
            if(filestorage.admin) {
                bot.telegram.sendMessage(admin, "Connected!", {});
            }
            return foundObject.userdata;
        } else {
            filestorage.appRestart = false;
            await client.close();
            console.log('Connection to MongoDB closed');
            return null;
        }
         
    } catch (err) {
        console.error('Error:', err);
    }
}
async function gracefulEnd(){
    // Function to connect to the database
    try {
        client = new MongoClient(url);
        await client.connect();
        console.log('Connected to the database.');
        const db = client.db(dbName);
        const collection = db.collection(collectionName);
        if(admin){            
            filestorage.admin = admin;
        }
        // JSON object to save
        const jsonObject = {userdata:filestorage};
        const query = {"mongodb":true};        
        // Read - Find a JSON object by its name
        const foundObject = await collection.findOne(query);
        console.log('Retrieved JSON object:', foundObject);
        if (!foundObject) {
            // Create - Insert the JSON object into the collection
            const insertResult = await collection.insertOne(Object.assign(jsonObject,query));
            console.log('JSON object saved successfully:', insertResult);
            
        } else {
            // Update - Update the age of the JSON object
            const updatedObject = await collection.updateOne(query,{ $set: {userdata: filestorage} });
            console.log('Updated JSON object:', jsonObject);
         
            
        }
        
        // Delete - Delete the JSON object
        // await deleteDocument(collection, 'John Doe');
        // console.log('JSON object deleted successfully.');
        
    } catch (err) {
        console.error('Error:', err);
    } finally {
        // Close the connection after the operations
        await client.close();
        console.log('Connection to MongoDB closed');
      }
}




const Ogieheaders = {
    'Content-Type': 'application/json',
    Authorization: 'Token '+ogiedataSecretKey
}

// const ogiedata = getData('https://ogiedata.com/api/user/', Ogieheaders);

// let MTNplans = []



const mtnOptions = {
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: "₦150 - 500.0 MB - 30 days",
            callback_data: "256"
          }
        ],
        [
          {
            text: "₦250 - 1 GB - 30 days",
            callback_data: "251"
          }
        ],
        [
          {
            text: "₦500 - 2.0 GB - 30 days",
            callback_data: "252"
          }
        ],
        [
          {
            text: "₦800 - 3.0 GB - 30 days",
            callback_data: "253"
          }
        ],
        [
          {
            text: "₦1350 - 5.0 GB - 30 days",
            callback_data: "254"
          }
        ],
        [
          {
            text: "₦2500 - 10 GB - 30 days",
            callback_data: "255"
          }
        ]
    ]}
}

const airtelOptions = {
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: "₦100 - 100.0 MB - 7 days",
            callback_data: "224"
          }
        ],
        [
            {
              text: "₦200 - 500.0 MB - 30 days",
              callback_data: "218"
            }
        ],
        [
          {
            text: "₦350 - 1 GB - 30 days",
            callback_data: "219"
          }
        ],
        [
          {
            text: "₦700 - 2.0 GB - 30 days",
            callback_data: "220"
          }
        ],
        [
          {
            text: "₦1650 - 5.0 GB - 30 days",
            callback_data: "221"
          }
        ],
        [
          {
            text: "₦3300 - 10.0 GB - 30 days",
            callback_data: "223"
          }
        ],[
            {
              text: "₦3000 - 10.0 GB - 30 days",
              callback_data: "150"
            }
          ],
        [
          {
            text: "₦6600 - 20 GB - 30 days",
            callback_data: "229"
          }
        ]
    ]}
}

const nineMobileOptions = {
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: "₦100 - 500.0 MB - 30 days",
            callback_data: "244"
          }
        ],
        [
          {
            text: "₦220 - 1 GB - 30 days",
            callback_data: "245"
          }
        ],
        [
          {
            text: "₦450 - 2.0 GB - 30 days",
            callback_data: "246"
          }
        ],
        [
          {
            text: "₦650 - 3.0 GB - 30 days",
            callback_data: "247"
          }
        ],
        [
          {
            text: "₦1000 - 5.0 GB - 30 days",
            callback_data: "248"
          }
        ],
        [
          {
            text: "₦2000 - 10 GB - 30 days",
            callback_data: "249"
          }
        ]
    ]}
}

const gloOptions = {
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: "₦150 - 500.0 MB - 30 days",
            callback_data: "239"
          }
        ],
        [
          {
            text: "₦270 - 1 GB - 30 days",
            callback_data: "237"
          }
        ],
        [
          {
            text: "₦550 - 2.0 GB - 30 days",
            callback_data: "238"
          }
        ],
        [
          {
            text: "₦800 - 3.0 GB - 30 days",
            callback_data: "240"
          }
        ],
        [
          {
            text: "₦1350 - 5.0 GB - 30 days",
            callback_data: "241"
          }
        ],
        [
          {
            text: "₦2700 - 10 GB - 30 days",
            callback_data: "242"
          }
        ]
    ]}
}

const Services = {
    reply_markup: {
        inline_keyboard: [
            [{
                text: "Buy Data",
                callback_data: 'buyData'
                }],
            [{
                text: "Buy Airtime",
                callback_data: 'buyAirtime'
                }],
            [{
                text: "Pay Electricity Bill",
                callback_data: 'payElectricityBill'
                }],
            [{
                text: "Pay Cable Bill",
                callback_data: 'payCableBill'
                }]

        ]
    }
}

const NetworkProviders = {
    reply_markup: {
        inline_keyboard: [
            [{
                text: "MTN",
                callback_data: 'MTN'
                }],
            [{
                text: "AIRTEL",
                callback_data: 'AIRTEL'
                }],
            [{
                text: "9MOBILE",
                callback_data: '9MOBILE'
                }],
            [{
                text: "GLO",
                callback_data: 'GLO'
                }],

        ]
    }
}

const ElectricProviders = {
    reply_markup: {
        inline_keyboard: [
            [{
                text: "Ikeja Electric",
                callback_data: 'IKEJA'
            }],
            [{
                text: "Eko Electric",
                callback_data: 'EKO'
            }],
            [{
                text: "Abuja Electric",
                callback_data: 'ABUJA'
            }],
            [{
                text: "Kano Electric",
                callback_data: 'KANO'
            }],
            [{
                text: "Enugu Electric",
                callback_data: 'ENUGU'
            }],
            [{
                text: "Port Harcourt Electric",
                callback_data: 'PHC'
            }],
            [{
                text: "Ibadan Electric",
                callback_data: 'IBADAN'
            }],
            [{
                text: "Kaduna Electric",
                callback_data: 'KADUNA'
            }],
            [{
                text: "Jos Electric",
                callback_data: 'JOS'
            }],
            [{
                text: "Benin Electric",
                callback_data: 'BENIN'
            }],
            [{
                text: "Yola Electric",
                callback_data: 'YOLA'
            }]
        ]
    }
};


const TVServiceProviders = {
    reply_markup: {
        inline_keyboard: [
            [{
                text: "GOTV",
                callback_data: 'GOTV'
            }],
            [{
                text: "DSTV",
                callback_data: 'DSTV'
            }],
            [{
                text: "STARTIME",
                callback_data: 'STARTIME'
            }]
        ]
    }
};


const GOTVService = {
    reply_markup: {
        inline_keyboard: [
            [{
                text: "GOtv Max - ₦4,850",
                callback_data: 'GOTV_MAX'
            }],
            [{
                text: "GOtv Jinja - ₦2,250",
                callback_data: 'GOTV_JINJA'
            }],
            [{
                text: "GOtv Jolli - ₦3,300",
                callback_data: 'GOTV_JOLLI'
            }],
            [{
                text: "GOtv Smallie - Monthly - ₦1,100",
                callback_data: 'GOTV_SMALLIE_MONTHLY'
            }],
            [{
                text: "GOtv Smallie - Quarterly - ₦2,400",
                callback_data: 'GOTV_SMALLIE_QUARTERLY'
            }],
            [{
                text: "GOtv Smallie - Yearly - ₦8,600",
                callback_data: 'GOTV_SMALLIE_YEARLY'
            }],
            [{
                text: "Super - ₦6,400 - 1 Month",
                callback_data: 'SUPER_MONTHLY'
            }]
        ]
    }
};


const DSTVService = {
    reply_markup: {
        inline_keyboard: [
            [{
                text: "DStv Yanga - ₦3,500",
                callback_data: 'DSTV_YANGA'
            }],
            [{
                text: "DStv Compact - ₦10,500",
                callback_data: 'DSTV_COMPACT'
            }],
            [{
                text: "DStv Compact Plus - ₦16,600",
                callback_data: 'DSTV_COMPACT_PLUS'
            }],
            [{
                text: "DStv Premium - ₦24,500",
                callback_data: 'DSTV_PREMIUM'
            }],
            [{
                text: "DStv Confam - ₦6,200",
                callback_data: 'DSTV_CONFAM'
            }],
            [{
                text: "DStv Padi - ₦2,500",
                callback_data: 'DSTV_PADI'
            }],
            [{
                text: "DStv Asia - ₦8,300",
                callback_data: 'DSTV_ASIA'
            }],
            [{
                text: "DStv Premium French - ₦29,300",
                callback_data: 'DSTV_PREMIUM_FRENCH'
            }],
            [{
                text: "DStv Premium Asia - ₦23,500",
                callback_data: 'DSTV_PREMIUM_ASIA'
            }],
            [{
                text: "DStv Confam + ExtraView - ₦8,200",
                callback_data: 'DSTV_CONFAM_EXTRAVIEW'
            }],
            [{
                text: "DStv Yanga + ExtraView - ₦5,850",
                callback_data: 'DSTV_YANGA_EXTRAVIEW'
            }],
            [{
                text: "DStv Padi + ExtraView - ₦5,050",
                callback_data: 'DSTV_PADI_EXTRAVIEW'
            }],
            [{
                text: "DStv Compact + Extra View - ₦11,900",
                callback_data: 'DSTV_COMPACT_EXTRAVIEW'
            }],
            [{
                text: "DStv Premium + Extra View - ₦24,500",
                callback_data: 'DSTV_PREMIUM_EXTRAVIEW'
            }],
            [{
                text: "DStv Compact Plus - Extra View - ₦16,600",
                callback_data: 'DSTV_COMPACT_PLUS_EXTRAVIEW'
            }],
            [{
                text: "DStv HDPVR Access Service - ₦3,500",
                callback_data: 'DSTV_HDPVR_ACCESS'
            }],
            [{
                text: "ExtraView Access - ₦3,500",
                callback_data: 'EXTRAVIEW_ACCESS'
            }]
        ]
    }
};


const StartimesTVService = {
    reply_markup: {
        inline_keyboard: [
            [{
                text: "Classic - ₦3,100 - 1 Month",
                callback_data: 'CLASSIC'
            }],
            [{
                text: "Basic - ₦2,100 - 1 Month",
                callback_data: 'BASIC'
            }],
            [{
                text: "Smart - ₦2,900 - 1 Month",
                callback_data: 'SMART'
            }],
            [{
                text: "Nova - ₦1,200 - 1 Month",
                callback_data: 'NOVA'
            }],
            [{
                text: "Super - ₦5,400 - 1 Month",
                callback_data: 'SUPER'
            }],
            [{
                text: "Nova - ₦400 - 1 Week",
                callback_data: 'NOVA_WEEKLY'
            }],
            [{
                text: "Basic - ₦700 - 1 Week",
                callback_data: 'BASIC_WEEKLY'
            }],
            [{
                text: "Smart - ₦900 - 1 Week",
                callback_data: 'SMART_WEEKLY'
            }],
            [{
                text: "Classic - ₦1,200 - 1 Week",
                callback_data: 'CLASSIC_WEEKLY'
            }],
            [{
                text: "Super - ₦1,800 - 1 Week",
                callback_data: 'SUPER_WEEKLY'
            }],
            [{
                text: "Nova - ₦100 - 1 Day",
                callback_data: 'NOVA_DAILY'
            }],
            [{
                text: "Basic - ₦200 - 1 Day",
                callback_data: 'BASIC_DAILY'
            }],
            [{
                text: "Smart - ₦250 - 1 Day",
                callback_data: 'SMART_DAILY'
            }],
            [{
                text: "Classic - ₦320 - 1 Day",
                callback_data: 'CLASSIC_DAILY'
            }],
            [{
                text: "Super - ₦500 - 1 Day",
                callback_data: 'SUPER_DAILY'
            }]
        ]
    }
};




//Functions


function delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

async function getIdFromEmail(email){
    // const filePath = 'userData.json';
    if (filestorage) {
        const userdata = filestorage;
        for (let entry in userdata) {
            if(userdata[entry].user.email === email) {
                return userdata[entry].user.id
            } else {
                return null;
            }
        }
        
        
      } else {
        // console.log('Data file does not exist.');
        return null;
      }
    /*
    try {
      // Check if the data file exists
      if (fs.existsSync(filePath)) {
        // Read the data from the file
        const jsonData = fs.readFileSync(filePath);
        const userdata = JSON.parse(jsonData);
        for (let entry in userdata) {
            if(userdata[entry].user.email === email) {
                return userdata[entry].user.id
            } else {
                return null;
            }
        }
        
        
      } else {
        // console.log('Data file does not exist.');
        return null;
      }
    } catch (error) {
      console.error('Error:', error.message);
    }*/
}

async function thank(ctx) {
    await delay(1500);
    bot.telegram.sendMessage(ctx.chat.id, `Thank you for using ${ctx.botInfo.username} ☺️,\nIf you enjoy using our service, please share this bot with your friends and family using this link; https://t.me/${ctx.botInfo.username} \n\nTo start a new conversation, send /start\n send /help to get help`, {});
}

function datetime(dateString, type='all') {

    const date = new Date(dateString);

    const formattedDate = date.toLocaleDateString('en-NG', {
    timeZone: 'Africa/Lagos',
    month: 'numeric',
    day: 'numeric',
    year: 'numeric'
    });

    const formattedTime = date.toLocaleTimeString('en-NG', {
    timeZone: 'Africa/Lagos',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
    hour12: true
    });
    if (type === 'all') {
        return `${formattedDate} ${formattedTime}`;
    } else if (type === 'date') {
        return formattedDate;
    } else if (type === 'time') {
        return formattedTime;
    } 

}

async function updateData(chatId,userData) {
    // const filename = 'userData.json';
    if (filestorage) {
        const jsonData = filestorage;
        if (jsonData.hasOwnProperty(chatId)) {
            // Append the new data to the existing entry
            Object.assign(jsonData[chatId], userData);
            // console.log(`Data appended to entry with ID: ${chatId}`);
            } else {
            // Create a new entry with the data
            jsonData[chatId] = userData;
            // console.log('New entry created');
        }
    } else {
        filestorage = {
            [chatId]: userData
            };
    }
        /*
        // Check if the file exists
        if (fs.existsSync(filename)) {
    // Read the existing file contents
    const fileData = fs.readFileSync(filename, 'utf-8');

    let jsonData = {};
    if (fileData) {
    // Parse the existing JSON data
    jsonData = JSON.parse(fileData);
    }

    // Check if the ID exists
    if (jsonData.hasOwnProperty(chatId)) {
    // Append the new data to the existing entry
    Object.assign(jsonData[chatId], userData);
    // console.log(`Data appended to entry with ID: ${chatId}`);
    } else {
    // Create a new entry with the data
    jsonData[chatId] = userData;
    // console.log('New entry created');
    }

    // Write the updated JSON data to the file
    fs.writeFileSync(filename, JSON.stringify(jsonData, null, 2));
} else {
    // Create a new file and add the data as the first entry
    const jsonData = {
    [chatId]: userData
    };
    fs.writeFileSync(filename, JSON.stringify(jsonData, null, 2));
    // console.log('File created and data appended');
}*/
}

async function getDataById(chatId) {
    // const filePath = 'userData.json';
    if (filestorage.appRestart) {
        filestorage.appRestart = false;
        // filestorage = await getDataFromdb();
        // appRestart = false;
    }
    // console.log(filestorage);
    if (filestorage) {
        const jsonData = filestorage
        return jsonData[chatId];
    } else {
        return null;
    }
    /*
    try {
      // Check if the data file exists
      if (fs.existsSync(filePath)) {
        // Read the data from the file
        const jsonData = fs.readFileSync(filePath);
        const data = JSON.parse(jsonData);  
        //console.log('Data found:');
        //console.log(data[chatId]);
        return data[chatId];
        
      } else {
        // console.log('Data file does not exist.');
        return null;
      }
    } catch (error) {
      console.error('Error:', error.message);
    }*/
  }
  


function add_network(hook){
    bot.action(hook, async ctx => {
        userData = await getDataById(ctx.chat.id);
        userData.mobileReady = true;
        bot.telegram.sendMessage(ctx.chat.id, 'Send the Mobile number', {});
        userData.request.network = hook;
        await updateData(ctx.chat.id,userData);
    })
}

function add_cable(hook){
    bot.action(hook, async ctx => {
        userData = await getDataById(ctx.chat.id);
        userData.cableName = hook;
        let options;
        switch (hook) {
            case 'buyData':
                options = NetworkProviders;
                break;
            case 'buyAirtime':
                options = NetworkProviders;
                break;
            case 'payElectricityBill':
                options = ElectricProviders;
                break;
            case 'payCableBill':
                options = TVServiceProviders;
                break;
            default:
                options = {};
        }
        bot.telegram.sendMessage(ctx.chat.id, 'Choose a Subscription Plan', options);
    })
}

function add_Electricity_Bill(hook){
    bot.action(hook, async ctx => {
        userData = await getDataById(ctx.chat.id);
        userData.ElectDistroName = hook;
        let options;
        switch (hook) {
            case 'IKEJA':
                options = {};
                break;
            case 'EKO':
                options = {};
                break;
            case 'ABUJA':
                options = {};
                break;
            case 'KANO':
                options = {};
                break;
            case 'ENUGU':
                options = {};
                break;
            case 'PHC':
                options = {};
                break;
            case 'IBADAN':
                options ={};
                break;
            case 'KADUNA':
                options ={};
                break;
            case 'JOS':
                options ={};
                break;
            case 'BENIN':
                options ={};
                break;
            case 'YOLA':
                options = {};
                break;
            default:
                options = {};
        }
        bot.telegram.sendMessage(ctx.chat.id, 'Choose a Subscription Plan', options);
    })
}



function isValidJSON(str) {
  try {
    JSON.parse(str);
    return true;
  } catch (error) {
    console.log('Error: ',error);
    return false;
  }
}


function add_plan(hook){
    bot.action(hook, async ctx => {  
        userData = await getDataById(ctx.chat.id);
        userData.request.plan = hook;        
        await updateData(ctx.chat.id,userData);

        if (userData.user.email) {
            userData.request.amount = getinfo(hook, 'cost');
            await updateData(ctx.chat.id,userData);

            const paymentURL = {
                reply_markup: {
                    inline_keyboard: [
                        [{
                            text: "PAY",
                            url: `https://t.me/${ctx.botInfo.username}`
                        }]
                    ]
                }
            }

            const params = JSON.stringify({
                "email": userData.user.email,
                "amount": userData.request.amount,
                "callback_url": 'https://t.me/chopDATA_bot',
                "metadata": {
                    "cancel_action": "https://t.me/chopDATA_bot",
                    "request": userData.request,
                    "user": userData.user
                  }
              })
              
            const options = {
                hostname: 'api.paystack.co',
                port: 443,
                path: '/transaction/initialize',
                method: 'POST',
                headers: {
                  Authorization: 'Bearer ' + PAYSTACK_SECRET_KEY,
                  'Content-Type': 'application/json'
                }
            }
              
            const req = https.request(options, res => {
                let data = ''
              
                res.on('data', (chunk) => {
                  data += chunk
                });
              
                res.on('end', async () => {
                    if (!isValidJSON(data)) return;
                    const responseData = JSON.parse(data);
                    if (responseData.status) {
                    paymentURL.reply_markup.inline_keyboard[0][0].url = responseData.data.authorization_url;
                    userData.payment.status = 'INITIAL';
                    userData.payment.transactionId = responseData.data.reference;

                    await updateData(ctx.chat.id,userData);
                    await delay(1000);
                    bot.telegram.sendMessage(ctx.chat.id, `You are about to pay N${getinfo(hook, 'cost')/100} for ${getinfo(hook, 'data')} ${getinfo(hook, 'duration')} to ${userData.request.mobileNumber}, ${userData.request.network}\nClick on pay and open the link to make your payment.`, paymentURL);
                    
                    } else {
                        if (responseData.message === "Invalid Email Address Passed") {
                            //set email correctly
                            bot.telegram.sendMessage(ctx.chat.id, `${responseData.message}. Please use a valid email address.`, {
                                reply_markup: {
                                    inline_keyboard: [
                                        [{
                                            text: "Set Email",
                                            callback_data: 'email'
                                            }]
                                    ]
                                }
                            });                        
                        }
                    }


                })
            })
            .on('error', error => {
                console.error(error)
            })
              
            req.write(params)
            req.end()
        
            
        } else {
            const notifyPayOptions ={
                reply_markup: {
                    inline_keyboard: [
                        [{
                            text: "Set Email",
                            callback_data: 'email'
                            }]
                    ]
                }
            }
            userData.checkedNotification = true;
            bot.telegram.sendMessage(ctx.chat.id, 'It is required to set an email address to recieve your payment notifications, click on Set Email or send /email', notifyPayOptions);
        }
        
    })
}


function add_service(hook){
    bot.action(hook, async ctx => {
        userData = await getDataById(ctx.chat.id);
        userData.request.action = hook;
        let options;
        switch (hook) {
            case 'buyData':
                options = NetworkProviders;
                break;
            case 'buyAirtime':
                options = NetworkProviders;
                break;
            case 'payElectricityBill':
                options = ElectricProviders;
                break;
            case 'payCableBill':
                options = TVServiceProviders;
                break;
            default:
                options = {};
        }       
        bot.telegram.sendMessage(ctx.chat.id, 'Choose the Network Provider ', options );
        await updateData(ctx.chat.id,userData);
    })
}

function use_id(network) {
    switch (network) {
        case 'MTN':
            return 1;
        case 'AIRTEL':
            return 4;
        case '9MOBILE':
            return 3;
        case 'GLO':
            return 2;
        case 'GOTV':
            return 1;
        case 'DSTV':
            return 2;
        case 'STARTIME':
            return 3;
    }
    
}

async function postData(url, data, header, requestMethod = 'POST') {
    try {
        const response = await fetch(url, {
            method: requestMethod,
            headers: header,
            body: JSON.stringify(data)
        });
        const jsonData = await response.json()
        console.log(`Posted ${url} with Response:`, jsonData);
        return jsonData;
    } catch (error) {
        console.error('Error:', error.message);
    }
}


function getinfo(hook, action = 'cost') {

    
    let value;
    switch (hook) {
        // MTN
        case '256':
            if (action === "cost") {
                value = 150;
            } else if (action === 'data') {
                value = '500.0 MB'
            } else if (action === 'duration') {
                value = '30 days'
            }            
            break;
        case '251':
            if (action === "cost") {
                value = 250;
            } else if (action === 'data') {
                value = '1 GB'
            } else if (action === 'duration') {
                value = '30 days'
            }            
            break;
        case '252':
            if (action === "cost") {
                value = 500;
            } else if (action === 'data') {
                value = '2.0 GB'
            } else if (action === 'duration') {
                value = '30 days'
            }            
            break;
        case '253':
            if (action === "cost") {
                value = 800;
            } else if (action === 'data') {
                value = '3.0 GB'
            } else if (action === 'duration') {
                value = '30 days'
            }            
            break;
        case '254':
            if (action === "cost") {
                value = 1350;
            } else if (action === 'data') {
                value = '5.0 GB'
            } else if (action === 'duration') {
                value = '30 days'
            }            
            break;
        case '255':
            if (action === "cost") {
                value = 2500;
            } else if (action === 'data') {
                value = '10 GB'
            } else if (action === 'duration') {
                value = '30 days'
            }            
            break;
        // AIRTEL
        case '218':
            if (action === "cost") {
                value = 200;
            } else if (action === 'data') {
                value = '500.0 MB'
            } else if (action === 'duration') {
                value = '30 days'
            }            
            break;
        case '219':
            if (action === "cost") {
                value = 350;
            } else if (action === 'data') {
                value = '1.0 GB'
            } else if (action === 'duration') {
                value = '30 days'
            }            
            break;
        case '220':
            if (action === "cost") {
                value = 700;
            } else if (action === 'data') {
                value = '2.0 GB'
            } else if (action === 'duration') {
                value = '30 days'
            }            
            break;
        case '221':
            if (action === "cost") {
                value = 1650;
            } else if (action === 'data') {
                value = '5.0 GB'
            } else if (action === 'duration') {
                value = '30 days'
            }            
            break;
        case '223':
            if (action === "cost") {
                value = 3300;
            } else if (action === 'data') {
                value = '10.0 GB'
            } else if (action === 'duration') {
                value = '30 days'
            }            
            break;
        case '229':
            if (action === "cost") {
                value = 6600;
            } else if (action === 'data') {
                value = '20.0 GB'
            } else if (action === 'duration') {
                value = '30 days'
            }            
            break;
        // 9MOBILE
        case '244':
            if (action === "cost") {
                value = 100;
            } else if (action === 'data') {
                value = '500.0 MB'
            } else if (action === 'duration') {
                value = '30 days'
            }            
            break;
        case '245':
            if (action === "cost") {
                value = 220;
            } else if (action === 'data') {
                value = '1.0 GB'
            } else if (action === 'duration') {
                value = '30 days'
            }            
            break;
        case '246':
            if (action === "cost") {
                value = 450;
            } else if (action === 'data') {
                value = '2.0 GB'
            } else if (action === 'duration') {
                value = '30 days'
            }            
            break;
        case '247':
            if (action === "cost") {
                value = 650;
            } else if (action === 'data') {
                value = '3.0 GB'
            } else if (action === 'duration') {
                value = '30 days'
            }            
            break;
        case '248':
            if (action === "cost") {
                value = 1000;
            } else if (action === 'data') {
                value = '5.0 GB'
            } else if (action === 'duration') {
                value = '30 days'
            }            
            break;
        case '249':
            if (action === "cost") {
                value = 2000;
            } else if (action === 'data') {
                value = '10.0 GB'
            } else if (action === 'duration') {
                value = '30 days'
            }            
            break;
        // GLO
        case '239':
            if (action === "cost") {
                value = 150;
            } else if (action === 'data') {
                value = '500.0 MB'
            } else if (action === 'duration') {
                value = '30 days'
            }            
            break;
        case '237':
            if (action === "cost") {
                value = 270;
            } else if (action === 'data') {
                value = '1.0 GB'
            } else if (action === 'duration') {
                value = '30 days'
            }            
            break;
        case '238':
            if (action === "cost") {
                value = 550;
            } else if (action === 'data') {
                value = '2.0 GB'
            } else if (action === 'duration') {
                value = '30 days'
            }            
            break;
        case '240':
            if (action === "cost") {
                value = 800;
            } else if (action === 'data') {
                value = '3.0 GB'
            } else if (action === 'duration') {
                value = '30 days'
            }            
            break;
        case '241':
            if (action === "cost") {
                value = 1350;
            } else if (action === 'data') {
                value = '5.0 GB'
            } else if (action === 'duration') {
                value = '30 days'
            }            
            break;
        case '242':
            if (action === "cost") {
                value = 2700;
            } else if (action === 'data') {
                value = '10.0 GB'
            } else if (action === 'duration') {
                value = '30 days'
            }            
            break;
        /*
        case '245':
            if (action === "cost") {
                value = 220;
            } else if (action === 'data') {
                value = '1.0 GB'
            } else if (action === 'duration') {
                value = '30 days'
            }            
            break;
        case '245':
            if (action === "cost") {
                value = 220;
            } else if (action === 'data') {
                value = '1.0 GB'
            } else if (action === 'duration') {
                value = '30 days'
            }            
            break;*/
        default:
            value = null;

    }
    if (typeof value === 'number') {
        return value*100;
    }else {
        return value;
    }
    
}





// Webhook URL where Telegram will send updates
// const WEBHOOK_URL = 'https://booming-skill-393415.rj.r.appspot.com/webhook'; // Replace this with your actual webhook URL

// // Set the webhook URL using the setWebhook method
// bot.telegram.setWebhook(WEBHOOK_URL).then(() => {
//   console.log(`Webhook URL set to: ${WEBHOOK_URL}`);
// });

//method for invoking start command
 
bot.command('start',async ctx => {
    userData = await getDataById(ctx.chat.id);
    if (userData) {
        bot.telegram.sendMessage(ctx.chat.id, 'What would you like to do?', Services );
    } else {
        bot.telegram.sendMessage(ctx.chat.id, `Hello ${ctx.from.first_name}, Welcome to ANYDATA! ☺️`, {});
        const data = {}
        data.user = ctx.from;
        data.request = {};
        data.payment = {};
        await updateData(ctx.chat.id,data);
        await delay(1500);
        bot.telegram.sendMessage(ctx.chat.id, 'What would you like to do?', Services );
    }      
    
    
});

//send phone number message
bot.hears(/^(\+?234|0)[789]\d{9}$/, async ctx => {
    userData = await getDataById(ctx.chat.id);
    if (userData.mobileReady) {
        userData.request.mobileNumber = ctx.message.text;
        userData.mobileReady = false;
        let options = {};
        if (userData.request.action === 'buyData') {
            switch (userData.request.network) {
                case 'MTN':
                    options = mtnOptions;
                    break;
                case 'AIRTEL':
                    options = airtelOptions;
                    break;
                case '9MOBILE':
                    options = nineMobileOptions;
                    break;
                case 'GLO':
                    options = gloOptions;
                    break;
                default:
                    options = {};
            }  
            bot.telegram.sendMessage(ctx.chat.id, `${userData.request.network} DATA OFFERS`, options);
            
        } else if (userData.request.action === 'buyAirtime') {
            //get amount
            bot.telegram.sendMessage(ctx.chat.id, `${userData.request.network} Not Ready`, options);
        }
        await updateData(ctx.chat.id, userData);

    }

});


bot.action('email', async ctx => {
    userData = await getDataById(ctx.chat.id);
    userData.emailReady = true;
    bot.telegram.sendMessage(ctx.chat.id, 'Send the email address', {});
    await updateData(ctx.chat.id, userData);
});


bot.command('email', async ctx => {
    userData = await getDataById(ctx.chat.id);
    userData.emailReady = true;
    bot.telegram.sendMessage(ctx.chat.id, 'Send the email address', {});
    await updateData(ctx.chat.id, userData);
});


bot.action('refund', async ctx => {
    userData = await getDataById(ctx.chat.id);
    if (!userData.payment.refundStatus || userData.payment.refund) {
        userData.payment.refundReference = userData.payment.transactionId        
        userData.payment.refund = true;
        const params = JSON.stringify({
            "transaction": userData.payment.refundReference,
            "metadata": {
                "user": userData.user
            }
    
          })
          
          const options = {
            hostname: 'api.paystack.co',
            port: 443,
            path: '/refund',
            method: 'POST',
            headers: {
              Authorization: 'Bearer ' + PAYSTACK_SECRET_KEY,
              'Content-Type': 'application/json'
            }
          }
          
          const req = https.request(options, res => {
            let data = ''
          
            res.on('data', (chunk) => {
              data += chunk
            });
          
            res.on('end', async () => {
              console.log(JSON.parse(data));
              const responseData = JSON.parse(data);
              
              if (responseData.status) {
                    bot.telegram.sendMessage(ctx.chat.id, responseData.message, {});
                     userData.payment.refundStatus = 'PENDING';
                     userData.payment.refund = false;
                  
              } else {
                     bot.telegram.sendMessage(ctx.chat.id, 'Failed to initiate refund.', {});
                     userData.payment.refundStatus = 'FAILED';
                     if (admin) {
                        bot.telegram.sendMessage(admin, `An error occurred!\nRefund processing failed.\nUSER INFO:\n\n${JSON.stringify(userData)}`, {});
                    }
                  
                  //ALERT ADMIN
              }
              await updateData(ctx.chat.id, userData);

            })
          }).on('error', error => {
            console.error(error)
          })
          
          req.write(params)
          req.end()
    }
    await updateData(ctx.chat.id, userData);
});


bot.action('buyAgain', async ctx => {
    userData = await getDataById(ctx.chat.id);
    if(userData.failed) {
        const data = {
            "network":use_id(userData.failed.network),
            "mobile_number": userData.failed.mobileNumber,
            "plan": parseInt(userData.failed.plan),
            "Ported_number":true
        };
        const response = await postData(data_api,data, Ogieheaders)
        if (response) {
            const retry = {
                reply_markup: {
                    inline_keyboard: [
                        [{
                            text: "Try Again",
                            callback_data: 'buyAgain'
                        }],
                        [{
                            text: "Refund",
                            callback_data: 'refund'
                        }]
                    ]
                }
            };
            if (response.status === 'successful') {
                bot.telegram.sendMessage(ctx.chat.id, response.api_response, {});
                if (userData.failed) {
                    delete userData[failed];
                }

                thank(userData.id);
            } else if (response.status === "failed") {
                bot.telegram.sendMessage(ctx.chat.id, response.api_response, retry);
                userData.failed = userData.request;
            } else {
                bot.telegram.sendMessage(ctx.chat.id, 'Error!\nFailed Request!', retry);
                userData.failed = userData.request;

                // console.error(response);
                if (response.error && admin) {
                    bot.telegram.sendMessage(admin, `ERROR!\nMESSAGE: ${response.error[0]}\nFROM: ${JSON.stringify(userData.user)}`, {});
                }

            }
            await updateData(ctx.chat.id, userData);
        }  
    }
    await updateData(ctx.chat.id, userData);
});


bot.command('login', async ctx => {
    userData = await getDataById(ctx.chat.id);
    if (userData.user.first_name === 'Attahiru') {
        bot.hears('61250', ctx => {
            userData.is_admin = true;
            admin = ctx.chat.id;   
            bot.telegram.sendMessage(ctx.chat.id, `Admin Login successful as ${userData.user.first_name} ${userData.user.last_name}` , {});
        })

    }
    
    await updateData(ctx.chat.id, userData);
});

''.toLowerCase()

bot.hears(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/, async (ctx) => {
    userData = await getDataById(ctx.chat.id);
    if (userData.emailReady) {
        userData.user.email = ctx.message.text.toLowerCase();
        userData.emailReady = false;
        await updateData(ctx.chat.id, userData);
        ctx.reply(`Email address successfully updated with: ${userData.user.email.toLowerCase()}`);
        await delay(1500);
        if (userData.request.plan) {
            bot.telegram.sendMessage(ctx.chat.id, 'Click continue to proceed to checkout',{
                reply_markup: {
                    inline_keyboard: [
                        [{
                            text: "CONTINUE",
                            callback_data: userData.request.plan
                            }]
                    ]
                }
            })
        }
    }
});


bot.command('status', async ctx =>{
    userData = await getDataById(ctx.chat.id);
    if (userData.payment.transactionId){        
        const options = {
        hostname: 'api.paystack.co',
        port: 443,
        path: '/transaction/verify/' + userData.payment.transactionId,
        method: 'GET',
        headers: {
            Authorization: 'Bearer ' + PAYSTACK_SECRET_KEY
        }
        }

        https.request(options, res => {
        let data = ''

        res.on('data', (chunk) => {
            data += chunk
        });

        res.on('end', async () => {
            console.log(JSON.parse(data));
            const responseData = JSON.parse(data);
            if (responseData.status) {
                userData.payment.status = responseData.data.status.toUpperCase();                
                await updateData(ctx.chat.id, userData);
                bot.telegram.sendMessage(ctx.chat.id, `CURRENT STATUS\n\nPayment Status: ${responseData.data.status.toUpperCase()}\nAmount: N${responseData.data.amount/100}\nTransaction: ${userData.request.action}, ${getinfo(userData.request.plan,'data')}\nPaid on: ${datetime(responseData.data.paid_at, 'date')} at ${datetime(responseData.data.paid_at, 'time')}\nMethod: ${responseData.data.channel}`, {});

            } else {
                bot.telegram.sendMessage(ctx.chat.id, 'An error occurred!\nPlease try again later.', {})
                if (admin) {
                    bot.telegram.sendMessage(admin, `An error occurred while trying to process payment for ${ctx.chat.id}\nERROR:\nCode: ${responseData.code}\nMessage: ${responseData.message}\nUser Data: ${JSON.stringify(userData)}`, {});
                }
            }

        })
        }).on('error', error => {
            console.error(error);
            bot.telegram.sendMessage(ctx.chat.id, 'An error occurred!\nPlease try again later.', {})
        })
    }
});

add_service('buyData');
add_service('buyAirtime');
add_service('payElectricityBill');
add_service('payCableBill');

add_network('MTN');
add_network('AIRTEL');
add_network('9MOBLE');
add_network('GLO');

add_cable('GOTV');
add_cable('DSTV');
add_cable('STARTIME');

add_plan('251');
add_plan('252');
add_plan('253');
add_plan('254');
add_plan('255');
add_plan('256');

add_plan('218');
add_plan('219');
add_plan('220');
add_plan('223');
add_plan('229');
add_plan('221');

add_plan('244');
add_plan('245');
add_plan('246');
add_plan('247');
add_plan('248');
add_plan('249');

add_plan('237');
add_plan('238');
add_plan('239');
add_plan('240');
add_plan('241');
add_plan('242');

add_plan('150');
add_plan('224');



//help Message
bot.help(ctx => ctx.reply('COMMANDS\n/start -> To start a new transaction\n/status -> To check the status of your recent payment\n/email -> To set up a notification email address\n/help -> To get help'));

bot.hears(/hi|hello|hey/i, (ctx) => {
    // Send a response
    ctx.reply('Hi there! \nSend /help to get help');
  });

bot.launch()
.then(() => {
  console.log('Bot started');
})
.catch((err) => {
  console.error('Error starting bot', err);
});


const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const port = 3000;
// Define callback URL
const callbackURL = '/notifications';


// Define route to receive notifications
app.post(callbackURL, async (req, res) => {
    // Handle notification here
    // ...
    console.log(req.body);
    if (req.body.event) {
        if(req.body.event === 'charge.success') {
            const chatId = req.body.data.metadata.user.id;
            const userData = await getDataById(chatId);
            const request = req.body.data.metadata.request;
            const userReference = userData.payment.transactionId;

            if (req.body.data.status === "success" && req.body.data.reference === userReference && req.body.data.amount == request.amount) {
                await delay(3000);
                bot.telegram.sendMessage(chatId, `Payment of N${req.body.data.amount/100} for ${getinfo(request.plan, 'data')} ${getinfo(request.plan, 'duration')} recieved Successfully.\nProcessing Request, please wait...`, {});
                await delay(2000);          
                userData.payment.status = 'PAID';
                userData.payment.refund = true;
                switch (request.action) {
                    case 'buyData':
                        const data = {
                            "network":use_id(request.network),
                            "mobile_number": request.mobileNumber,
                            "plan": parseInt(request.plan),
                            "Ported_number":true
                        };
                        const response = await postData(data_api,data, Ogieheaders)
                        if (response) {
                            const retry = {
                                reply_markup: {
                                    inline_keyboard: [
                                        [{
                                            text: "Try Again",
                                            callback_data: 'buyAgain'
                                        }],
                                        [{
                                            text: "Refund",
                                            callback_data: 'refund'
                                        }]
                                    ]
                                }
                            };
                            if (response.status === 'successful') {
                                bot.telegram.sendMessage(chatId, response.api_response, {});
                                if (userData.failed) {
                                    delete userData[failed];
                                }

                                thank(userData.id);
                            } else if (response.status === "failed") {
                                bot.telegram.sendMessage(chatId, response.api_response, retry);
                                userData.failed = userData.request;
                            } else {
                                bot.telegram.sendMessage(chatId, 'Error!\nFailed Request!', retry);
                                userData.failed = userData.request;

                                // console.error(response);
                                if (response.error && admin) {
                                    bot.telegram.sendMessage(admin, `ERROR!\nMESSAGE: ${response.error[0]}\nFROM: ${JSON.stringify(userData.user)}`, {});
                                }

                            }
                            await updateData(chatId, userData);
                        }                        
                        break;
                    case 'buyAirtime':
                        break;
                    case 'payElectricityBill':
                        break;
                    case 'payCableBill':
                        break;
                    default:
                        //something
                }
            } else {
                await delay(3000);
                bot.telegram.sendMessage(chatId, `Payment of N${req.body.data.amount/100} was received.`, {});
                //notify admin
                if (admin) {
                    bot.telegram.sendMessage(admin, `Payment of N${req.body.data.amount/100} was received from ${userData.user.first_name} ${userData.user.last_name} (${userData.user.id})`, {});
                }

            }
            await updateData(chatId, userData);
        } else if (req.body.event === 'refund.processed') {
            const chatId = await getIdFromEmail(req.body.data.customer.email);
            // console.log(chatId);
            const userData = await getDataById(chatId);
            const userReference = userData.payment.refundReference;
            if (req.body.data.transaction_reference === userReference){
                userData.payment.refundStatus = 'SUCCESS';
                userData.payment.refund = false;
                delete userData.failed;
                await delay(1000);
                bot.telegram.sendMessage(chatId, `Refund processed.\nAmount: N${req.body.data.amount/100}`, {})
            }
            await updateData(chatId, userData);


        } else if (req.body.event === 'refund.failed') {
            const chatId = await getIdFromEmail(req.body.data.customer.email);
            const userData = await getDataById(chatId);
            const userReference = userData.payment.transactionId;
            if (req.body.data.transaction_reference === userReference){
                userData.payment.refundStatus = 'FAILED';
                await delay(1000);
                bot.telegram.sendMessage(chatId, `Refund failed.\nAmount: N${req.body.data.amount/100}`, {});
                bot.telegram.sendMessage(chatId, `Please contact us!`, {});
                if (admin) {
                    bot.telegram.sendMessage(admin, `An error occurred!\nRefund processing failed.\nUSER INFO:\n\n${JSON.stringify(userData)}`, {});
                }

            }
            await updateData(chatId, userData);


        }
    }
    res.sendStatus(200); // Send success response
});

// app.use(bot.webhookCallback('/webhook'));
app.set('trust proxy', true);

// Start the server
const server = app.listen(process.env.PORT || port, () => {
    console.log(`Server listening at http://${server.address().address}:${server.address().port}`);
});


// const secretPath = `/`;
// const restApiId = process.env.REST_API_ID;
// const awsRegion = process.env.AWS_REGION;


// //GET request to set up webhook
// app.get("/setwebhook", async (req, res, next) => {
//     // Set telegram webhook
//     const URL = `https://${restApiId}.execute-api.${awsRegion}.amazonaws.com${secretPath}`;
//     let url_for_telegram_api = `https://api.telegram.org/bot${BOT_TOKEN}/setWebHook?url=${URL}`;
//     let result = await bot.telegram.setWebhook(url_for_telegram_api);
//     console.log(["bot.telegram.setWebhook()", url_for_telegram_api]);
  
//     return res.status(200).json({
//       message: "Webhook set: " + JSON.stringify(result),
//     });
//   });


// https://api.telegram.org/bot123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11/setWebhook?url=https://www.example.com/my-telegram-bot

// // Optional: Add more Express routes if needed

// // For local testing (optional)
// // app.listen(3000, () => console.log('Server is running on port 3000'));

// const server = awsServerlessExpress.createServer(app);

// exports.handler = (event, context) => {
//   awsServerlessExpress.proxy(server, event, context);
// };

const shutdown = () => {
    console.log('Recieve stop signal. Strarting graceful shutdown...');
    server.close(async () => {
        // console.log(filestorage);
        filestorage.appRestart = true;
        await gracefulEnd();
        console.log(`Server closed on ${datetime(undefined)}. Exiting processes`);
        
        process.exit(0);
    });
}

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);




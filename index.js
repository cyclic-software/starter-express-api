const TelegramApi = require('node-telegram-bot-api');
const express = require('express');
const bodyParser = require('body-parser');
const Telr = require('./clients/telr');
const moment = require('moment');
const axios = require('axios');
const parseString = require('xml2js').parseString;

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.text({ type: "*/*" }));
const bot = new TelegramApi(process.env.TELEGRAM_BOT_TOKEN, { polling: false });
const telr = new Telr(
  process.env.AUTH_KEY, 
  process.env.STORE_ID, 
  process.env.AUTHORIZATION_TOKEN, 
  process.env.CREATE_QUICKLINK_API,
  process.env.GET_TRANSACTION_API);
const botName = process.env.TELEGRAM_BOT_NAME;
const startCommandReg = RegExp(/\/start/);
const creatQLCommandReg = RegExp(/\b\s\d{1,2}\.\d{1,2}\/[+-]?([0-9]*[.,])?[0-9]+\/[A-zА-я]+/g);
// Endpoints
app.get('/', async (request, response) => {
  response.status(200).send('ECHO');
})

app.post('/', async (request, response) => {
  try {
    if (!request.body.hasOwnProperty('update_id')) {
      return response.sendStatus(200);
    }
  
    const msg = request.body.message;
    console.log('Message: ', msg)
    const chatId = msg.chat.id;
    const chatType = masg.chat.type;
    
    if (startCommandReg.test(msg.text)) {
      await bot.sendMessage(chatId, process.env.START_COMMAND_TEXT);
      return response.sendStatus(200);
    }
  
    if (creatQLCommandReg.test(msg.text)) {
      const data = msg.text.split(' ');
  
      console.log(data);
  
      if (data[0] !== botName && chatType !== 'private') return response.sendStatus(200);
  
      const paymentData = data[1].split('/');
      let [date, amount, name] = paymentData;
      date += '.' + new Date().getFullYear();
  
      if (!moment(date, 'DD.MM.YYYY', true).isValid()) {
        console.log('The entered date is not valid', date);
        await bot.sendMessage(chatId, `Ведённая дата (${date}) не существует. Проверьте правильность даты и повторите попытку снова!`);
      }
  
      // For a negative payment amount
      if (+amount < 0) {
        await bot.sendMessage(chatId, 'Сумма платежа не может быть меньше 0!');
      }
      if (!amount.includes(',')) {
        const qlData = await telr.createQuickLink([date, amount, name]);
        let opts = { 'caption': qlData.url.replace('_', '\\_'), 'parse_mode': 'markdown' }; // The '_' character must be escaped, otherwise there will be an error
        await bot.sendPhoto(chatId, qlData.qrCode, opts);
      }
      else await bot.sendMessage(chatId, `Указанная сумма должна быть разделена точкой, а не запятой (${amount.replace(',', '.')})`);
    }
    return response.sendStatus(200);
  } catch (error) {
    return response.status(200).send(err);
  }
});

app.post('/payment_gate', async (request, response) => {
  if (!request.body) return response.sendStatus(200);
  try {
    console.log('Type: ', typeof request.body);
    console.log('Body: ', request.body);
    const data = request.body.split('&');
    let ref = '';
    data.forEach(el => {
      if (el.startsWith('tran_ref')) {
        ref = el.split('=')[1];
      }
    });

    const transactionInfo = await telr.getTransacionInfo(ref);
    parseString(transactionInfo, async function (err, trc) {
      let id = trc.transaction.id[0];
      let srcDate = moment(trc.transaction.date[0]).utcOffset('+0400');
      let serverDate = srcDate.format('YYYY-MM-DD HH:mm:ss');
      const status = telr.defineTransactionStatus(trc.transaction.auth[0].status[0]);

      await bot.sendMessage(
        process.env.TELEGRAM_GROUP_ID,
        `<b>Информация по платежу:</b>\n<b>ID транзакции:</b> ${id}\n<b>Дата Дубай, ОАЭ:</b> ${serverDate}\n<b>Статус платежа:</b> ${status}`,
        { parse_mode: 'HTML' }
      );
    });
  return response.sendStatus(200);
  }
  catch (error) {
    return response.status(200).send(`Catch error: ${error}`);
  }
})

// Express server logic
app.listen(process.env.EXPRESS_PORT, async () => console.log(`App listening on port ${process.env.EXPRESS_PORT}`))

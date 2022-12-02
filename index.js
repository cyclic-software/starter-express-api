const TelegramApi = require('node-telegram-bot-api');
const express = require('express');
const bodyParser = require('body-parser');
const Telr = require('./clients/telr');
const moment = require('moment');
const { parse } = require('dotenv');
const dotenv = require('dotenv').config().parsed;
const parseString = require('xml2js').parseString;

const _env = process.env.environment ?? 'local';
const configAccess = _env === '_local' ? dotenv : process.env;

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.text({ type: "*/*" }));
const bot = new TelegramApi(configAccess.TELEGRAM_BOT_TOKEN, { polling: false });
const telr = new Telr(
  configAccess.AUTH_KEY, 
  configAccess.STORE_ID, 
  configAccess.AUTHORIZATION_TOKEN, 
  configAccess.CREATE_QUICKLINK_API,
  configAccess.GET_TRANSACTION_API);
const botName = configAccess.TELEGRAM_BOT_NAME;
const startCommandReg = /\/start/;
const createQLCommandReg = /\d{1,2}\.\d{1,2}\/[+-]?([0-9]*[.,])?[0-9]+\/[A-zА-я]+/;
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
    const chatId = msg.chat.id;
    const chatType = msg.chat.type;
    
    if (startCommandReg.test(msg.text)) {
      await bot.sendMessage(chatId, configAccess.START_COMMAND_TEXT);
      return response.sendStatus(200);
    }
  
    if (createQLCommandReg.test(msg.text)) {
      if (!msg.text.includes(botName) && chatType !== 'private') {
        return response.sendStatus(200);
      }

      let data = [];
      if (msg.text.includes(botName)) {
        data = msg.text.slice(botName.length + 1, msg.text.length);
      } else {
        data = msg.text;
      }  
  
      const parsedData = data.split('/');
      let [date, amount, name] = parsedData;
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
    console.log(error);
    return response.status(200).send('Something wrong');
  }
});

app.post('/payment_gate', async (request, response) => {
  if (!request.body) return response.sendStatus(200);
  try {
    const data = request.body.split('&');
    let ref = '';
    data.forEach(el => {
      if (el.startsWith('tran_ref')) {
        ref = el.split('=')[1];
      }
    });

    const transactionInfo = await telr.getTransacionInfo(ref);
    parseString(transactionInfo, async (err, trc) => {
      let id = trc.transaction.id[0];
      let srcDate = moment(trc.transaction.date[0]).utcOffset('+0400');
      let serverDate = srcDate.format('YYYY-MM-DD HH:mm:ss');
      const status = telr.defineTransactionStatus(trc.transaction.auth[0].status[0]);

      await bot.sendMessage(
        configAccess.TELEGRAM_GROUP_ID,
        `<b>Информация по платежу:</b>\n<b>ID транзакции:</b> ${id}\n<b>Дата Дубай, ОАЭ:</b> ${serverDate}\n<b>Статус платежа:</b> ${status}`,
        { parse_mode: 'HTML' }
      );
    });

    return response.sendStatus(200);
  }
  catch (error) {
    console.log(error);
    return response.status(200).send(`Something wrong`);
  }
})

// Express server logic
app.listen(configAccess.EXPRESS_PORT, async () => console.log(`App listening on port ${configAccess.EXPRESS_PORT}`))

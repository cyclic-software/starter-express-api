const TelegramApi = require('node-telegram-bot-api');
const express = require('express');
const bodyParser = require('body-parser');
const Telr = require('./clients/telr');
const moment = require('moment-timezone');
const axios = require('axios');
const parseString = require('xml2js').parseString;

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.text({ type: "*/*" }));
const bot = new TelegramApi(process.env.TELEGRAM_BOT_TOKEN, { polling: false });
const telr = new Telr(process.env.AUTH_KEY, process.env.STORE_ID, process.env.CREATE_QUICKLINK_API);
const botName = process.env.TELEGRAM_BOT_NAME;

// Endpoints
app.get('/', async (request, response) => {
  if (!request.query) return response.sendStatus(400);
  response.send('OK');
})

app.post('/', async (request, response) => {
  if (!request.body.hasOwnProperty('update_id')) {
    return response.sendStatus(200);
  }

  const msg = request.body.message;
  if (/\/start/.test(msg.text)) {
    await bot.sendMessage(msg.chat.id, 'Привет! Я Телеграм бот для генерации qr-кода для оплаты услуг и товаров. Пожалуйста, введите данные в формате "дата(дд.мм)/сумма/имя" для создания ссылки на оплату.');
    return response.sendStatus(200);
  }

  if (RegExp(/\b\s\d{1,2}\.\d{1,2}\/[+-]?([0-9]*[.,])?[0-9]+\/[A-zА-я]+/g).test(msg.text)) {
    const chatId = msg.chat.id;
    const data = msg.text.split(' ');

    console.log(data);

    if (data[0] !== botName) return response.sendStatus(200);

    const paymentData = data[1].split('/');
    let [date, amount, name] = paymentData;
    date += '.' + new Date().getFullYear();

    if (!moment(date, 'DD.MM.YYYY', true).isValid()) {
      console.log('The entered date is not valid', date);
      return await bot.sendMessage(chatId, `Ведённая дата (${date}) не существует. Проверьте правильность даты и повторите попытку снова!`);
    }

    // For a negative payment amount
    if (+amount < 0) {
      return await bot.sendMessage(chatId, 'Сумма платежа не может быть меньше 0!');
    }
    if (amount.includes(',')) {
      return await bot.sendMessage(chatId, `Указанная сумма должна быть разделена точкой, а не запятой (${amount.replace(',', '.')})`);
    }

    let qlData = await telr.createQuickLink([date, amount, name]);
    let opts = { 'caption': qlData.url.replace('_', '\\_'), 'parse_mode': 'markdown' }; // The '_' character must be escaped, otherwise there will be an error
    await bot.sendPhoto(chatId, qlData.qrCode, opts);

    return response.sendStatus(200);
  }
});

app.post('/payment_gate', async (request, response) => {
  if (!request.body) return response.sendStatus(400);
  const data = request.body.split('&');
  let ref = '';
  data.forEach(el => {
    if (el.startsWith('tran_ref')) {
      console.log(el)
      ref = el.split('=')[1];
    }
  });
  const getTranInfo = await axios.get(`https://secure.telr.com/tools/api/xml/transaction/${ref}`, {
    headers: {
      'Authorization': process.env.AUTHORIZATION_TOKEN
    }
  });
  parseString(getTranInfo.data, async function (err, trc) {
    let id = trc.transaction.id[0];
    let srcDate = moment.tz(trc.transaction.date[0], "Asia/Dubai");
    let serverDate = srcDate.format('YYYY-MM-DD HH:mm:ss');
    let status = '';
    switch (trc.transaction.auth[0].status[0]) {
      case 'A':
        status = 'Успешная оплата';
        break;
      case 'H':
        status = 'Оплата в ожидании';
        break;
      case 'E':
        status = 'Ошибка сервера';
        break;
      default:
        status = 'undefined'
        break;
    }

    await bot.sendMessage(process.env.TELEGRAM_GROUP_ID, `<b>Информация по платежу:</b>\n<b>ID транзакции:</b> ${id}\n<b>Дата Дубай, ОАЭ:</b> ${serverDate}\n<b>Статус платежа:</b> ${status}`, { parse_mode: 'HTML' });
  });
})

// Express server logic
app.listen(3000, async () => console.log(`App listening on port ${process.env.EXPRESS_PORT}`))

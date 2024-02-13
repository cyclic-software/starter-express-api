const template = require('../constant/template')
const { MAILGUN_API_KEY, MAILGUN_DOMAIN, MAILGUN_SENDER } = require('../constant/keys');
const Mailgun = require('mailgun-js');

class MailgunService {
    init() {
        try {
            return new Mailgun({
                apiKey: MAILGUN_API_KEY,
                domain: MAILGUN_DOMAIN
            })
        } catch (error) {
            console.warn('missing mailgun keys');
        }
    }
}

const mailgun = new MailgunService().init()

exports.sendEmail = async (email, type, host, data) => {
    try {
        const message = prepareTemplate(type, host, data)
        const config = {
            from: MAILGUN_SENDER,
            to: email,
            subject: message.subject,
            text: message.text
        }
        return await mailgun.messages().send(config)
    } catch (error) {
        return error
    }
}

const prepareTemplate = (type, host, data) => {
    let message;
    switch (type) {
        case 'forgotPassword':
            message = template.forgotPassword(host, data)
            break;
        default:
            message = ''
    }
    return message
}
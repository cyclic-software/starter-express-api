exports.resetEmail = (host, resetToken) => {
    const message = {
        subject: 'Reset Password',
        text:
            `${'You are receiving this because you have requested to reset your password for your account.\n\n' +
            'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
            'http://'
            }${host}/reset-password/${resetToken}\n\n` +
            `If you did not request this, please ignore this email and your password will remain unchanged.\n`
    }
    return message
}

exports.confirmResetPasswordEmail = () => {
    const message = {
        subject: 'Password Changed',
        text:
            `You are receiving this email because you changed your password. \n\n` +
            `If you did not request this change, please contact us immediately.`
    };

    return message;
};

exports.signupEmail = name => {
    const message = {
        subject: 'Account Registration',
        text: `Hi ${name.firstName} ${name.lastName}! Thank you for creating an account with us!.`
    };

    return message;
};

exports.forgotPassword = (host, otp) => {
    const message = {
        subject: 'Forgot Password',
        text:
            `You are receiving this because you have requested to get otp for your password of your account.\n\n ` +
            `Please click on the following link, or paste this into your browser to complete the process:\n\n ` +
            `Your one time password is ${otp}\n\n`
    };
    return message
}
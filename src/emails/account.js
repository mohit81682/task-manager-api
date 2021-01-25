const sgMail = require('@sendgrid/mail');
const sendGridApiKey = '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';

sgMail.setApiKey(sendGridApiKey);

const sendWelcomeEmail = async (email, name) => {
    try{
        await sgMail.send({
            to: '1234aggarwalmohit@gmail.com',
            from: 'mohit81682@gmail.com',
            subject: 'Welcome Email',
            text: `Hi ${name} Welcome and thanks for joining our website`
        });
    } catch(error){
        console.log(error.response.body);
    }

}

const sendCancellationEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'mohit81682@gmail.com',
        subject: 'Cancellation Email',
        text: `Hi ${name} We hope you will join again our website`
    });
}

module.exports = {
    sendWelcomeEmail,
    sendCancellationEmail
}

const mailgun=require('mailgun-js');

async function sendMail(who,subject,html){
    const Domain= 'habere.fr';
    const mg= mailgun({apiKey:process.env.API_KEY, domain:Domain,host:'api.eu.mailgun.net'});


    const data= {
        from: 'habere@gmail.com',
        to:who,
        subject: subject,
       html:html,

   };

    await mg.messages().send(data);




}

exports.sendMail=sendMail;
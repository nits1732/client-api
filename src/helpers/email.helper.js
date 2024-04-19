const nodemailer = require("nodemailer");
const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
        user: 'gisselle.robel@ethereal.email',
        pass: 'vYttktw2CaW3b44EqF'
    }
});

const send=(info)=>{
    return new Promise(async(resolve,reject)=>{
        try{
            let result = await transporter.sendMail(info);
    
            console.log("Message sent: %s", result.messageId);
            // Message sent: <d786aa62-4e0a-070a-47ed-0b0666549519@ethereal.email>
            resolve(result)
        }catch(error){
            console.log(error)
        }
    })   
}

const emailProcesser =({email, pin,type})=>{
    let info='';
    switch(type){
        case 'request-new-password':
            info={
                from: '"CRM Company" <gisselle.robel@ethereal.email>', // sender address
                to: email, // list of receivers
                subject: "Password Reset Pin", // Subject line
                text: "Your Reset Pin is " + pin +"This pin will expire in 1 day", // plain text body
                html: `<b>Hello</b><br>
                Here is your pin
                <b>${pin}</b>
                This pin will expire in 1 day
                <p>Ignore this email if you did not request a password reset</p>` // html body
            }
            send(info)
            break;
        case 'update-password-success':
            info = {
                from: '"CRM Company" <gisselle.robel@ethereal.email>', // sender address
                to: email, // list of receivers
                subject: "Password Updated Successfully", // Subject line
                text: "Your password has been updated successfully.", // plain text body
                html: `<b>Hello</b><br>
                Your password has been updated successfully.
                <p>Ignore this email if you did not request a password reset</p>` // html body
            }
            send(info)
            break            
        default:
            
    }
    
      
}
module.exports={emailProcesser};
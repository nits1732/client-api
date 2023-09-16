const bcrypt = require('bcrypt');
const saltRounds = 10;

const hashPassword= plainPassword =>{
    return new Promise((resolve, reject) => {
        resolve(bcrypt.hashSync(plainPassword, saltRounds))
})
}
const comparePassword= (plainPass,passfromDb)=>{
    return new Promise ((resolve ,reject)=> {
        bcrypt.compare(plainPass, passfromDb, function(err, result) {
            if(err)reject(err);
            resolve(result);
        });
    })
}
module.exports={
    hashPassword,comparePassword
}
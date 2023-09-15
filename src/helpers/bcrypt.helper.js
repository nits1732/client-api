const bcrypt = require('bcrypt');
const saltRounds = 10;

const hashPassword= plainPassword =>{
    return new Promise((resolve, reject) => {
        resolve(bcrypt.hashSync(plainPassword, saltRounds))
})
}

module.exports={
    hashPassword,
}
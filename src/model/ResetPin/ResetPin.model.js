const {token} = require("morgan"); 
const { ResetPinSchema } = require("./ResetPin.schema");
const randomGenerator = require("../../utils/randomGenerator");

const setPasswordResetPin=async (email)=>{
    //return 6 digit pin
    const randPin= await randomGenerator(6)
    const resetObj={
        email:email,
        pin:randPin,
    }
    return new Promise((resolve,reject)=>{
        ResetPinSchema(resetObj).save()
        .then((data)=>resolve(data))
        .catch((error)=>reject(error));
    })
}

// const getPinByEmailPin= (email,pin)=>{
//     return new Promise((resolve,reject)=>{
//         try{
//             ResetPinSchema.findOne({email,pin}, (error,data)=>{
//                 if(error){
//                     console.log(error);
//                     resolve(false);
//                 }
//                 resolve(data)
//             });
//         }catch(error){
//             reject(error);
//             console.log(error);
//         }
//     })
// }
const getPinByEmailPin = async (email, pin) => {
    try {
        const data = await ResetPinSchema.findOne({email, pin});
        return data;
    } catch(error) {
        console.log(error);
        return false;
    }
}
const deletePin = async (email, pin) => {
    try {
        const data = await ResetPinSchema.findOneAndDelete({email, pin});
    } catch(error) {
        console.log(error);
    }
}

module.exports={
    setPasswordResetPin,
    getPinByEmailPin,
    deletePin
}
// const UserSchema = require('./UserSchema'); // Make sure this path is correct and the schema is properly imported

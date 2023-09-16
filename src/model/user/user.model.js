const {UserSchema} =require("./User.schema")

const insertUser=(userObj)=>{
    return new Promise((resolve,reject)=>{
        UserSchema(userObj).save()
        .then((data)=>resolve(data))
        .catch((error)=>reject(error));
    })
}

// const getUserByEmail= async email =>{
//     return new Promise((resolve,reject)=>{
//         if(!email)return false
//         try{
//             UserSchema.findOne({email},(error,data)=>{
//                 if (error){
//                     reject(error)
//                 }
//                 resolve(data)
//             })
//         }catch(error){
//             reject(error)
//         }
//     })
// }
const getUserByEmail = async (email) => {
    if (!email) {
        return null; // Return null instead of false for better handling of missing email
    }

    try {
        const user = await UserSchema.findOne({ email });
        return user; // This will return the user object if found, or null if not found
    } catch (error) {
        throw error; // Throw the error for handling in the calling code
    }
};

module.exports=(
    {insertUser,getUserByEmail}
)
const {UserSchema} =require("./User.schema")

const insertUser=(userObj)=>{
    return new Promise((resolve,reject)=>{
        UserSchema(userObj).save()
        .then((data)=>resolve(data))
        .catch((error)=>reject(error));
    })
}

// const UserSchema = require('./UserSchema'); // Make sure this path is correct and the schema is properly imported

const getUserByEmail = async (email) => {
  if (!email) return null; // Handle cases where no email is provided

  try {
    const user = await UserSchema.findOne({ email });
    return user;
  } catch (error) {
    console.error('Error fetching user by email:', error);
    throw error; // Rethrow the error to be handled by the caller
  }
};

// const getUserByEmail = async (email) => {
//     if (!email) {
//         return null; // Return null instead of false for better handling of missing email
//     }

//     try {
//         const user = await UserSchema.findOne({ email });
//         return user; // This will return the user object if found, or null if not found
//     } catch (error) {
//         throw error; // Throw the error for handling in the calling code
//     }
// };
const storeUserRefreshJWT=(_id, token)=>{
    return new Promise((resolve, reject)=>{
        try {
            UserSchema.findOneAndUpdate(
                {_id},
                {
                $set:{"refreshJWT.token":token, "refreshJWT.addedAt":Date.now()}
            },
            {new:true}
            )
            .then ((data)=>resolve(data))
            .catch((error)=>{
                console.log(error)
                reject(error)
            });
        } catch (error) {
            console.log(error)
            reject(error)
        }
    })
}
const getUserById=async (_id)=>{
    if (!_id) {
        return null; // Return null instead of false for better handling of missing email
    }

    try {
        const user = await UserSchema.findOne({ _id });
        return user; // This will return the user object if found, or null if not found
    } catch (error) {
        throw error; // Throw the error for handling in the calling code
    }
}
const updatePassword=(email,newhasedPass)=>{
    return new Promise((resolve, reject)=>{
        try {
            UserSchema.findOneAndUpdate(
                {email},
                {
                $set:{"password":newhasedPass}
            },
            {new:true}
            )
            .then ((data)=>resolve(data))
            .catch((error)=>{
                console.log(error)
                reject(error)
            });
        } catch (error) {
            console.log(error)
            reject(error)
        }
    })
}
module.exports=(
    {insertUser,getUserByEmail,storeUserRefreshJWT,getUserById
    ,updatePassword}
)
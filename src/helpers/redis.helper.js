const redis= require("redis");
const client= redis.createClient(process.env.REDIS_URL);
//redis://localhost:6379
client.on("error", function(error) {
    console.error(error);
  });
   
const setJWT=(key, value)=>{
    console.log(typeof key, typeof value)
    return new Promise((resolve, reject)=>{
        try{
            client.set(key ,value, (err, res)=>{
                if(err) reject(err)
                resolve(res)
            });
        }catch(error){
            reject(error)
        }
        
    })
}   
const getJWT=(key)=>{
    console.log(key);
    return new Promise((resolve, reject)=>{
        try{
            client.get(key, (error, response)=>{
                if(error) reject(error)
                resolve(response)
            });
        }catch(error){
            reject(error)
        }
        
    })
}
const deleteJWT = key =>{
    try{
        client.del(key)
    }catch(error){
        console.log(error)
    }
}
module.exports={
    setJWT, getJWT , deleteJWT,
}
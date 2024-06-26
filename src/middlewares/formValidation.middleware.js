const Joi = require('joi');
const email= Joi.string()
.email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } })

const pin= Joi.string().min(6).max(6).required()


const shortString=Joi.string().min(2).max(50)
const longString=Joi.string().min(2).max(200)

const newPassword= Joi.string().alphanum()
.min(3)
.max(30)
.required()

const resetPassReqValidation =(req,res,next)=>{
    const schema=Joi.object({email})
    const value=schema.validate(req.body);
    if(value.error){
        return res.json({status:"error", message:value.error.message});
    }
  next() ;
}
const updatePassValidation =(req,res,next)=>{
    const schema=Joi.object({email,pin,newPassword})
    const value=schema.validate(req.body);
    if(value.error){
        return res.json({status:"error", message:value.error.message});
    }
  next() ;
}

const createNewTicketValidation=(req,res,next)=>{
  const schema=Joi.object({
    subject:shortString,
    sender:shortString,
    message:longString.required()
  })
  const value=schema.validate(req.body);
  if(value.error){
    return res.json({status:"error",message:value.error.message})
  }
  next()
}

const replyTicketValidation=(req,res,next)=>{
  const schema=Joi.object({
    message:longString.required(),
    sender:shortString.required(),
  })
  const value=schema.validate(req.body);
  if(value.error){
    return res.json({status:"error",message:value.error.message})
  }
  next()
}
module.exports={resetPassReqValidation, 
    updatePassValidation,createNewTicketValidation,replyTicketValidation};
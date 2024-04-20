// Workflow of making routes for ticket
// Create url endpoint
// recieve new ticket
// authorize every request with jwt
// insert in mongodb
// retrive all the ticket from the specific user
// update a ticket from mongodb
// update message conversation in the ticket database
// update ticket satus
// delete ticket from mongodb

const express=require("express");
const { insertTicket } = require("../model/ticket/Ticket.model");
const router=express.Router()


router.all("/",(req, res,next)=>{
    // res.json({message:"Return from Ticket Router"})
    next();
})

router.post("/",async(req,res)=>{
    try{
        const {subject, sender , message}= req.body;
        const ticketObj={
            clientId:"6620df607aa4595c9db6ed65",
            subject,
            conversations:[
                {
                    sender,
                    message
                }
            ]
        }
    
        const result= await insertTicket(ticketObj);
        if(result._id){
            return res.json({status:"success",message:"New Ticket has been created"})
        }
        // console.log(req.body);
         res.json({status:"error",message:"Unable to create ticket. Please try again later."})
    }catch(error){
        res.json({status:"error",message:error.message})

    }
    
});
module.exports=router;


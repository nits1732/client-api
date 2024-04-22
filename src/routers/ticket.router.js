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
const { insertTicket, getTickets, getTicketById , updateClientReply, updateStatusClose, deleteTicket} = require("../model/ticket/Ticket.model");
const { userAuthorization } = require("../middlewares/authorization.middlewares");
const { createNewTicketValidation, replyTicketValidation } = require("../middlewares/formValidation.middleware");
const router=express.Router()


router.all("/",(req, res,next)=>{
    // res.json({message:"Return from Ticket Router"})
    next();
})

router.post("/",createNewTicketValidation, userAuthorization, async(req,res)=>{
    try{
        const {subject, sender , message}= req.body;
        const user= req.userId
        const ticketObj={
            clientId:user,
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

// Get all tickets of a specific user
router.get("/", userAuthorization, async(req,res)=>{
    try{
        const userId= req.userId
        const result= await getTickets(userId);
        console.log(result);
        return res.json({status:"success",result})
        
    }catch(error){
        res.json({status:"error",message:error.message})
    }
});
// get ticket for a specific id
router.get("/:_id", userAuthorization, async(req,res)=>{
    console.log(req.params)
    try{
        const {_id}= req.params
        const userId= req.userId
        const result= await getTicketById(_id,userId);
        console.log(result);
        return res.json({status:"success",result})
        
    }catch(error){
        res.json({status:"error",message:error.message})
    }
});
// reply to a ticket
router.put("/:_id",replyTicketValidation, userAuthorization, async(req,res)=>{
    try{
        const {message,sender}= req.body
        const {_id}= req.params
        const userId= req.userId
        const result= await updateClientReply({_id,message,sender});
        console.log(result);
        if(result._id){
            return res.json({status:"success",message:"Your Message Has Been Updated"})
        }
        res.json({
            status:"error",
            message:"Unable to update your message. Please try again later."
        })
        
    }catch(error){
        res.json({status:"error",message:error.message})
    }
});
// Change the status of the ticket
router.patch("/close-ticket/:_id", userAuthorization, async(req,res)=>{
    try{
        const {_id}= req.params
        const clientId= req.userId
        const result= await updateStatusClose({_id,clientId});
        // console.log(result);
        if(result._id){
            return res.json({status:"success",
            message:"The ticket has been closed"})
        }
        res.json({
            status:"error",
            message:"Unable to delete the ticket. Please try again later."
        })
        
    }catch(error){
        res.json({status:"error",message:error.message})
    }
});

// delete a ticket
router.delete("/close-ticket/:_id", userAuthorization, async(req,res)=>{
    try{
        const {_id}= req.params
        const clientId= req.userId
        const result= await deleteTicket({_id,clientId});
        console.log(result);
        return res.json({status:"success",
        message:"The ticket has been deleted"})
        
    }catch(error){
        res.json({status:"error",message:error.message})
    }
});
module.exports=router;


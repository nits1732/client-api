require('dotenv').config()
const express =require("express")
const app=express()
const bodyParser = require("body-parser")
const cors= require("cors")
const helmet=require("helmet")
const morgan=require("morgan")
const port=process.env.PORT || 3001

//Api security
// app.use(helmet())
//cors
app.use(cors())

//mongoDB connection setup
const mongoose=require('mongoose')
// mongoose.connect(process.env.MONGO_URL,{
//     useNewUrlParser:true,
//     useUnifiedTopology:true,
//     useFindAndModify:false,
//     useCreateIndex:true
// });
mongoose.connect(process.env.MONGO_URL)
if(process.env.NODE_ENV!=='production'){
    
    mongoose.connection.on("open",()=>{
        console.log(`Connected to MongoDB at ${process.env.MONGO_URL}`)
    })
    mongoose.connection.on("error",(error)=>{
        console.log(error)
    })
    //morgan
    app.use(morgan("tiny"));    
}

//body parser
app.use(bodyParser.urlencoded({extended:true}))
app.use(bodyParser.json());
//Load Router
const userRouter=require("./src/routers/user.router")
const ticketRouter=require("./src/routers/ticket.router")
const tokensRouter=require("./src/routers/tokens.router")


//use router
app.use("/v1/user",userRouter);
app.use("/v1/ticket",ticketRouter);
app.use("/v1/tokens",tokensRouter);

// is is a middleware that execute during the app lifecycle handle reqest and response
//handle error
const handleError=require("./src/utils/errorHandle")
app.use((req,res,next)=>{
    const error=new Error("Resource not Found!")
    error.status="404"
    // res.json({message:"Resource is not found"})
    next(error)
})
app.use((error,req,res,next)=>{
    handleError(error,res)
})

app.listen(port, ()=>{
    console.log(`Api is Ready on http://localhost:${port}`)
})
//postman is a tool with is make a http request to your api
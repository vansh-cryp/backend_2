//require('dotenv').config({path: "./env"});
import connectDB from "./db/db.js";
import dotenv from "dotenv"
//second aproach make the code in another file and use here
connectDB();

dotenv.config({
    path:'./env'
})












/*
//first approach to connect to database is to add all code to index file
import express from "express";
const app = express();
// this imediately calls the function
;(async ()=>{
    try {
        await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
        app.on("error",(error)=>{
            console.log("ERROR:",error)
            throw error
        })

        app.listen(process.env.PORT,()=>{
            console.log(`App is listening ${process.env.PORT}`)
        })
    } catch (error) {
        console.error("ERROR :",error)
        throw error
    }
})()
*/
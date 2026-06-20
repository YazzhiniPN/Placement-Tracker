require("dotenv").config()

const express = require("express");
const cookieParser = require("cookie-parser");

const connectDB = require("./config/db");

const app = express();


app.use(express.json());
app.use(cookieParser());

connectDB();

app.get("/", (req,res)=>{
    res.send("Placement Tracker");
})

const PORT = process.env.PORT || 5000;

app.listen(PORT, ()=>{
    console.log(`Server starting running at ${PORT}`);
})
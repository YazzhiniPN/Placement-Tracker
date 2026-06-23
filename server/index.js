require("dotenv").config()

const express = require("express");
const cookieParser = require("cookie-parser");

const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const applicationRoutes = require("./routes/applicationRoutes");
const experienceRoutes = require("./routes/experienceRoutes");

const app = express();


app.use(express.json());
app.use(cookieParser());

connectDB();

app.get("/", (req,res)=>{
    res.send("Placement Tracker");
})

app.use("/api/auth", authRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/experiences", experienceRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, ()=>{
    console.log(`Server starting running at ${PORT}`);
})
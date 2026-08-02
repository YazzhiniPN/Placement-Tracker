require("dotenv").config()

const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const applicationRoutes = require("./routes/applicationRoutes");
const experienceRoutes = require("./routes/experienceRoutes");
const statsRoutes = require("./routes/statsRoutes");

const app = express();

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

connectDB();

app.get("/", (req,res)=>{
    res.send("Placement Tracker");
})

app.use("/api/auth", authRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/experiences", experienceRoutes);
app.use("/api/stats", statsRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, ()=>{
    console.log(`Server starting running at ${PORT}`);
})
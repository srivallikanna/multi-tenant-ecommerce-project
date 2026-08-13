import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";

dotenv.config();

const app = express();

connectDB();

const PORT = process.env.PORT || 5000;

app.get("/", (req, res) => {
    res.send("API is running");
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
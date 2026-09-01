import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import connectDB from "./config/db.js";
import authroutes from "./routes/authroutes.js";

dotenv.config();

const app = express();

// Security middleware
app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors());
app.use(express.json());
app.use('/api/auth', authroutes);

connectDB();

const PORT = process.env.PORT || 5000;

app.get("/", (req, res) => {
    res.send("API is running");
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

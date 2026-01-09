import express from "express";
import http from "http";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db";
import { error } from "console";
import authRoute from "./routes/authRoute";

dotenv.config(); // Load environment variables from .env file

const app = express();
const PORT = process.env.PORT || 3000;
const server = http.createServer(app);

// basic env checks
if (!process.env.JWT_SECRET) {
  console.warn("Warning: JWT_SECRET is not set. Token operations will fail.");
}

//middleware
app.use(express.json()); //middleware to parse JSON body
app.use(cors());

//public routes
app.use("/auth", authRoute);

app.get("/", (req, res) => {
  res.send("Server is running");
});

connectDB()
  .then(() => {
    console.log("Database connected");
    server.listen(PORT, () => {
      console.log(`Server is running on PORT: ${PORT}`);
    });
  })
  .catch((error) => {
    console.log(
      "Failed to start server due to database connection error:",
      error
    );
  });


const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const authRoutes = require("./src/routes/authRoutes");
const linkRoutes = require("./src/routes/linkRoutes");


dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);

app.use("/api/links", linkRoutes);
app.listen(process.env.PORT, () => {
  console.log("Server running");
});
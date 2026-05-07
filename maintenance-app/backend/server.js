const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

require("dotenv").config();

const app = express();

const server = http.createServer(app);

/* ================= SOCKET ================= */

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

/* ================= MIDDLEWARE ================= */

app.use(cors());

app.use(express.json());

/* ================= STATIC UPLOADS ================= */

/*
VERY IMPORTANT

This makes uploaded images accessible publicly.

Without this:
- images won't appear in PDF
- Render deployment fails for images
*/

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

/* ================= MONGODB ================= */

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB Connected");
  })
  .catch((err) => {
    console.log("MongoDB Error:", err);
  });

/* ================= SOCKET CONNECTION ================= */

io.on("connection", (socket) => {
  console.log("User Connected");
});

/* ================= ROUTES ================= */

app.get("/", (req, res) => {
  res.send("API Running Successfully");
});

const reportRoutes = require("./routes/reportRoutes");

app.use("/api/reports", reportRoutes);

/* ================= PORT ================= */

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

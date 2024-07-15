const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const bcrypt = require("bcrypt");
const { usermodel } = require("./models/user");
require("dotenv").config();

const app = express();

// To do not show cors error
app.use(
  cors({
    origin: "https://localhost:3000",
    methods: ["GET", "POST", "DELETE"],
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

// app.use("/api/train")

app.get("/get", (req, res) => {
  res.send("hello world");
});

// REGISTER USER->
app.post("/register", async (req, res) => {
  const { name, email, password, role } = req.body;

  bcrypt.hash(password, 4, async function (err, hash) {
    await usermodel.create({
      name: name,
      email: email,
      password: hash,
      role: role,
    });
    res.send("user created successfully");
  });  
});

const port = 8080;

app.listen(port, () => {
  console.log(`server is running at localhost ${port}`);
});

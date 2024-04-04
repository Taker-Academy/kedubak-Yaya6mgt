const express = require("express");
const port = 8080;
const app = express();
const dotenv = require('dotenv').config();
const connectDB = require("./config/db");

connectDB();
app.use(express.json());
app.use(express.urlencoded({extended: false}));

app.use("/post", require("./routes/route_post"));

app.use("/auth", require("./routes/route_auth"));

/* LANCEMENT SERVEUR */
app.listen(port, () => console.log("Server in port " +  port + " is OK !"));

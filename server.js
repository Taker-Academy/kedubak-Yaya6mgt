const express = require("express");
const port = 8080;
const app = express();
const cors = require('cors');
const dotenv = require('dotenv').config();
const connectDB = require("./config/db");
const { initCollection } = require("./functionUtil/initCollection");

connectDB();

initCollection();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: false}));

app.use("/post", require("./routes/route_post"));

app.use("/auth", require("./routes/route_auth"));

/* LANCEMENT SERVEUR */
app.listen(port, () => console.log("Server in port " +  port + " is OK !"));

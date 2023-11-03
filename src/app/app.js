const express = require("express");
const morgan = require("morgan");
const path = require("path"); // Importa el módulo 'path'
const cors = require('cors');


const router = require("../router/product.router")
const userRouter = require('../router/user.router');
const purchaseRouter = require('../router/purchase.router');

const app = express();

app.use(cors());

app.use(morgan("dev"))

app.use(express.json())
app.use("/api/v1", router);
app.use("/api/v1", userRouter);
app.use("/api/v1", purchaseRouter);

app.get("/", (req, res) => {
    res.send("This is Express");
});

module.exports = app;

const express = require("express");
const routerPaypal = require('./routes/paypal')
const { PORT } = require('./config')
const app = express();
const path = require('path')

app.use(routerPaypal);

app.use(express.static(path.resolve('src/public')))

app.listen(PORT);
console.log(`Escuchando en el puerto ${PORT}`);
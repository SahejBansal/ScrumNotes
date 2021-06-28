const express = require ('express');
const app = express();
require('dotenv').config();
const port = process.env.PORT ;
require('./src/bootstrap');

require('./src/router')(app);

console.log(port);

app.listen(port, () => { console.log(`listen to port ` + port) });
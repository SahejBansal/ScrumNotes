const express = require ('express');
const app = express();
require('dotenv').config();
const port = process.env.PORT ;
require('./src/bootstrap');
const bodyParser = require('body-parser');
app.use(bodyParser.json());
require('./src/config/mysql')(app);

require('./src/router')(app);

console.log(port);

app.listen(port, () => { console.log(`listen to port ` + port) });
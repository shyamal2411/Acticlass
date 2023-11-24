const express = require('express');
const httpStatus = require('http-status');
require('dotenv').config();
require('./src/database/index'); // Database connection

const http = require("http");
const socketManager = require('./src/services/socket/socketManager');
const app = express()

app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.get('/', (req, res) => {
    res.send('Hello World!')
})
app.use('/', require('./src/routes/index'));

app.use((req, res) => { return res.status(httpStatus.NOT_FOUND).send({ message: 'The request route does not exist or the method might be different.' }) });


const server = http.createServer(app);
server.listen(process.env.PORT, () => {
    console.log(`App listening on port http://localhost:${process.env.PORT}`)
})

socketManager.init(server); // Socket.io connection

module.exports = app;
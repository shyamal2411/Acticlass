const express = require('express');
const httpStatus = require('http-status');
const app = express()
require('dotenv').config();
require('./src/database/index'); // Database connection


app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.get('/', (req, res) => {
    res.send('Hello World!')
})
app.use('/', require('./src/routes/index'));

app.use((req, res) => { return res.status(httpStatus.NOT_FOUND).send({ message: 'The request route does not exist or the method might be different.' }) });

app.listen(process.env.PORT, () => {
    console.log(`App listening on port http://localhost:${process.env.PORT}`)
})
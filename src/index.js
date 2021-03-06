const express = require('express');
const mongoose = require('mongoose');
const routes = require('./Route');
const cronService = require('./service/cronService');
const errorHandler = require('./utils/errorhandler');
require('dotenv').config();

const app = express();

const isProd = process.env.NODE_ENV === 'production';

const MONGODB_URL = isProd
    ? process.env.MONGODB_URL
    : process.env.MONGODB_URL_LOCAL;

mongoose.connect(MONGODB_URL, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

app.get('/', (req, res) => {
    res.send('COVID19 API FOR NIGERIA');
});

app.use('/api', routes);

app.all('*', (req, res) => {
    res.send('I think you are lost');
});

mongoose.connection.once('open', () => {
    console.log('mongodb connected');
});

cronService.startCronJobs();

app.use((req, res, next) => {
    const err = new Error();
    err.message = 'Not found';
    err.name = 'notfound';
    err.statusCode = 404;
    next(err);
});

app.use(errorHandler);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log('app live');
});

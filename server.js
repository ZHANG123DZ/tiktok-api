require('module-alias/register');
require('dotenv').config();
const express = require('express');

const router = require('@/routes/api');
const cors = require('cors');

const cookieParser = require('cookie-parser');
const notFoundHandler = require('@/middlewares/notFoundHandler');
const errorsHandler = require('@/middlewares/errorHandler');
const handlePagination = require('@/middlewares/handlePagination');
const pusher = require('@/configs/pusher');

const app = express();

//Middleware
app.use(cookieParser());
app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded());

app.use(handlePagination);

app.use('/send-message', (req, res) => {
  pusher.trigger('k12', 'new-message', {
    user: 'alice',
    text: 'Hello world!',
  });
});

app.use('/api/v2', router);

//Error Handler
app.use(notFoundHandler);
app.use(errorsHandler);

app.listen(3000, () => {
  console.log('hello');
});

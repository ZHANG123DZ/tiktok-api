require('module-alias/register');
require('dotenv').config();
const express = require('express');

const router = require('@/routes/api');
const cors = require('cors');
const { RtcTokenBuilder, RtcRole } = require('agora-access-token');

const notFoundHandler = require('@/middlewares/notFoundHandler');
const errorsHandler = require('@/middlewares/errorHandler');
const handlePagination = require('@/middlewares/handlePagination');
const allowedOrigins = process.env.CLIENT_URL.split(',');
const cookieParser = require('cookie-parser');
const auth = require('@/middlewares/auth');
const { searchAll } = require('@/services/search.service');
const app = express();

//Middleware
app.use(cookieParser());
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      } else {
        return callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
  })
);

app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded());
app.use(handlePagination);

app.use(auth);
//Demo Live
// const APP_CERTIFICATE = 'fc7b5d7c181b45bd87ac0eb34549a0cf';
// const APP_ID = '550080bc4a99461fb9cd04b59bfe2324';

// app.get('/token', (req, res) => {
//   const channelName = req.query.channel;
//   if (!channelName)
//     return res.status(400).json({ error: 'Channel name required' });

//   const uid = req.query.uid || 0;
//   const role =
//     req.query.role === 'host' ? RtcRole.PUBLISHER : RtcRole.SUBSCRIBER;
//   const expireTime = 3600; // 1h
//   const currentTime = Math.floor(Date.now() / 1000);
//   const privilegeExpireTime = currentTime + expireTime;

//   const token = RtcTokenBuilder.buildTokenWithUid(
//     APP_ID,
//     APP_CERTIFICATE,
//     channelName,
//     uid,
//     role,
//     privilegeExpireTime
//   );

//   return res.json({ token, appId: APP_ID, uid });
// });
app.use('/api/v1', router);

//Error Handler
app.use(notFoundHandler);
app.use(errorsHandler);

app.listen(3000, () => {
  console.log('hello');
});

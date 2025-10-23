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

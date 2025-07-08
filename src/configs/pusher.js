const Pusher = require('pusher');

const pusher = new Pusher({
  appId: 'app1',
  key: 'APP_KEY',
  secret: 'SECRET_KEY',
  //   useTLS: USE_TLS, // optional, defaults to false
  cluster: 'CLUSTER', // if `host` is present, it will override the `cluster` option.
  host: '103.20.96.194', // optional, defaults to api.pusherapp.com
  port: 6001, // optional, defaults to 80 for non-TLS connections and 443 for TLS connections
  //   encryptionMasterKeyBase64: ENCRYPTION_MASTER_KEY, // a base64 string which encodes 32 bytes, used to derive the per-channel encryption keys (see below!)
});

module.exports = pusher;

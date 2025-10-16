import { createClient } from 'agora-rtc-react';

const config = {
  mode: 'live',
  codec: 'vp8',
  appId: process.env.AGORA_APP_ID,
  token: null,
  channel: 'stream123',
  role: 'host',
};

const client = createClient(config);

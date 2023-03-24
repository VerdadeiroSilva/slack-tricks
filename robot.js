const schedule = require('node-schedule');
const { App } = require('@slack/bolt');
const axios = require('axios');
const bodyParser = require('body-parser');
const express = require('express');
const http = require('http');

// Hook
const SLACK_HOOK_URL = 'T03QBFDM1K5/B03Q50PJX2A/tDLiWEPZLo57n8Xft7IO40RM';

// Secret e Token
const SIGNIN_SECRET = '92de816f22c0cc5a7db66a8ec548684b';
const BOT_TOKEN = 'xoxb-3827523715651-3851384262560-53xcOpyQruK7ntlahLG4PSMZ';
const STATUS_URL = 'http://localhost:3025/status'

const boltAxiosInstance = axios.create({
  baseURL: 'https://hooks.slack.com/services/',
  timeout: 4000,
  headers: {
    'Content-Type': 'application/json',
    'Cache-Control': 'no-cache',
  },
});

const patinhas = new App({
  signingSecret: SIGNIN_SECRET,
  token: BOT_TOKEN
});

//Job touching webhook
const job = schedule.scheduleJob('* * * * *', async () => {
  try {
    let testing = await boltAxiosInstance.get(STATUS_URL);

    // let article = Array.from(testing.data.query.pages);
    let element = {};
    for (const key in testing.data) {
      element[key] = testing.data.key
    }
    boltAxiosInstance.post(SLACK_HOOK_URL,
      {
        text: (testing.data.uptime > 1000 ? `gracefuly-online` : `we-are-in-trouble`),
        blocks: [
          {
            "type": "section",
            "text": {
              "type": "mrkdwn",
              "text": "*General API Information*"
            }
          },
          {
            "type": "section",
            "block_id": "section567",
            "text": {
              "type": "mrkdwn",
              "text": '- _/status Endpoint_:\n' + `\n\`${JSON.stringify(testing.data)}\``
            },
            "accessory": {
              "type": "image",
              "image_url": "https://i.pinimg.com/564x/56/e2/59/56e259184c6ba52e008f827004879171.jpg",
              "alt_text": "Cool Duck"
            }
          },
        ]
      });

  }
  catch (err) {
    console.log
  }
});
job.invoke();


//Challenge response
const app = express();
app.use(bodyParser());
app.get('/', (req, res, next) => {
  const status = {
    status: 'ok',
    timestamp: new Date()
  }
  res.status(200).send(status)
});

app.post('/challenge', (req, res, next) => {
  console.log(req.body);
  res.status(200).send(req.body);
});

const server = http.createServer(app);
server.listen(8000);


(async () => {
  // Start the app
  await patinhas.start(3000);
  patinhas.message(':wave:', async ({ message, say }) => {
    console.log('quack')
    await say(`Quack, <@${message.user}>`);
  });
  console.log('⚡️ Bolt app is running!');

})();

//https://hooks.slack.com/services/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
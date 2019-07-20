const config = require('./config');
const axios = require('axios');
const pushbullet = require('pushbullet');

// DO NOT EDIT, edit the config.js file instead
const {
  PUSHBULLET_API_KEY,
  USERNAME,
  ENDPOINT,
  INTERVAL,
  DEVICE_NICKNAME,
  LOG_EVERYTHING,
} = config;

// Create a new pusher
const pusher = new pushbullet(PUSHBULLET_API_KEY);

// Device created in Pushbullet
const deviceOptions = {
  nickname: DEVICE_NICKNAME,
};

// Device ID
let deviceIden;

pusher.createDevice(deviceOptions, (error, response) => {
  if (error) {
    log(JSON.stringify(error));
    return;
  }
  deviceIden = response.iden;
  log(`Pushbullet device created, id: ${deviceIden}`);
});

const lastComment = async () => {
  const response = await axios.get(`${ENDPOINT}&size=1`);
  const comments = response.data.data;
  const lastTimestamp = comments[0].created_utc;
  return lastTimestamp;
};

const checkForComments = async lastTimestamp => {
  const response = await axios.get(`${ENDPOINT}`);
  const comments = response.data.data;

  if (LOG_EVERYTHING === true && comments[0].created_utc <= lastTimestamp) {
    log(`No new comments, checking again in ${INTERVAL / 1000} seconds...`);
    return lastTimestamp;
  }

  // Log all new comments
  comments.forEach(comment => {
    if (comment.created_utc > lastTimestamp) {
      log(
        `New comment: ${comment.body} | Subreddit: ${
          comment.subreddit
        } | Permalink: https://reddit.com${comment.permalink}`,
      );

      // Send link notification to your Pushbullet account
      sendPushbulletLink(deviceIden, comment.permalink);
    }
  });

  // Set latest comment as the newest timestamp
  const newLastTimestamp = comments[0].created_utc;
  return newLastTimestamp;
};

const getInitialComment = async () => {
  log(`Checking when ${USERNAME} last commented...`);
  let lastTimestamp = await lastComment();
  log(`Last comment timestamp: ${lastTimestamp} (UNIX)`);
  log('Beginning to monitor for new comments...');

  // Keep checking for new comments
  setInterval(async () => {
    lastTimestamp = await checkForComments(lastTimestamp);
  }, INTERVAL);
};

const log = message => {
  console.log(`${new Date().toUTCString()} - ${message}`);
};

const sendPushbulletLink = (device, permalink) => {
  pusher.link(
    device,
    'Reddit',
    `https://reddit.com${permalink}`,
    `New comment from ${USERNAME}`,
    (error, response) => {
      if (error) {
        log(error.message);
      }
      log('Pushbullet notification sent');
    },
  );
};

getInitialComment();

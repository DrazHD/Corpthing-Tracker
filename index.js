const config = require('./config');
const axios = require('axios');
const webhook = require('webhook-discord');

// DO NOT EDIT, edit the config.js file instead
const {
  DISCORD_HOOK_URL,
  DISCORD_HOOK_NAME,
  USERNAME,
  ENDPOINT,
  INTERVAL,
  LOG_EVERYTHING,
} = config;

const Hook = new webhook.Webhook(DISCORD_HOOK_URL);

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
      // Send message through Discord webhook
      Hook.info(
        DISCORD_HOOK_NAME,
        `New comment: ${comment.body} | Subreddit: ${
          comment.subreddit
        } | Permalink: https://reddit.com${comment.permalink}`,
      );

      log(
        `New comment: ${comment.body} | Subreddit: ${
          comment.subreddit
        } | Permalink: https://reddit.com${comment.permalink}`,
      );
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

getInitialComment();

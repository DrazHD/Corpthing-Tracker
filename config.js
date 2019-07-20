require('dotenv').config();

// Your personal Pushbullet api key, READ THE README.md
const PUSHBULLET_API_KEY = process.env.PUSHBULLET_API_KEY;

// Reddit user to search for
const USERNAME = 'corpthing';

// Do not change
const ENDPOINT = `https://api.pushshift.io/reddit/search/comment/?author=${USERNAME}&sort=desc`;

// Pinging interval in milliseconds, reddit api allows for 60 requests in one minute, which equals to 1000 ms
const INTERVAL = 1000;

// Device created in Pushbullet
const DEVICE_NICKNAME = 'corpthing-reddit-tracker';

// Whether the console shoud log even when new comments weren't found, wouldn't recommend with a log interval value
// values: true, false
const LOG_EVERYTHING = false;

module.exports = {
  PUSHBULLET_API_KEY,
  USERNAME,
  ENDPOINT,
  INTERVAL,
  DEVICE_NICKNAME,
  LOG_EVERYTHING,
};

require('dotenv').config();

// Reddit user to search for
const USERNAME = 'corpthing';

// Do not change
const ENDPOINT = `https://api.pushshift.io/reddit/search/comment/?author=${USERNAME}&sort=desc`;

// Pinging interval in milliseconds, reddit api allows for 60 requests in one minute, which equals to 1000 ms
const INTERVAL = 1000;

// Whether the console shoud log even when new comments weren't found, wouldn't recommend with a log interval value
// values: true, false
const LOG_EVERYTHING = false;

module.exports = {
  USERNAME,
  ENDPOINT,
  INTERVAL,
  LOG_EVERYTHING,
};

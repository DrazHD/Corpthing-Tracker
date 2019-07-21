require('dotenv').config();

// Create a new Discord server, create a new webhook from server settings, copy the url and place it in your .env file
const DISCORD_HOOK_URL = process.env.DISCORD_HOOK_URL;

// The name of the bot that will message each change
const DISCORD_HOOK_NAME = 'Corpthing Tracker';

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
  DISCORD_HOOK_URL,
  DISCORD_HOOK_NAME,
  USERNAME,
  ENDPOINT,
  INTERVAL,
  LOG_EVERYTHING,
};

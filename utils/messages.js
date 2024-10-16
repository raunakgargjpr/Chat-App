const moment = require('moment-timezone');

function formatMessage(username, text) {
  return {
    username: username,
    text: text,
    time: moment().tz('Asia/Kolkata').format('h:mm a') // IST is Asia/Kolkata
  };
}

module.exports = formatMessage;

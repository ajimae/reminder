var { GetUserRemindersRequest } = require('../service-x-proto-nodejs/services/reminders/messages_pb.js');

var client = require('.')

async function getUserReminders(/** we receive user id here */) {
  var userId;
  var request = new GetUserRemindersRequest();

  /**
   * TODO: remove this block
   */
  if (process.argv.length > 2) {
    userId = process.argv[2];
  } else {
    // fallback to first entry
    userId = 1;
  }

  request.setUserId(userId)
  client.getUserReminders(request, function(error, response) {
    console.log(response.toObject())
  })
}

/**
 * this function will be call at the
 * point where we can provide user id
 * to receive all his/her reminders
 */
getUserReminders(/** we pass user id here */)

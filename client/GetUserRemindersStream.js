var ObjectsToCsv = require('objects-to-csv');
var { GetUserRemindersStreamRequest } = require('../service-x-proto-nodejs/services/reminders/messages_pb.js');

var client = require('.')

async function getUserRemindersStream(/** we receive user id here */) {
  var userId;
  var request = new GetUserRemindersStreamRequest();

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

  var reminders = []
  const stream = client.getUserReminderStreams(request)
  stream.on('data', function(data) {
    var { reminder } = data.toObject()
    reminders.push(reminder)
  })

  stream.on('end', async function() {
    console.log(reminders)
    new ObjectsToCsv(reminders).toDisk('test.csv');
  })

  stream.on('error', function(error) {
    console.log(error)
  })

  return reminders;
}

/**
 * this function will be call at the
 * point where we can provide user id
 * to receive all his/her reminders
 */
getUserRemindersStream(/** we pass user id here */)

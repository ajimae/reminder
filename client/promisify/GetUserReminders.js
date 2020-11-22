var { GetUserRemindersRequest } = require('../../service-x-proto-nodejs/services/reminders/messages_pb.js');

var client = require('../')
var promisifyAll = require('../utils/promisify')

async function getUserReminders() {
  const {
    getUserReminders
  } = promisifyAll(client)
  var userId;
  const request = new GetUserRemindersRequest()

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

  const res = await getUserReminders(request);
  console.log(res.toObject(), '>>>>')
}

// Necessary until gRPC provides a native async friendly solution https://github.com/grpc/grpc-node/issues/54
getUserReminders()
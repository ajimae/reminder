var { DeleteReminderRequest } = require('../service-x-proto-nodejs/services/reminders/messages_pb');

var client = require('.')

function deleteUserReminder(/** receive passed in reminder object */) {

  var request = new DeleteReminderRequest()
  
  request.setUserId('1') /** this can be set at the point of use */
  request.setNoteId('2') /** this can be set at the point of use */

  client.deleteReminder(request, function(error, response) {
    console.log(response.toObject())
  })
}

/**
 * this function will be call at the
 * point where we can provide user id
 * to receive all his/her reminders
 */
deleteUserReminder(/** pass in user reminder object here */)

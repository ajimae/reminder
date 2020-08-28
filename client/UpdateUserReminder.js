var { Reminder, UpdateReminderRequest } = require('../service-x-proto-nodejs/services/reminders/messages_pb');

var client = require('.')

function reminderToClass({ userId, noteId, dateTime }) {
  var reminder = new Reminder();

  reminder.setUserId(userId)
  reminder.setNoteId(noteId)
  reminder.setDatetime(dateTime)

  return reminder;
}

function updateUserReminder(/** receive passed in reminder object */) {

  var userReminder;
  if (process.argv.length > 2) {
    userReminder = process.argv[2]
  } else {
    userReminder = { userId: '1', noteId: '2', dateTime: 'new Date().getTime().toString()-->>' }
  }

  var reminder = reminderToClass(userReminder)

  var request = new UpdateReminderRequest()
  request.setReminder(reminder)
  
  client.updateReminder(request, function(error, response) {
    console.log(response.toObject())
  })
}

/**
 * this function will be call at the
 * point where we can provide user id
 * to receive all his/her reminders
 */
updateUserReminder(/** pass in user reminder object here */)

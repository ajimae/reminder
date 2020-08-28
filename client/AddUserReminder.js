var { Reminder, AddReminderRequest } = require('../service-x-proto-nodejs/services/reminders/messages_pb');

var client = require('.')

function reminderToClass({ userId, noteId, dateTime }) {
  var reminder = new Reminder();

  reminder.setUserId(userId)
  reminder.setNoteId(noteId)
  reminder.setDatetime(dateTime)

  return reminder;
}

function addUserReminder(/** receive passed in reminder object */) {

  var userReminder;
  if (process.argv.length > 2) {
    userReminder = process.argv[2]
  } else {
    userReminder = { userId: '1', noteId: '2', dateTime: new Date().getTime().toString() }
  }

  var reminder = reminderToClass(userReminder)

  var request = new AddReminderRequest()
  request.setReminder(reminder)
  client.addReminder(request, function(error, response) {
    // var { reminderList } = response.toObject()
    console.log(response.toObject())
  })
}

/**
 * this function will be call at the
 * point where we can provide user id
 * to receive all his/her reminders
 */
addUserReminder(/** pass in user reminder object here */)

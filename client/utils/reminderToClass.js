var {
  Reminder
} = require('../../service-x-proto-nodejs/services/reminders/messages_pb');

function reminderToClass({ userId, noteId, datetime }) {
  var reminder = new Reminder();

  reminder.setUserId(userId)
  reminder.setNoteId(noteId)
  reminder.setDatetime(datetime)

  return reminder;
}

module.exports = reminderToClass

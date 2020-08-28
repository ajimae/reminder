var mongoose = require('mongoose')

var reminderSchema = new mongoose.Schema({
  userId: String,
  noteId: String,
  datetime: String
})

const Reminder = mongoose.model('Reminder', reminderSchema);

module.exports = Reminder;

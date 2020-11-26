const chai = require('chai')
const mongoose = require('mongoose')
const client = require('../client/index')
const reminderToClass = require('../client/utils/reminderToClass')
const {
  AddReminderRequest,
  GetUserRemindersRequest,
  GetUserRemindersStreamRequest,
  UpdateReminderRequest,
  DeleteReminderRequest
} = require('../service-x-proto-nodejs/services/reminders/messages_pb.js');
const ReminderDoc = require('../server/database/models')

const { expect } = chai;

describe('service test', function() {
  var request;
  before(function(done) {
    require('../server/server')
    function clearDB() {
      var promises = [ReminderDoc.deleteOne().exec()];
      Promise.all(promises).then(function() {
        done();
      });
    }

    if (mongoose.connection.readyState === 0) {
      mongoose.connect(process.env.DB_URL, function(err) {
        if (err) throw err;
        return clearDB();
      });
    } else {
      return clearDB();
    }
    done();
  })

  it('should add a new reminder', function(done) {
    request = new AddReminderRequest()
    const reminder = { userId: '2', noteId: '50', datetime: new Date().getTime().toString() }

    var reminderObj = reminderToClass(reminder)
    request.setReminder(reminderObj)

    client.addReminder(request, function(error, response) {
      const { reminder } = response.toObject();
      expect(response.toObject()).to.be.an('object')
      expect(reminder).to.have.property('userId')
      done()
    })
  })

  it('should add a another reminder', function(done) {
    request = new AddReminderRequest()
    const reminder = { userId: '2', noteId: '52', datetime: new Date().getTime().toString() }

    var reminderObj = reminderToClass(reminder)
    request.setReminder(reminderObj)

    client.addReminder(request, function(error, response) {
      const { reminder } = response.toObject();
      expect(response.toObject()).to.be.an('object')
      expect(reminder).to.have.property('userId')
      done()
    })
  })

  it('should get all user reminders in the db', function(done) {
    const userId = '1'
    request = new GetUserRemindersRequest()
    request.setUserId(userId)

    client.getUserReminders(request, function(error, response) {
      expect(error).to.be.a('null')
      expect(response.toObject()).to.be.an('object')
      expect(response.toObject().reminderList).to.be.an('array')
      done()
    })
  })

  it('should get and stream user reminders', function(done) {
    const userId = '2'
    request = new GetUserRemindersStreamRequest()
    request.setUserId(userId)

    var counter = 0;
    var stream = client.getUserReminderStreams(request)
    stream.on('data', function(data) {
      counter++
      const { reminder } = data.toObject();
      expect(reminder).to.have.property('datetime')
      expect(reminder).to.have.property('userId').with.length(1)
    })

    stream.on('end', function() {
      expect(counter).to.be.a('number')
      expect(counter).to.be.greaterThan(0)
      done()
    })
  })

  it('should update a user\'s reminder', function(done) {
    request = new UpdateReminderRequest();
    const reminder = { userId: '2', noteId: '50', datetime: new Date().getTime().toString() }

    var reminderObj = reminderToClass(reminder)
    request.setReminder(reminderObj)

    client.updateReminder(request, function(error, response) {
      expect(error).to.be.a('null')
      expect(response.toObject()).to.be.an('object')
      expect(response.toObject().reminder).to.have.property('datetime')
      done()
    })
  })

  it('should delete a user\'s reminder', function(done) {
    request = new DeleteReminderRequest();
    const reminder = { userId: '2', noteId: '50', datetime: new Date().getTime().toString() }

    const { userId, noteId } = reminder;

    request.setUserId(userId)
    request.setNoteId(noteId)

    client.deleteReminder(request, function(error, response) {
      expect(error).to.be.a('null')
      expect(response.toObject()).to.be.an('object')
      expect(response.toObject().reminder).to.have.property('datetime')
      done()
    })
  })
})

var {
  AddReminderResponse,
  GetUserRemindersResponse,
  GetUserRemindersStreamResponse,
  UpdateReminderResponse,
  DeleteReminderResponse,
} = require('../service-x-proto-nodejs/services/reminders/messages_pb');
var services = require('../service-x-proto-nodejs/services/reminders/service_grpc_pb');

const Mali = require('mali');
const intoStream = require('into-stream')

const connectDB = require('./database')
const ReminderDoc = require('./database/models');
const reminderToClass = require('./utils/reminderToClass')
const logger = require('./middlewares/logger')

// make a connection to the database
connectDB().then(function(data) { console.log('connected to database') }).catch(console.error)

/**
 * Implements the getReminder RPC method.
 */
async function getUserReminders(ctx) {
  var userId = ctx.req.getUserId()
  var _reminder = await ReminderDoc.find({ userId })

  var reminderDoc = _reminder.map(reminderToClass)
  var response = new GetUserRemindersResponse();
  response.setReminderList(reminderDoc)

  ctx.res = response;
}

/**
 * Implements the getReminder RPC stream method.
 */
async function getUserReminderStreams(ctx) {
  var userId = ctx.req.getUserId()
  var _reminder = await ReminderDoc.find({ userId })
  
  var reminderDoc = _reminder.map(reminderToClass)
  
  const reminders = []
  console.log(reminderDoc.length, '><><><')
  for (var i = 0; i < reminderDoc.length; i++) {
    var response = new GetUserRemindersStreamResponse();
    response.setReminder(reminderDoc[i])
    reminders.push(response)
  }

  ctx.res = intoStream.object(reminders)
}

/**
 * Implements the addReminder RPC method.
 */
async function addReminder(ctx) {

  /** insert document into database */
  var reminderObj = await ReminderDoc.create({ ...ctx.req.getReminder().toObject() })
  var reminder = reminderToClass(reminderObj)

  // convert PJO to typeof Reminder
  var response = new AddReminderResponse();
  response.setReminder(reminder)
  ctx.res = response
}

/**
 * Implements the updateReminder RPC method.
 */
async function updateReminder(ctx) {
  var { userId, noteId, datetime } = ctx.req.getReminder().toObject()

  var filter = { userId, noteId }
  var update = { datetime }

  var newReminderObject = await ReminderDoc.findOneAndUpdate(filter, update, { upsert: true })

  // convert it to a type of Reminder
  var reminderObject = reminderToClass(newReminderObject)

  var response = new UpdateReminderResponse()
  response.setReminder(reminderObject)
  ctx.res = response
}

/**
 * Implements the deleteReminder RPC method.
 */
async function deleteReminder(ctx) {
  var userId = ctx.req.getUserId()
  var noteId = ctx.req.getNoteId()

  var filter = { userId, noteId }
  var deletedReminderObject = await ReminderDoc.findOneAndRemove(filter)
  var response = new DeleteReminderResponse()

  // convert deletedReminder to type of Reminder
  var deletedReminder = reminderToClass(deletedReminderObject)
  response.setReminder(deletedReminder)
  ctx.res = response
}


/**
 * Starts an RPC server that receives requests for the Greeter service at the
 * sample server port
 */
(function() {
  const HOSTPORT = '0.0.0.0:50051'
  var app = new Mali(services, 'ReminderAPI')

  // middleware
  app.use(logger)

  // service implementations
  app.use({ addReminder })
  app.use({ updateReminder })
  app.use({ deleteReminder })
  app.use({ getUserReminders })
  app.use({ getUserReminderStreams })

  app.start(HOSTPORT)
  console.log('server started on port ' + HOSTPORT.split(':')[1])
})()

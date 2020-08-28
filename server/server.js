var {
  Reminder,
  AddReminderResponse,
  GetUserRemindersResponse,
  UpdateReminderResponse,
  DeleteReminderResponse,
} = require('../service-x-proto-nodejs/services/reminders/messages_pb');
var services = require('../service-x-proto-nodejs/services/reminders/service_grpc_pb');

const Mali = require('mali');
const connectDB = require('./database')
const ReminderDoc = require('./database/models');

// make a connection to the database
connectDB().then(function(data) { console.log('connected to database') }).catch(console.error)

// utils
function reminderToClass({ userId, noteId, datetime }) {
  var reminder = new Reminder();

  reminder.setUserId(userId)
  reminder.setNoteId(noteId)
  reminder.setDatetime(datetime)

  return reminder;
}

// middlewares
async function logger (ctx, next) {
  const start = new Date()
  await next()
  const ms = new Date() - start
  console.log('%s [%s] - %s ms', ctx.name, ctx.type, ms);
}

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
 * Implements the addReminder RPC method.
 */
async function addReminder(ctx) {
  // reminders.push(ctx.req.getReminder())

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
function main() {
  const HOSTPORT = '0.0.0.0:50051'

  var app = new Mali(services, 'ReminderAPI')

  // middleware
  app.use(logger)

  // service implementations
  app.use({ addReminder })
  app.use({ updateReminder })
  app.use({ deleteReminder })
  app.use({ getUserReminders })

  app.start(HOSTPORT)
  console.log('server started on port ' + HOSTPORT.split(':')[0])
}

main();

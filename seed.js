const connectDB = require('./server/database/index')

const ReminderDoc = require('./server/database/models')
connectDB().then(function() { }).catch(console.log)

(async function() {
  for (var i = 0; i < 10; i++) {
    await ReminderDoc.create({ userId: 1, noteId: 1 + Math.floor(Math.random() * 99999), datetime: new Date().getTime() })
  }
  console.log('all done...')
})()

var mongoose = require('mongoose')

async function connectDB() {
  var connStr = await mongoose.connect('mongodb://localhost:27017/grpc', { useNewUrlParser: true, useUnifiedTopology: true , useFindAndModify: false})

  return connStr;
}

module.exports = connectDB

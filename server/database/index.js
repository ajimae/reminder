var mongoose = require('mongoose')
var { config } = require('dotenv')

config()
console.log(process.env.NODE_ENV, '>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>')
async function connectDB() {
  const url = process.env.NODE_ENV == "test" ? "mongodb://localhost:27017/tests" : "mongodb://localhost:27017/grpc"
  var connStr = await mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true , useFindAndModify: false})

  return connStr;
}

module.exports = connectDB

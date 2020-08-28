var { ReminderAPIClient } = require('../service-x-proto-nodejs/services/reminders/service_grpc_pb.js');

var grpc = require('grpc');
var client = new ReminderAPIClient('localhost:50051', grpc.credentials.createInsecure());

module.exports = client

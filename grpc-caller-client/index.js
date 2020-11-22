var grpc = require('grpc');
const caller = require('grpc-caller');

var { ReminderAPIClient } = require('../service-x-proto-nodejs/services/reminders/service_grpc_pb.js');

const credentials = grpc.credentials.createInsecure();
const client = caller('localhost:50051', ReminderAPIClient, null, credentials);

module.exports = client

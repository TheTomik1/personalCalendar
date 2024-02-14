process.env["DEBUG"] = "calendar-api:ntfy,calendar-api:server,calendar-api:oldEventDelete";

const cookieParser = require('cookie-parser');
const express = require("express");
const morgan = require('morgan');
const debug = require('debug')('calendar-api:server');
const http = require('http');

require('./api/systems/ntfyMessages');
require('./api/systems/oldEventDelete');

const endpoints = require("./api/endpoints");

const calendarApi = express();

calendarApi.use(express.json());
calendarApi.use(cookieParser());
calendarApi.use(morgan('combined'));
calendarApi.use("/api", endpoints);

const calendarApiServer = http.createServer(calendarApi);
calendarApiServer.listen(8080);
calendarApiServer.on('listening', onListening);
calendarApiServer.on('error', onError);

/**
 * @description Logs that the server is listening for incoming requests.
 */
function onListening() {
  let address = calendarApiServer.address();
  debug(`Listening for incoming requests on port ${address.port}.`);
}

/**
 * @param error - An error that has occurred.
 * @description Logs the error and exits the process.
 */
function onError(error) {
  debug(`Error occurred: ${error}.`);
}
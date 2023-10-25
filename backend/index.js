process.env["DEBUG"] = "calendar-api:server";

const express = require("express");
const morgan = require('morgan');
const debug = require('debug')('calendar-api:server');
const http = require('http');

const endpoints = require("./api/endpoints");

const calendarApi = express();

calendarApi.use(express.json());
calendarApi.use("/api", endpoints);
calendarApi.use(morgan('combined'));

const calendarApiServer = http.createServer({}, calendarApi);
calendarApiServer.listen(3000);
calendarApiServer.on('listening', onListening);
calendarApiServer.on('error', onError);

/**
 *  Listen to incoming requests.
 */
function onListening() {
  let addr = calendarApiServer.address();
  let bind = typeof addr === 'string' ? 'pipe ' + addr : 'port ' + addr.port;
  debug(`Listening on ${bind}.`);
}

/**
 * Handle server errors.
 * @param error An error that has occurred.
 */
function onError(error) {
  debug(`Error occurred: ${error}.`);
}
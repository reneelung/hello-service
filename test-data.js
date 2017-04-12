var randomString = require('randomstring');
var randomInt = require('random-int');
var mysql = require('promise-mysql');
var config = require('./config');

const EVENT_TYPES = ['trigger', 'acknowledge', 'resolve'];
const TABLE_NAME = 'events';

module.exports = {
	generateEvents: function(numEvents) {
		var connection;
		return mysql.createConnection({
		  socketPath: config.dbSocketPath,
		  host     : config.dbHost,
		  user     : config.dbUser,
		  password : config.dbPassword,
		  database : config.dbName
		}).then(function(conn) {
			connection = conn;
			var count = 0;
			process.stdout.write('Populating database.');
			while (count < numEvents) {
				var event = {
					incident_key: randomString.generate(),
					type: EVENT_TYPES[randomInt(EVENT_TYPES.length - 1)]
				}
				connection.query("INSERT INTO `events` SET ?", event);
				process.stdout.write('.');
				count++;
			}
			process.stdout.write('.\n');			
		});
	}
}

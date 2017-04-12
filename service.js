var mysql      = require('mysql');
var express = require('express');
var connection = mysql.createConnection({
  socketPath: '/tmp/mysql.sock',
  host     : 'localhost',
  user     : 'root',
  password : '-password-',
  database : 'hello_service'
});

module.exports = {
	start: function() {
		var serviceApp = express();

		serviceApp.get("/", function(req,res) {
			res.redirect('/incidents');
		});

		serviceApp.get("/incidents",function(req,res) {
			console.info("Method:", req.method, "Path:", req.path, "Params:", req.params, "Query:", req.query);
			connection.query('SELECT * from events', function(error, rows, fields) {
			  if (!error) {
			  	var str = '';
			  	rows.map(function(row) {
			  		for (field in row) {
			  			str += field + ": " + row[field] + "<br/>";	  			
			  		}
			  	});
			  	// console.log(str.replace(/<br\/>/g, '\n'));
			  	res.send(str);
			  }	    
			  else {
			  	console.log(error);
			  }	    
			});
		});

		serviceApp.post("/event", function(req, res) {
			console.log(req.query);
			var event  = {
				incident_key: req.query.incident_key,
				type: req.query.type ? req.query.type : 'trigger'
			};
			connection.query('INSERT INTO events SET ?', event, function (error, rows, fields) {
			  if (!error) {
			  	res.status(200).send(JSON.stringify(req.query));
			  } else {
			  	res.status(418).send(error.code);
			  	console.log(error);
			  }
			});	
		});

		serviceApp.get("/incidents/:key", function(req, res) {
			connection.query('SELECT * FROM events WHERE incident_key = ?', req.params.key, function(error, rows, fields) {
				if (!error) {
					var str = '';
				  	rows.map(function(row) {
				  		for (field in row) {
				  			str += field + ": " + row[field] + "<br/>";	  			
				  		}
				  	});
				  	// console.log(str.replace(/<br\/>/g, '\n'));
				  	res.send(str);
				} else {
					console.log(error);
				}
			});
		});

		serviceApp.listen(8080, '127.0.0.1', function() {
			console.log("Listening on http://127.0.0.1:8080");
		});
	}
}
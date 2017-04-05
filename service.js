var mysql      = require('mysql');
var express = require('express');
var connection = mysql.createConnection({
  socketPath: '/tmp/mysql.sock',
  host     : 'localhost',
  user     : 'root',
  password : '-password-',
  database : 'hello_service'
});
var app = express();

connection.connect(function(err){
	if(!err) {
	    console.log("Connected to local db");    
	} else {
	    console.log("Error connecting database");    
	}
});

app.get("/", function(req,res) {
	res.redirect('/incidents');
});

app.get("/incidents",function(req,res) {
	connection.query('SELECT * from events', function(error, rows, fields) {
	  if (!error) {
	  	var str = '';
	  	rows.map(function(row) {
	  		for (field in row) {
	  			str += field + ": " + row[field] + "<br/>";	  			
	  		}
	  	});
	  	console.log(str.replace(/<br\/>/g, '\n'));
	  	res.send(str);
	  }	    
	  else {
	  	console.log(error);
	  }	    
	});
});

app.post("/event", function(req, res) {
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

app.get("/incidents/:key", function(req, res) {
	connection.query('SELECT * FROM events WHERE incident_key = ?', req.params.key, function(error, rows, fields) {
		if (!error) {
			var str = '';
		  	rows.map(function(row) {
		  		for (field in row) {
		  			str += field + ": " + row[field] + "<br/>";	  			
		  		}
		  	});
		  	console.log(str.replace(/<br\/>/g, '\n'));
		  	res.send(str);
		} else {
			console.log(error);
		}
	});
});

app.listen(8080, '127.0.0.1');
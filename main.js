// Built ins
var http = require("http");

// Npm modules
var mysql = require("mysql");

// Homemade modules
var Projects = require("./projects.js");

// Data
var config = require("./config.js");

var database = mysql.createConnection({
	host: config.mysql.host,
	user: config.mysql.user,
	password: config.mysql.password,
	database: config.mysql.database,
	multipleStatements: true
});

var projects = new Projects(database);

var handlers = {
	"/nextProject": function (req, res) {
		res.writeHead(200, {
			"Access-Control-Allow-Origin": "*",
			"Content-Type": "application/json"
		});

		projects.getLeastGraded(null, function (err, project) {
			res.end(
				JSON.stringify(
					[project.project_id, project.name, project.description]
				)
			);
		});
	},
	"/addGrading": function (req, res) {
		res.writeHead(200, {
			"Access-Control-Allow-Origin": "*",
			"Content-Type": "application/json"
		});

		var url = require("url");
		var parsedUrl = url.parse(req.url, true);
		
		projects.addGrading(parsedUrl.query);
		res.end();
	},
	"/message": function (req, res) {
		res.writeHead(200, {
			"Access-Control-Allow-Origin": "*",
			"Content-Type": "text/plain"
		});

		var url = require("url");
		var parsedUrl = url.parse(req.url, true);
		
		if (parseInt(parsedUrl.query.Body) != parseInt(parsedUrl.query.Body)) {
			res.end("");
		} else {
			projects.addPublicGrading(parsedUrl.query);
			res.end("");
		}
	},
	"/results": function (req, res) {
		res.writeHead(200, {
			"Access-Control-Allow-Origin": "*",
			"Content-Type": "application/json"
		});
		
		projects.getResults(function (err, results) {
			res.end(JSON.stringify({
				err: err,
				results: results
			}));
		});
	}
};

var server = http.createServer(function (req, res) {
	var url = require("url");
	var parsedUrl = url.parse(req.url, true);
	console.log((new Date()).toLocaleString() + ": " + req.url);
	
	
	if (handlers[parsedUrl.pathname]) {
		handlers[parsedUrl.pathname](req, res);
	} else {
		res.writeHead(200, {
			"Access-Control-Allow-Origin": "*",
			"Content-Type": "application/json"
		});

		res.end(JSON.stringify({
			error: "No handler for this path"
		}));
	}
});

server.listen(process.argv[2] || config.port || 3666);
function Projects (database) {
	this.database = database;
};

/*
	Get the least graded project
	Excluding projects already judged by exclude
*/
Projects.prototype.getLeastGraded = function getLeastGraded (exclude, callback) {
	this.database.query("SELECT *, (SELECT COUNT(*) FROM gradings WHERE gradings.project_id = projects.project_id) AS grading_count FROM projects ORDER BY grading_count", function (err, data, fields) {
		callback(err, data && data[0]);
	});
};

/*
	Add a grading = {
		project: INT,
		grader: STRING,
		creativity: INT,
		original: INT,
		technical: INT,
		useful: INT,
		cool: INT,
		social: INT,
		pitch: INT
	}
*/
Projects.prototype.addGrading = function addGrading (grading) {
	this.database.query("INSERT INTO gradings (project_id, juror, creativity, original, technical, useful, cool, social, pitch) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
		[grading.project, grading.grader, grading.creativity, grading.original, grading.technical, grading.useful, grading.cool, grading.social, grading.pitch],
		function (err) {
			err ? console.log("addGrading error", err) : "";
		}
	);
};

/*
	grading= {
		Body: INT, //project_id
		From: TEXT //phone number
	}
*/
Projects.prototype.addPublicGrading = function addPublicGrading (grading) {
	this.database.query("INSERT INTO public_gradings (project_id, phone_number) VALUES (?, ?)", [parseInt(grading.Body), grading.From], function (err) {
		err ? console.log("addPublicGrading error", err) : "";
	});
};

Projects.prototype.getResults = function getResults (callback) {
	this.database.query("SELECT project_id, COUNT(DISTINCT phone_number) as public_votes FROM public_gradings GROUP BY project_id ORDER BY COUNT(DISTINCT phone_number)",
		function (err, rows, fields) {
			callback(err, rows);
		}
	);
};

module.exports = Projects;
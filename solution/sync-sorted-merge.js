'use strict'
/*
ToDo: If we want to handle larger datasets, need to persist data, break down
into chunks and merge sort from there...like EXTERNAL MERGE SORT.

hmmm...a bit of work...

For now, we do in-memory storage to handle logs on a smaller scale.

:)

*/

// Type 1: In-memory only datastore (no need to load the database)
var Datastore = require('nedb')
var db = new Datastore();


/** FOR REFERENCE:
 * Challenge Number 1!
 *
 * Assume that a LogSource only has one method: pop() which will return a LogEntry.
 *
 * A LogEntry is simply an object of the form:
 * {
 * 		date: Date,
 * 		msg: String,
 * }
 *
 * All LogEntries from a given LogSource are guaranteed to be popped in chronological order.
 * Eventually a LogSource will end and return boolean false.
 *
 * Your job is simple: print the sorted merge of all LogEntries across `n` LogSources.
 *
 * Call `printer.print(logEntry)` to print each entry of the merged output as they are ready.
 * This function will ensure that what you print is in fact in chronological order.
 * Call 'printer.done()' at the end to get a few stats on your solution!
 */
module.exports = (logSources, printer) => {
	//throw new Error('Not implemented yet!  That part is up to you!')

	function printLogs(logEntries, printer) {
		for (var j = 0; j < logEntries.length; j++) {
			printer.print(logEntries[j]);
		}

		printer.done();
	}

	// push log entries into db
	for (var i = 0; i < logSources.length; ++i) {
		// get all log entries
		var logEntries = [];
		var logEntry = logSources[i].pop();
		while (logEntry) {
			logEntries.push(logEntry);
			logEntry = logSources[i].pop();
		}
		// insert range
		db.insert(logEntries);
	}

	//print log entries
	db.find({}).sort({ date: 1 }).exec(function (err, docs) {
		if (err) {
			console.error(err)
		}
		//print logs
		printLogs(docs, printer);
	});
};

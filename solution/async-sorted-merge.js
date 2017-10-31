'use strict'
/*
ToDo: If we want to handle larger datasets, need to persist data, break down
into chunks and merge sort from there...like EXTERNAL MERGE SORT.

hmmm...a bit of work...

For now, we do in-memory storage to handle logs on a smaller scale.

:)

*/

// Type 1: In-memory only datastore (no need to load the database)
var DatastoreAsync = require('nedb')
var dbAsync = new DatastoreAsync();

/** For Reference...
 * Challenge Number 2!
 *
 * Very similar to Challenge Number 1, except now you should assume that a LogSource
 * has only one method: popAsync() which returns a promise that resolves with a LogEntry,
 * or boolean false once the LogSource has ended.
 */
module.exports = (logSources, printer) => {
	//throw new Error('Not implemented yet!  That part is up to you!')

	function printLogs(logEntries, printer) {
		for (var j = 0; j < logEntries.length; j++) {
			printer.print(logEntries[j]);
		}
		printer.done();
	}

	//to keep track of how many log sources we've gone through
	var count = 0;
	//don't care about sequence, just need to save data then sort
	logSources.forEach(function(logSource) {
		//get all log entries for each source
		var loop = function() {
			logSource.popAsync().then(function(logEntry) {

				//first check if the source is drained
				if (logEntry == false) {
					// sort and print the log entries if ALL log sources are drained
					if (count == logSources.length - 1) {
						//sort asc order
						dbAsync.find({}).sort({ date: 1 }).exec(function (err, docs) {
							if (err) {
								console.error(err)
							}
							//print logs
							printLogs(docs, printer);
						});
					}

					//increase count to keep track of log source count
					count++;

					return false;
				}

				//otherwise, insert data into db
				dbAsync.insert(logEntry);
				//loop again
				loop();
			});
		};

		//initial loop
		loop();
	});

};

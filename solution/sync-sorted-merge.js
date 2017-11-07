'use strict'
var BinaryHeap = require("./BinaryHeap")
var common = require("./common")

/*
ToDo: If we want to handle larger datasets, need to persist data, break down
into chunks and merge sort from there...like EXTERNAL MERGE SORT.

hmmm...a bit of work...

For now, we do in-memory storage to handle logs on a smaller scale.

:)

*/

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

	//sorted logs
	var result = [];

	// we initialize a new min-heap to sort in-memory.
	//we pass in a score function that returns a value to be compared.
	//recordContainer, contains the current record and index of the file
	//the record came from
	//recordContainer = { record: ${logEntry}, sourceIndex: ${indexOfLogSource} }
	var minHeap = new BinaryHeap(
		function(recordContainer) {
			return recordContainer.record.date;
	});
	// pop off the first log entry from each log sources
	for (var i = 0; i < logSources.length; i++) {
		minHeap.push({ record: logSources[i].pop(), sourceIndex: i });
	}

	/*
		ToDo: For supporting more data, need to:
			1. Allocate max amount of memory space sorting in-memory
				 with Min-Heap
			2. If a lot of LogSources, need to break into chunks or files
			3. Merge all chunks into one HUMUNGO file, sorted
			4. Read and print results!

			Spent too much time on this...moving on.
	*/
	//console.log(minHeap.content);
	//Now get the min element from min heap and replace it with the next element.
	//Run until all log sources are drained.
	while (true) {
		// Get the min element and store it in output file (our array)
		var root = minHeap.pop();

		//console.log(root);
		if (root == undefined) {
			break;
		}

		//push to our output array
		result.push(root.record);

		//Find the next element that will replace current root of the min heap.
		//Next element should come from the same log source as the current min
		//element
		var record = logSources[root.sourceIndex].pop();
		if (record != false) {
			var nextElement = { record: record, sourceIndex: root.sourceIndex };
			//replace root with the next element of log sourceIndex
			minHeap.push(nextElement);
		}
		//console.log("Pushed next record..." + record);
	}

	//print results
	common.printLogs(result, printer);
};

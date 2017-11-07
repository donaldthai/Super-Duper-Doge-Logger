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

/** For Reference...
 * Challenge Number 2!
 *
 * Very similar to Challenge Number 1, except now you should assume that a LogSource
 * has only one method: popAsync() which returns a promise that resolves with a LogEntry,
 * or boolean false once the LogSource has ended.
 */
module.exports = (logSources, printer) => {
	//throw new Error('Not implemented yet!  That part is up to you!')

	//sorted logs
	var result = [];
	var drainCount = 0; //count increments when log source drained

	// we initialize a new min-heap to sort in-memory.
	//we pass in a score function that returns a value to be compared.
	//recordContainer, contains the current record and index of the file
	//the record came from
	//recordContainer = { record: ${logEntry}, sourceIndex: ${indexOfLogSource} }
	var minHeap = new BinaryHeap(
		function(recordContainer) {
			return recordContainer.record.date;
	});

	var printLogs = function(minHeap, result) {
		while (true) {
			// Get the min element and store it in output file (our array)
			var root = minHeap.pop();
			//console.log(root.record);
			if (root == undefined) {
				break;
			}

			//push to our output array
			result.push(root.record);

			//Find the next element that will replace current root of the min heap.
			//Next element should come from the same log source as the current min
			//element
			// var record = logSources[root.sourceIndex].popAsync();
			// if (record != false) {
			// 	var nextElement = { record: record, sourceIndex: root.sourceIndex };
			// 	//replace root with the next element of log sourceIndex
			// 	minHeap.push(nextElement);
			// }
			//console.log("Pushed next record..." + root);
		};

		common.printLogs(result, printer);
	};


	// pop off the first log entry from each log sources
	var FillMinHeap = function(minHeap, logSources) {
		var count = 0;
		logSources.forEach(function(logSource) {
			logSource.popAsync().then(function(logEntry) {
				if (logEntry != false) {
					minHeap.push({ record: logEntry });
				}

				//increase count to keep track of log count
				count++;

				if (count == logSources.length) {
					printLogs(minHeap, result);
				}

				return false;
			});
		});
	};


	/*
		ToDo: Need to:
			1. Get each record asynchronously from each logSource
			2. Push records into heap, sorted
			3. Pop min record onto "result" file
			4. PopAsync from same logSource from min record
			5. Push onto heap
			6. Repeat 3-5 until heap is empty
			7. DONE!

			Getting late, did what I could do...
	*/
	FillMinHeap(minHeap, logSources);
};

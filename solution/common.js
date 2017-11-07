/*
Common functions to be used between sync-sorted-merge and async-sorted-merge
below:
*/
/*
  Print the logs from the log entires passed in
*/

module.exports = {
    printLogs: function(logEntries, printer) {
      for (var j = 0; j < logEntries.length; j++) {
        printer.print(logEntries[j]);
      }

      printer.done();
    }
}

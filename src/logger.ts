import logger from "simple-node-logger";

// create a rolling file logger based on date/time that fires process events
const opts = {
	errorEventName: "error",
	logDirectory: "./mylogfiles", // NOTE: folder must exist and be writable...
	fileNamePattern: "roll-<DATE>.log",
	dateFormat: "YYYY.MM.DD",
};
export default logger.createRollingFileLogger(opts);

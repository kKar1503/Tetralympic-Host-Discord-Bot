import { Console } from "console";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Defining paths
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const LOG_DIR = path.join(__dirname);
const ACTIVITY_LOG_DIR = path.join(__dirname, "Activities.log");
const ERROR_LOG_DIR = path.join(__dirname, "Errors.log");

// Defining header message
const LOG_HEADER = `Log File for Tetralympic Host
Developed by Kar
GitHub Repository: https://github.com/kKar1503/Tetralympic_Host.git\n
${"=".repeat(30)}\n\n`;

// Intialize log directory
if (!fs.existsSync(LOG_DIR)) {
	fs.mkdirSync(LOG_DIR);
}

// Initialize Activity Log File
if (!fs.existsSync(ACTIVITY_LOG_DIR)) {
	fs.writeFileSync(ACTIVITY_LOG_DIR, "Acitvity " + LOG_HEADER);
}

// Initialize Error Log File
if (!fs.existsSync(ERROR_LOG_DIR)) {
	fs.writeFileSync(ERROR_LOG_DIR, "Error " + LOG_HEADER);
}

// Initialize logging into file
const logger = new Console({
	stdout: fs.createWriteStream(ACTIVITY_LOG_DIR, { flags: "a" }),
	stderr: fs.createWriteStream(ERROR_LOG_DIR, { flags: "a" }),
});

/**
 * The `ActivityLog` function generates a log of the request and response made if the request was sucessful.
 * @param {number} userId userId from the context
 * @param {string} activity Activity of logging record
 * @param {string} note Note(s) to be added in the log
 * @returns log statements in the Activity_Log.txt
 */
export function ActivityLog(userId, activity, note = "") {
	// Creates a log files for general logging
	let timestamp = new Date().toLocaleString("en-US", {
		timeZone: "Asia/Singapore",
	});
	logger.log(
		`\
[Request from: ${userId}]
[Timestamp: ${timestamp}]
Activity: ${activity}
Note: ${note}

${"=".repeat(30)}
`
	);
}

/**
 * The `ErrorLog` function generates a error log of the request and response made if the request was unsucessful.
 * @param {number} userId userId from the context
 * @param {object} err Error generated from interacting with bot
 * @param {string} note Note(s) to be added in the log
 * @returns log statements in the Error_Log.txt
 */
export function ErrorLog(userId, err, note = "") {
	// Creates a log files for error logging
	let timestamp = new Date().toLocaleString("en-US", {
		timeZone: "Asia/Singapore",
	});

	let errorMessage;
	// Error handling for error logging
	if (!err) {
		errorMessage = "No error object parsed.";
	} else {
		errorMessage = JSON.stringify(err);
	}

	logger.error(
		`\
[Request from: ${userId}]
[Timestamp: ${timestamp}]
Note: ${note}
Error: ${errorMessage}

${"=".repeat(30)}
`
	);
}

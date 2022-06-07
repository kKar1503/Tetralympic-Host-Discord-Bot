import "dotenv/config";
import fs from "fs";
import { REST } from "@discordjs/rest";
import { Routes } from "discord-api-types/v9";
import path from "path";
import { fileURLToPath } from "url";
import { ActivityLog, ErrorLog } from "../../../log/Logger.js";

const { BOT_TOKEN, CLIENT_ID, GUILD_ID } = process.env;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const COMMANDS_PATH = path.join(__dirname, "..", "commands");

const commands = [];
const commandFiles = fs.readdirSync(COMMANDS_PATH).filter((file) => file.endsWith(".js"));

for (const file of commandFiles) {
	const command = await import(`../commands/${file}`);
	commands.push(command.default.data.toJSON());
}

const rest = new REST({ version: "9" }).setToken(BOT_TOKEN);

rest.put(Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID), { body: commands })
	.then(() => {
		console.log("Successfully registered application commands.");
		ActivityLog(
			CLIENT_ID,
			"Commands are successfully deployed.",
			`${commandFiles.length} commands have been deployed.`
		);
	})
	.catch((err) => {
		ErrorLog(CLIENT_ID, err, `${commandFiles.length} commands was attempted to be deployed.`);
	});

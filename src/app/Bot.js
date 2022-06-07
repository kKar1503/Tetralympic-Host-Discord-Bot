import "dotenv/config";
import { Client, Collection, Intents, Interaction, Message } from "discord.js";
import { ActivityLog, ErrorLog } from "../../../log/Logger.js";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const { CLIENT_ID, GUILD_ID, BOT_TOKEN } = process.env;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const commandsPath = path.join(__dirname, "..", "commands");

// Create new client Instance
const client = new Client({
	intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
});

// Client commands
client.commands = new Collection();
const commandFiles = fs.readdirSync(commandsPath).filter((file) => file.endsWith(".js"));

for (const file of commandFiles) {
	const command = await import(`../commands/${file}`);
	client.commands.set(command.default.data.name, command.default);
}

// Indicates client's logged on
client.once("ready", (c) => {
	console.log(`Logged in as ${c.user.tag}!`);
});
ActivityLog(CLIENT_ID, "Client logged in.", "Code: 0");

// Client interaction for command interaction
client.on("interactionCreate", async (interaction) => {
	if (!interaction.isCommand()) return;

	const command = client.commands.get(interaction.commandName);

	if (!command) return;

	try {
		await command.execute(interaction);
	} catch (err) {
		console.error(err);
		await interaction.reply({
			content: "There was an error while execuring this command!",
			ephemeral: true,
		});
	}
});

// Login in to Discord with client's Token
client.login(BOT_TOKEN);

import DiscordJs, { Intents, Interaction } from "discord.js";
import WOKCommands from "wokcommands";
import Path from "path";
import "dotenv/config";
import Configs from "./config.json";
import log from "./logger";

const { TOKEN, CLIENT_ID, GUILD_ID, MONGODB_URI } = process.env;
const { BotOwners } = Configs;

const client = new DiscordJs.Client({
	intents: [
		Intents.FLAGS.GUILDS,
		Intents.FLAGS.GUILD_MESSAGES,
		Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
	],
});

client.on("ready", async () => {
	log.info("Logged in");
	const dbOptions = {
		keepAlive: true,
	};

	const wok = new WOKCommands(client, {
		commandDir: Path.join(__dirname, "commands"),
		testServers: GUILD_ID,
		typeScript: true,
		dbOptions: dbOptions,
		mongoUri: MONGODB_URI,
		botOwners: BotOwners,
		ignoreBots: true,
		delErrMsgCooldown: 10,
		disabledDefaultCommands: ["help", "prefix", "language"],
	});

	wok.on("commandException", (command, message, error) => {
		console.log(`An exception occured when using command "${command.names[0]}"! The error is:`);
		console.error(error);
	});
});

client.on("interactionCreate", (interaction) => {
	console.log("interacted");
});

client.login(TOKEN);

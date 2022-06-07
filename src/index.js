const DiscordJs = require("discord.js");
const WOKCommands = require("wokcommands");
const path = require("path");
require("dotenv").config();

const { TOKEN, CLIENT_ID, GUILD_ID } = process.env;
const { Intents } = DiscordJs;

const client = new DiscordJs.Client({
	intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
});

client.on("ready", (c) => {
	new WOKCommands(client, {
		commandDir: path.join(__dirname, "commands"),
		testServers: GUILD_ID,
	});
});

client.login(TOKEN);

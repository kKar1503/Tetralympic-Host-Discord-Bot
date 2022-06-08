import { ICommand } from "wokcommands";
import "dotenv/config";

const { NODE_ENV } = process.env;

export default {
	category: "Utilities",
	description: "Send a message to all the mods.",

	slash: true,
	testOnly: NODE_ENV !== "production",
	guildOnly: true,

	callback: ({ message, interaction }) => {
		return "WIP";
	},
} as ICommand;

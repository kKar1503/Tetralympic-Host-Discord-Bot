import { ICommand } from "wokcommands";
import "dotenv/config";

const { NODE_ENV } = process.env;

export default {
	category: "Tetralympic",
	description: "Bind your Tetr.io account to this Discord account.",

	slash: true,
	testOnly: NODE_ENV !== "production",
	guildOnly: true,

	callback: ({ interaction }) => {
		interaction.reply("bind");
	},
} as ICommand;

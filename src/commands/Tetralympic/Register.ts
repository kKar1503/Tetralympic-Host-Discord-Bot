import { ICommand } from "wokcommands";
import "dotenv/config";

const { NODE_ENV } = process.env;

export default {
	category: "Tetralympic",
	description: "Register for one of the listed tournament.",

	slash: true,
	testOnly: NODE_ENV !== "production",
	guildOnly: true,

	callback: ({ message, interaction }) => {
		return "register";
	},
} as ICommand;

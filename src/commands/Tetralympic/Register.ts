import { ICommand } from "wokcommands";

export default {
	category: "Tetralympic",
	description: "Register for one of the listed tournament.",
	slash: true,
	testOnly: true,
	callback: ({ message, interaction }) => {
		return "register";
	},
} as ICommand;

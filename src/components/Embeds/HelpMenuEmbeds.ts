import { MessageEmbed } from "discord.js";

export const MainMenuEmbed = new MessageEmbed().setTitle(`Help Menu`).setFields([
	{
		name: "<a:emote6:958806929763885096> Tetralympic",
		value: "Tetralympic related commands",
	},
	{
		name: "🔧 Utilities",
		value: "Utility commands",
	},
]);

export const TetralympicMenuEmbed = new MessageEmbed().setTitle(`Tetralympic Commands`).setFields([
	{
		name: "/bind {Tetrio username}",
		value: "Function: Binds your Tetr.io account to your Discord account.",
	},
	{
		name: "/register",
		value: "Function: Registers for a tournament.",
	},
	{
		name: "/whois {Tetrio username}",
		value: "Function: Who binded to this Tetr.io account.",
	},
]);

export const UtilitiesMenuEmbed = new MessageEmbed().setTitle(`Utilities Command`).setFields([
	{
		name: "/help",
		value: "Function: Displays the help menu.",
	},
	{
		name: "/messagemod {Message}",
		value: "Function: Report an issue to the mods.",
	},
]);

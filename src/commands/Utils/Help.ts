import { ButtonInteraction, MessageComponentInteraction } from "discord.js";
import { ICommand } from "wokcommands";
import {
	CommandMenuActionRow,
	MainMenuActionRow,
	MainMenuEmbed,
	TetralympicMenuEmbed,
	UtilitiesMenuEmbed,
	HelpMenuCustomIds,
} from "../../components";
import "dotenv/config";

const { NODE_ENV } = process.env;

export default {
	category: "Utilities",
	description: "List of commands available in the bot.",

	slash: true,
	testOnly: NODE_ENV !== "production",
	guildOnly: true,

	callback: async ({ interaction: messageInteraction, channel }) => {
		await messageInteraction.reply({
			embeds: [MainMenuEmbed],
			components: [MainMenuActionRow],
			ephemeral: true,
		});

		const filter = (btnInt: MessageComponentInteraction) => {
			return messageInteraction.user.id === btnInt.user.id;
		};

		const collector = channel.createMessageComponentCollector({
			max: 20,
			time: 1000 * 60,
			filter,
		});

		collector.on("collect", async (buttonInteraction: ButtonInteraction) => {
			switch (buttonInteraction.customId) {
				case HelpMenuCustomIds.TETRALYMPIC:
					await buttonInteraction.update({
						embeds: [TetralympicMenuEmbed],
						components: [CommandMenuActionRow],
					});
					break;

				case HelpMenuCustomIds.UTILITIES:
					await buttonInteraction.update({
						embeds: [UtilitiesMenuEmbed],
						components: [CommandMenuActionRow],
					});
					break;

				case HelpMenuCustomIds.RETURN:
					await buttonInteraction.update({
						embeds: [MainMenuEmbed],
						components: [MainMenuActionRow],
					});
					break;
			}
		});

		collector.on("end", (collection) => {
			collection.forEach((interaction) => {
				console.log(interaction.customId);
			});
			messageInteraction.editReply({ components: [] });
		});
	},
} as ICommand;

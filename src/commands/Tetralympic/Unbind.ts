import { ICommand } from "wokcommands";
import "dotenv/config";
import { TetralympicAPI } from "../../api";
import log from "../../logger";

const { NODE_ENV } = process.env;

export default {
	category: "Tetralympic",
	description: "Unbind your Tetr.io account from this Discord account.",

	slash: true,
	testOnly: NODE_ENV !== "production",
	guildOnly: true,

	callback: async ({ interaction, args }) => {
		log.info(`${interaction.user.id} used Unbind`);

		await interaction.deferReply({
			ephemeral: false,
		});

		let Api = new TetralympicAPI();
		const { id } = interaction.user;

		let unbinded;
		try {
			unbinded = await Api.unbind(id);
		} catch (e: any) {
			log.info(`${interaction.user.id} Unbind => Failed API`);
			log.info(e);
			await interaction.editReply({
				content: e,
			});
			return;
		}
		log.info(`${interaction.user.id} Unbind => returned from API`);
		if (unbinded) {
			log.info(`${interaction.user.id} Unbind => returned from API => Unbinded`);
			await interaction.editReply({
				content: `Successfully unbinded your Tetr.io`,
			});
		} else {
			log.info(`${interaction.user.id} Unbind => returned from API => Not unbinded`);
			await interaction.editReply({
				content: `Failed to unbind`,
			});
		}
	},
} as ICommand;

import { ICommand } from "wokcommands";
import "dotenv/config";
import { TetralympicAPI } from "../../api";
import log from "../../logger";

const { NODE_ENV } = process.env;

export default {
	category: "Utils",
	description: "Finds out the person who binded .",

	slash: true,
	testOnly: NODE_ENV !== "production",
	guildOnly: true,

	options: [
		{
			name: "tetrio",
			description: "Tetr.io username",
			required: true,
			type: "STRING",
		},
	],

	callback: async ({ interaction, args }) => {
		const tetrioUsername = args[0].toLowerCase();
		log.info(`${interaction.user.id} used WhoIs ${tetrioUsername}`);

		await interaction.deferReply({
			ephemeral: false,
		});

		let Api = new TetralympicAPI();

		Api.whoIs(tetrioUsername)
			.then(async (response) => {
				log.info(
					`${interaction.user.id} => WhoIs ${tetrioUsername} => Found ${response.username}\#${response.discriminator}`
				);
				await interaction.editReply({
					content: `\`${tetrioUsername}\` is bound to \`${response.username}\#${response.discriminator}\``,
				});
			})
			.catch(async (e) => {
				log.info(`${interaction.user.id} => WhoIs ${tetrioUsername} => Not Found`);
				await interaction.editReply({
					content: `\`${tetrioUsername}\` is not bound to anyone.`,
				});
			});
	},
} as ICommand;

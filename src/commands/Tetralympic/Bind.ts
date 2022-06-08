import { ICommand } from "wokcommands";
import "dotenv/config";
import { TetralympicAPI } from "../../api";

const { NODE_ENV } = process.env;

export default {
	category: "Tetralympic",
	description: "Bind your Tetr.io account to this Discord account.",

	slash: true,
	testOnly: NODE_ENV !== "production",
	guildOnly: true,

	options: [
		{
			name: "tetrio",
			description: "Your Tetr.io username",
			required: true,
			type: "STRING",
		},
	],

	callback: async ({ interaction, args }) => {
		const tetrioUsername = args[0];

		await interaction.deferReply({
			ephemeral: false,
		});

		let Api = new TetralympicAPI();
		const { id, username, discriminator } = interaction.user;

		let insertDiscord = await Api.insertDiscord(id, username, discriminator);
		let insertTetrio = await Api.insertTetrio(tetrioUsername);

		if (insertDiscord) {
			Api.whoIs(tetrioUsername)
				.then(async (response) => {
					await interaction.editReply({
						content: "This Tetrio username is bound to another user.",
					});
				})
				.catch(async (e) => {
					let bindable = await Api.bindTetrio(id, tetrioUsername);
					if (bindable) {
						await interaction.editReply({
							content: `You are now bound to ${tetrioUsername}`,
						});
					} else {
						await interaction.editReply({
							content: "This Tetrio username is bound to another user.",
						});
					}
				});
		} else {
			let discordResponse = await Api.getDiscord(id);
			let discordUser = discordResponse.data[0];
			if (discordUser.fk_tetrio_id === null) {
				let bindable = await Api.bindTetrio(id, tetrioUsername);
				if (bindable) {
					await interaction.editReply({
						content: `You are now bound to ${tetrioUsername}`,
					});
				} else {
					await interaction.editReply({
						content: "This Tetrio username is bound to another user.",
					});
				}
			} else {
				await interaction.editReply({
					content: "You are already bound to a Tetr.io Account.",
				});
			}
		}
	},
} as ICommand;

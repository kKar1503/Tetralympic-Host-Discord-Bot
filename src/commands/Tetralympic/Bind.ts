import { ICommand } from "wokcommands";
import "dotenv/config";
import { TetralympicAPI } from "../../api";
import log from "../../logger";

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
		const tetrioUsername = args[0].toLowerCase();
		log.info(`${interaction.user.id} used Bind ${tetrioUsername}`);

		await interaction.deferReply({
			ephemeral: false,
		});

		let Api = new TetralympicAPI();
		const { id, username, discriminator } = interaction.user;

		let insertDiscord = await Api.insertDiscord(id, username, discriminator);
		try {
			await Api.insertTetrio(tetrioUsername);
		} catch (e: any) {
			if (e.status !== 422) {
				await interaction.editReply({
					content: e.data.message!,
				});
				return;
			}
		}

		if (insertDiscord) {
			log.info(`${interaction.user.id} => Bind => insertDiscord: ${insertDiscord}`);
			Api.whoIs(tetrioUsername)
				.then(async (response) => {
					log.info(response);
					log.info(
						`${interaction.user.id} => Bind => insertDiscord: ${insertDiscord} => Bound by others`
					);
					if (response.id === id) {
						await interaction.editReply({
							content: "You are already bound to this Tetrio username.",
						});
					} else {
						await interaction.editReply({
							content: "This Tetrio username is bound to another user.",
						});
					}
				})
				.catch(async (e) => {
					log.info(e);
					let bindable = await Api.bindTetrio(id, tetrioUsername);
					if (bindable) {
						log.info(
							`${interaction.user.id} => Bind => insertDiscord: ${insertDiscord} => Binded ${tetrioUsername}`
						);
						await interaction.editReply({
							content: `You are now bound to ${tetrioUsername}`,
						});
					} else {
						log.info(
							`${interaction.user.id} => Bind => insertDiscord: ${insertDiscord} => Bindable: ${bindable} => Bound by others`
						);
						await interaction.editReply({
							content: "This Tetrio username is bound to another user.",
						});
					}
				});
		} else {
			log.info(`${interaction.user.id} => Bind => insertDiscord: ${insertDiscord}`);
			Api.whoIs(tetrioUsername)
				.then(async (response) => {
					log.info(response);
					log.info(
						`${interaction.user.id} => Bind => insertDiscord: ${insertDiscord} => Bound by others`
					);
					if (response.id === id) {
						await interaction.editReply({
							content: "You are already bound to this Tetrio username.",
						});
					} else {
						await interaction.editReply({
							content: "This Tetrio username is bound to another user.",
						});
					}
				})
				.catch(async (e) => {
					let discordResponse = await Api.getDiscord(id);
					let discordUser = discordResponse.data[0];
					if (discordUser.fk_tetrio_id === null) {
						log.info(
							`${interaction.user.id} => Bind => insertDiscord: ${insertDiscord} => FK: ${discordUser.fk_tetrio_id}`
						);
						let bindable = await Api.bindTetrio(id, tetrioUsername);
						if (bindable) {
							log.info(
								`${interaction.user.id} => Bind => insertDiscord: ${insertDiscord} => FK: ${discordUser.fk_tetrio_id} => Binded to ${tetrioUsername}`
							);
							await interaction.editReply({
								content: `You are now bound to ${tetrioUsername}`,
							});
						} else {
							log.info(
								`${interaction.user.id} => Bind => insertDiscord: ${insertDiscord} => FK: ${discordUser.fk_tetrio_id} => Bindable: ${bindable} => Bound by others`
							);
							await interaction.editReply({
								content: "This Tetrio username is bound to another user.",
							});
						}
					} else {
						log.info(
							`${interaction.user.id} => Bind => insertDiscord: ${insertDiscord} => FK: ${discordUser.fk_tetrio_id} => Bound already`
						);
						await interaction.editReply({
							content: "You are already bound to a Tetr.io Account.",
						});
					}
				});
		}
	},
} as ICommand;

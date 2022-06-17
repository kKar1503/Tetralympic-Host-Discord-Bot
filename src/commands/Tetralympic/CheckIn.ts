import { ICommand } from "wokcommands";
import "dotenv/config";
import { TetralympicAPI } from "../../api";
import log from "../../logger";

const { NODE_ENV } = process.env;

export default {
	category: "Tetralympic",
	description: "Check in for currently active tournament.",

	slash: true,
	testOnly: NODE_ENV !== "production",

	guildOnly: true,
	callback: async ({ interaction }) => {
		log.info(`${interaction.user.id} used Checkin`);
		await interaction.deferReply({
			ephemeral: false,
		});

		let Api = new TetralympicAPI();
		const { id } = interaction.user;

		Api.getDiscord(id)
			.then(async (discordResponse) => {
				log.info(`${interaction.user.id} => Checkin => GetDiscord`);
				let discordUser = discordResponse.data[0];
				if (discordUser.fk_tetrio_id === null) {
					log.info(`${interaction.user.id} => Checkin => GetDiscord => Not bound`);
					await interaction.editReply({
						content: `You are not registered.`,
					});
				} else {
					log.info(`${interaction.user.id} => Checkin => GetDiscord => Bound`);
					Api.checkin(discordUser.fk_tetrio_id)
						.then(async (response) => {
							if (response.data.data.changedRows === 1) {
								log.info(
									`${interaction.user.id} => Checkin => GetDiscord => Bound => Success`
								);
								await interaction.editReply({
									content: `You are checked in.`,
								});
							} else {
								log.info(
									`${interaction.user.id} => Checkin => GetDiscord => Bound => Unknown error`
								);
								await interaction.editReply({
									content: `An unknown error has occured.`,
								});
							}
						})
						.catch(async (e) => {
							if (e === 404) {
								log.info(
									`${interaction.user.id} => Checkin => GetDiscord => Bound => Not in Registered List`
								);
								await interaction.editReply({
									content: `You are not registered.`,
								});
							} else if (e === 422) {
								log.info(
									`${interaction.user.id} => Checkin => GetDiscord => Bound => Already checked in`
								);
								await interaction.editReply({
									content: `You are already checked in.`,
								});
							} else {
								log.info(
									`${interaction.user.id} => Checkin => GetDiscord => Bound => Unknown error`
								);
								await interaction.editReply({
									content: `An unknown error has occured.`,
								});
							}
						});
				}
			})
			.catch(async (e) => {
				if (e.response.status === 404) {
					await interaction.editReply({
						content: `You are not registered.`,
					});
				}
			});
	},
} as ICommand;

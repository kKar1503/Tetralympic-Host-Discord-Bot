import { ICommand } from "wokcommands";
import "dotenv/config";
import { TetralympicAPI } from "../../api";
import {
	Client,
	GuildMember,
	MessageActionRow,
	MessageSelectMenu,
	MessageSelectOptionData,
} from "discord.js";
import moment from "moment";
import log from "../../logger";

const { NODE_ENV } = process.env;

export default {
	category: "Tetralympic",
	description: "Register for one of the listed tournament.",

	slash: true,
	testOnly: NODE_ENV !== "production",
	guildOnly: true,

	init: (client: Client) => {
		client.on("interactionCreate", async (interaction) => {
			if (!interaction.isSelectMenu()) {
				return;
			}
			log.info(`${interaction.user.id} => Register => Selected`);
			let Api = new TetralympicAPI();

			const { customId, values, member } = interaction;

			let discordResponse = await Api.getDiscord(member?.user.id!);
			let discordUser = discordResponse.data[0];
			log.info(`${interaction.user.id} => Register => Selected => Found Discord`);
			if (customId === "competition" && member instanceof GuildMember) {
				log.info(
					`${interaction.user.id} => Register => Selected => Found Discord => Ready to Register`
				);
				Api.register(discordUser.fk_tetrio_id, values[0])
					.then(async (response) => {
						log.info(
							`${interaction.user.id} => Register => Selected => Found Discord => Registered`
						);
						log.info(response);
						await interaction.reply({
							ephemeral: false,
							content: `<@${interaction.user.id}>, you have successfully registered for Tetralympic Singapore.`,
						});
					})
					.catch(async (e) => {
						log.info(
							`${interaction.user.id} => Register => Selected => Found Discord => Register failed`
						);
						log.info(e);
						await interaction.reply({
							ephemeral: true,
							content: "Your registration failed!\nError: " + e.message,
						});
					});
			}
		});
	},

	callback: async ({ interaction }) => {
		log.info(`${interaction.user.id} used Register`);
		await interaction.deferReply({
			ephemeral: true,
		});

		let Api = new TetralympicAPI();
		const { id } = interaction.user;

		Api.getDiscord(id)
			.then(async (discordResponse) => {
				log.info(`${interaction.user.id} => Register => GetDiscord`);
				let discordUser = discordResponse.data[0];
				if (discordUser.fk_tetrio_id === null) {
					log.info(`${interaction.user.id} => Register => GetDiscord => Not bound`);
					await interaction.editReply({
						content: `Please bind your account using \`/bind <username>\` first.`,
					});
				} else {
					log.info(`${interaction.user.id} => Register => GetDiscord => Bound`);
					let tetrioUser = await Api.getTetrioById(discordUser.fk_tetrio_id);
					let competitionList = await Api.getCompetitions();

					log.info(
						`${interaction.user.id} => Register => GetDiscord => Bound => Tetrio: ${discordUser.fk_tetrio_id} + GetCompetition`
					);
					const options: MessageSelectOptionData[] = [];
					for (let competition of competitionList.data) {
						options.push({
							label: `${competition.name} ${
								competition.rank_lower_limit !== null ||
								competition.rank_upper_limit !== null
									? "("
									: ""
							}${
								competition.rank_lower_limit !== null
									? competition.rank_lower_limit + " < "
									: ""
							}${
								competition.rank_lower_limit !== null ||
								competition.rank_upper_limit !== null
									? "rank"
									: ""
							}${
								competition.rank_upper_limit !== null
									? " < " + competition.rank_upper_limit
									: " "
							}${
								competition.rank_lower_limit !== null ||
								competition.rank_upper_limit !== null
									? ")"
									: ""
							}`,
							value: competition.id.toString(),
							description: `Event Date: ${moment(
								new Date(competition.event_date)
							).format("MMMM D YYYY, h a [GMT] Z")}`,
						});
					}

					let row = new MessageActionRow().addComponents(
						new MessageSelectMenu()
							.setCustomId("competition")
							.setPlaceholder("Choose a competition")
							.addOptions(options)
							.setMinValues(1)
							.setMaxValues(1)
					);
					log.info(
						`${interaction.user.id} => Register => GetDiscord => Bound => Tetrio: ${discordUser.fk_tetrio_id} + GetCompetition => SelectMenu Created`
					);
					await interaction.editReply({
						content: `Please choose a competition to particpate.`,
						components: [row],
					});
				}
			})
			.catch(async (e) => {
				if (e.response.status === 404) {
					await interaction.editReply({
						content: `Please bind your account using \`/bind <username>\` first.`,
					});
				}
			});
	},
} as ICommand;

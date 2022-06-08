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

			let Api = new TetralympicAPI();

			const { customId, values, member } = interaction;

			let discordResponse = await Api.getDiscord(member?.user.id!);
			let discordUser = discordResponse.data[0];

			if (customId === "competition" && member instanceof GuildMember) {
				Api.register(discordUser.fk_tetrio_id, values[0])
					.then(async (response) => {
						await interaction.reply({
							ephemeral: true,
							content: "You have successfully registered.",
						});
					})
					.catch(async (e) => {
						await interaction.reply({
							ephemeral: true,
							content: "Your registration failed!\nError: " + e.message,
						});
					});
			}
		});
	},

	callback: async ({ message, interaction }) => {
		await interaction.deferReply({
			ephemeral: true,
		});

		let Api = new TetralympicAPI();
		const { id } = interaction.user;

		let discordResponse = await Api.getDiscord(id);
		let discordUser = discordResponse.data[0];
		if (discordUser.fk_tetrio_id === null) {
			await interaction.editReply({
				content: `Please bind your account using \`/bind <username>\` first.`,
			});
		} else {
			let tetrioUser = await Api.getTetrioById(discordUser.fk_tetrio_id);
			let competitionList = await Api.getCompetitions();

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
					description: `Event Date: ${moment(new Date(competition.event_date)).format(
						"MMMM D YYYY, h a [GMT] Z"
					)}`,
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

			await interaction.editReply({
				content: `Please choose a competition to particpate.`,
				components: [row],
			});
		}
	},
} as ICommand;

import { ICommand } from "wokcommands";
import "dotenv/config";
import { TetralympicAPI } from "../../api";
import log from "../../logger";
import {
	Client,
	Interaction,
	MessageActionRow,
	Modal,
	ModalActionRowComponent,
	TextInputComponent,
} from "discord.js";

const { NODE_ENV } = process.env;

export default {
	category: "Verify",
	description: "Verifies mobile number (for Tetralympic Singapore)",

	slash: true,
	testOnly: NODE_ENV !== "production",
	guildOnly: true,

	init: async (client: Client) => {
		client.on("interactionCreate", async (interaction: Interaction) => {
			if (!interaction.isModalSubmit()) return;
			const username = interaction.fields.getTextInputValue("username");
			const phoneStr = interaction.fields.getTextInputValue("phone");
			const phone = parseInt(phoneStr);
			if (
				isNaN(phone) ||
				phoneStr.length != 8 ||
				(phoneStr[0] !== "8" && phoneStr[0] !== "9")
			) {
				await interaction.reply({
					content: `Input is not a valid Singapore phone number.`,
					ephemeral: true,
				});
				return;
			}
			let Api = new TetralympicAPI();
			Api.verify(username, phone)
				.then(async (response) => {
					if (response.data.affectedRows === 1)
						await interaction.reply({
							content:
								"Submitted, please wait an SMS to be sent to you for verification.",
							ephemeral: true,
						});
					else {
						await interaction.reply({
							content: "Something went wrong! Contant mods.",
							ephemeral: false,
						});
					}
				})
				.catch(async (e) => {
					if (e.response.status === 404 || e.response.status === 422)
						await interaction.reply({
							content: e.response.data.message,
							ephemeral: true,
						});
					else {
						await interaction.reply({
							content:
								"Please check your inputs or whether you have binded using `/bind`.",
							ephemeral: true,
						});
					}
				});
		});
	},

	callback: async ({ interaction, args, client }) => {
		log.info(`${interaction.user.id} used Verify`);

		const modal = new Modal().setCustomId("modal").setTitle("Mobile Number Verification");

		const usernameInput = new TextInputComponent()
			.setCustomId("username")
			.setLabel("TETR.IO Username")
			.setStyle("SHORT")
			.setPlaceholder("TETR.IO Username here")
			.setRequired(true);

		const phoneInput = new TextInputComponent()
			.setCustomId("phone")
			.setLabel("Singapore Phone Number")
			.setStyle("SHORT")
			.setPlaceholder("81234567")
			.setRequired(true);

		const usernameActionRow = new MessageActionRow<ModalActionRowComponent>().addComponents(
			usernameInput
		);
		const phoneActionRow = new MessageActionRow<ModalActionRowComponent>().addComponents(
			phoneInput
		);

		modal.addComponents(usernameActionRow, phoneActionRow);

		await interaction.showModal(modal);
	},
} as ICommand;

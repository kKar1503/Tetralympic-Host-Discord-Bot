// Require discordjs/builders for building slash commands
import { SlashCommandBuilder } from "@discordjs/builders";

const Register = {
	data: new SlashCommandBuilder()
		.setName("register")
		.setDescription("Register for event.")
		.addStringOption((option) =>
			option.setName("username").setDescription("TETR.IO Username").setRequired(true)
		),
	async execute(interaction) {
		await interaction.reply({
			content: `🏓 Pong!`,
			ephemeral: true,
		});
		const resultMessage = await interaction.fetchReply();
		// console.log(interaction);
		const ping = resultMessage.createdTimestamp - interaction.createdTimestamp;
		await interaction.followUp({
			content: `Bot Latency: ${ping}ms`,
			ephemeral: true,
		});
	},
};

export default Register;

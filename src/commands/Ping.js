// Require discordjs/builders for building slash commands
import { SlashCommandBuilder } from "@discordjs/builders";

const Ping = {
	data: new SlashCommandBuilder().setName("ping").setDescription("Pings the bot."),
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

export default Ping;

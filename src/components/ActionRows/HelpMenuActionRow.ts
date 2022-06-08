import { MessageActionRow, MessageButton } from "discord.js";

export const HelpMenuCustomIds = {
	TETRALYMPIC: "tetralympic",
	UTILITIES: "utilities",
	RETURN: "return",
};

export const MainMenuActionRow = new MessageActionRow()
	.addComponents(
		new MessageButton()
			.setCustomId("tetralympic")
			.setEmoji("<a:emote6:958806929763885096>")
			.setStyle("PRIMARY")
	)
	.addComponents(new MessageButton().setCustomId("utilities").setEmoji("🔧").setStyle("PRIMARY"));

export const CommandMenuActionRow = new MessageActionRow().addComponents(
	new MessageButton().setCustomId("return").setEmoji("🚪").setStyle("PRIMARY")
);

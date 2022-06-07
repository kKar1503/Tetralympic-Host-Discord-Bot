module.exports = {
	category: "Tetralympic",
	description: "Bind your Tetr.io account to this Discord account.",
	slash: true,
	testOnly: true,
	callback: ({ message, interaction }) => {
		return "bind";
	},
};

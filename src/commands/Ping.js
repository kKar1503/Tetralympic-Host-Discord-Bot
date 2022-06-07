module.exports = {
	category: "Testing",
	description: "Replies with pong",
	slash: true,
	testOnly: true,
	callback: ({ message, interaction }) => {
		return "pong";
	},
};

const { AttachmentBuilder, SlashCommandBuilder } = require("discord.js");
const { openai } = require("../openai.config.js");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("image")
		.setDescription("Search for an image.")
		.addStringOption((option) =>
			option
				.setName("keyword")
				.setDescription("The keyword to search for.")
				.setRequired(true)
		),
	async execute(interaction) {
		const keyword = interaction.options.getString("keyword");
		await interaction.deferReply();
		const response = await openai.createImage({
			prompt: keyword,
			n: 1,
			size: "1024x1024",
		});
		const attachment = new AttachmentBuilder(response.data.data[0].url, {
			name: `${keyword}.png`,
		});
		await interaction.editReply({
			files: [attachment],
		});
	},
};

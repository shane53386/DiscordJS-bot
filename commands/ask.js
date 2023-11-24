const { AttachmentBuilder, SlashCommandBuilder } = require("discord.js");
const { openai } = require("../openai.config.js");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("ask")
		.setDescription("Ask a question.")
		.addStringOption((option) =>
			option
				.setName("prompt")
				.setDescription("The question to ask.")
				.setRequired(true)
		),
	async execute(interaction) {
		const prompt = interaction.options.getString("prompt");
		await interaction.deferReply();
		const response = await openai.createCompletion({
			model: "text-davinci-002",
			prompt,
			temperature: 0.7,
			max_tokens: 256,
			top_p: 1,
			frequency_penalty: 0,
			presence_penalty: 0,
		});
		await interaction.editReply(response.data.choices[0].text);
	},
};

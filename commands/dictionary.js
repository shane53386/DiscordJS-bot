const { EmbedBuilder, SlashCommandBuilder } = require("discord.js");
const { request } = require("undici");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("translate")
		.setDescription("Translate a word into English.")
		.addStringOption((option) =>
			option
				.setName("term")
				.setDescription("The word to translate.")
				.setRequired(true)
		),
	async execute(interaction) {
		const term = interaction.options.getString("term");
		const query = new URLSearchParams({ term });

		const response = await request(
			`https://api.urbandictionary.com/v0/define?${query}`
		);

		const {
			list: [answer],
		} = await response.body.json();
		const trim = (str, max) =>
			str.length > max ? `${str.slice(0, max - 3)}...` : str;
		const embed = new EmbedBuilder()
			.setColor(0xefff00)
			.setTitle(answer.word)
			.setThumbnail(
				"https://upload.wikimedia.org/wikipedia/commons/thumb/f/f0/Urban_Dictionary_logo.svg/512px-Urban_Dictionary_logo.svg.png?20180302232617"
			)
			.setURL(answer.permalink)
			.addFields(
				{ name: "Definition", value: trim(answer.definition, 1024) },
				{ name: "Example", value: trim(answer.example, 1024) },
				{
					name: "Rating",
					value: `${answer.thumbs_up} thumbs up. ${answer.thumbs_down} thumbs down.`,
				}
			);
		await interaction.reply({ embeds: [embed] });
	},
};

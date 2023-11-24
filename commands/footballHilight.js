const { EmbedBuilder, SlashCommandBuilder } = require("discord.js");
const { request } = require("undici");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("highlight")
		.setDescription("Get the highlight of the match.")
		.addStringOption((option) =>
			option
				.setName("league")
				.setDescription("The league of the match.")
				.setRequired(true)
				.addChoices(
					{
						name: "Premier League",
						value: "ENGLAND: Premier League",
					},
					{ name: "La Liga", value: "SPAIN: La Liga" },
					{ name: "Serie A", value: "ITALY: Serie A" },
					{ name: "Bundesliga", value: "GERMANY: Bundesliga" },
					{ name: "Ligue 1", value: "FRANCE: Ligue 1" }
				)
		),
	async execute(interaction) {
		const league = interaction.options.getString("league");
		const data = await request(
			`https://www.scorebat.com/video-api/v3/feed/?token=${process.env.SCOREBAT_KEY}`
		).then((res) => (res.statusCode == 200 ? res.body.json() : null));
		const filteredData = data.response.filter(
			(s) => s.competition === league
		);

		const embed = new EmbedBuilder()
			.setTitle("Football Highlights")
			.addFields(
				filteredData.map((match) => {
					const videoEmbed = match.videos.pop().embed;
					const startIndex = videoEmbed.indexOf("src") + 5;
					const endIndex = videoEmbed.indexOf("frameborder") - 2;
					const videoUrl = videoEmbed.substring(startIndex, endIndex);
					return {
						name: `${match.title}`,
						value: `${videoUrl}`,
						inline: false,
					};
				})
			)
			.setColor("#0099ff")
			.setTimestamp();

		await interaction.reply({ embeds: [embed] });
	},
};

const { EmbedBuilder, SlashCommandBuilder } = require("discord.js");
const { request } = require("undici");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("score")
		.setDescription("Get the score of a football match.")
		.addStringOption((option) =>
			option
				.setName("league")
				.setDescription("The league of the match.")
				.setRequired(true)
				.addChoices(
					{ name: "Premier League", value: "soccer_epl" },
					{ name: "La Liga", value: "soccer_spain_la_liga" },
					{ name: "Serie A", value: "soccer_italy_serie_a" },
					{ name: "Bundesliga", value: "soccer_germany_bundesliga" },
					{ name: "Ligue 1", value: "soccer_france_ligue_one" }
				)
		),
	async execute(interaction) {
		const league = interaction.options.getString("league");
		const data = await request(
			`https://odds.p.rapidapi.com/v4/sports/${league}/scores?daysFrom=3`,
			{
				headers: {
					"x-rapidapi-key": process.env.FOOTBALL_KEY,
					"x-rapidapi-host": "odds.p.rapidapi.com",
					useQueryString: true,
				},
			}
		).then((res) => res.body.json());
		const filteredData = data.filter((s) => s.completed);

		console.log(filteredData);

		const embed = new EmbedBuilder()
			.setTitle("Football Scores")
			.addFields(
				filteredData.map(({ scores }) => {
					// console.log(s);
					return {
						name: `${scores[0].name} VS ${scores[1].name}`,
						value: `${scores[0].score} - ${scores[1].score}`,
						inline: false,
					};
				})
			)
			.setColor("#0099ff")
			.setTimestamp();

		await interaction.reply({ embeds: [embed] });
	},
};

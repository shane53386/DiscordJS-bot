const { EmbedBuilder, SlashCommandBuilder } = require("discord.js");
const QuickChart = require("quickchart-js");
const { request } = require("undici");

const chart = new QuickChart();

const handleChart = (data) => {
	return {
		type: "radar",
		data: {
			labels: [
				"HP",
				"Attack",
				"Defense",
				"Special-attack",
				"Special-defense",
				"Speed",
			],
			datasets: [
				{
					data,
					borderWidth: 1,
					pointBackgroundColor: "orange",
					borderColor: "orange",
					backgroundColor: "rgba(255, 165, 0, 0.2)",
				},
			],
		},
		options: {
			legend: {
				display: false,
			},
			scale: {
				angleLines: {
					display: true,
				},
				ticks: {
					suggestedMin: 0,
					suggestedMax: 100,
				},
			},
		},
	};
};

const capitalize = (s) => {
	if (typeof s !== "string") return "";
	return s.charAt(0).toUpperCase() + s.slice(1);
};

module.exports = {
	data: new SlashCommandBuilder()
		.setName("pokemon")
		.setDescription("Get information about a pokemon.")
		.addStringOption((option) =>
			option
				.setName("name")
				.setDescription("The name or ID of the pokemon.")
				.setRequired(true)
		),
	async execute(interaction) {
		const name = interaction.options.getString("name");
		const pokemon = await request(
			`https://pokeapi.co/api/v2/pokemon/${name}`
		).then((res) => (res.statusCode == 200 ? res.body.json() : null));
		if (!pokemon) {
			return interaction.reply("Pokemon not found.");
		}
		const stats = pokemon.stats.map((s) => s.base_stat);
		chart.setConfig(handleChart(stats)).setWidth(500).setHeight(500);
		const embed = new EmbedBuilder()
			.setTitle(`${capitalize(pokemon.name)}#${pokemon.id}`)
			.setColor("#ffffff")
			.addFields([
				{
					name: "Weight",
					value: (pokemon.weight / 10).toString() + " kg.",
					inline: true,
				},
				{
					name: "Height",
					value: (pokemon.height * 10).toString() + " cm.",
					inline: true,
				},
				{
					name: "Type",
					value: pokemon.types
						.map((t) => capitalize(t.type.name))
						.join(", "),
					inline: true,
				},
			])
			.setThumbnail(
				pokemon.sprites.other["official-artwork"].front_default
			)
			.setImage(chart.getUrl())
			.setTimestamp();
		await interaction.reply({ embeds: [embed] });
	},
};

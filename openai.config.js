require("dotenv").config();
const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
	apiKey: process.env.OPENAI_KEY,
	organization: process.env.OPENAI_ORG,
});
const openai = new OpenAIApi(configuration);
module.exports = { openai };

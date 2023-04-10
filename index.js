require('dotenv').config();
const {Client, GatewayIntentBits} = require('discord.js');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ],
});

const {Configuration, OpenAIApi} = require('openai')
const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
    organization: process.env.OPENAI_ORG_ID,
});

const openai = new OpenAIApi(configuration);

client.on('messageCreate', async (message) => {
    try {
        if (message.author.bot) return;

        const gptResponse = await openai.createCompletion({
            model: 'gpt-3.5-turbo',
            prompt: `ChatGPT is a friendly chatbot \n\n
            ChatGPT: Hello, how are you? \n
            ${message.author.username}: ${message.content}\n\
            ChatGPT: `,
            temperature: 0.9,
            max_tokens: 150,
            stop: ["ChatGPT:", "Matheus Carneiro:"]
        });
        message.reply(`${gptResponse.data.choices[0].text}`)
        console.log(gptResponse.data.choices[0].text)
        return
    } catch (error) {
        message.reply(`Sorry, I am having some problems. Try again later. :${error}`)
        console.log(error)
    }
})

client.login(process.env.DISCORD_TOKEN);
console.log('Bot is running...')
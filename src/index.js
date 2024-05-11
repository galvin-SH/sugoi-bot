require('dotenv').config();
const {
    EmbedBuilder,
    Colors,
} = require('discord.js');

const { recordMetrics } = require("./metrics");

const { SUGOIS_COMMAND } = require("./sugoi");

// Create a new client instance
const client = require("./client").getClient();

// Regular expression to match the target words
const SUGOI_REGEX = /sugoi|すごい|unbelievable|🦜|amazing|relink|granblue+/g;

// Log in to Discord
function botLogin() {
    try {
        client.login(process.env.DISCORD_TOKEN);
        client.on('ready', () => {
            console.log(`Logged in as ${client.user.displayName}`);
        });
    } catch (error) {
        console.error(error);
    }
}

// Main function
async function main() {
    // Log in to Discord
    await botLogin();

    try {
        // Listen for messages
        client.on('messageCreate', async (message) => {
            const matches = [
                ...message.content.toLowerCase().matchAll(SUGOI_REGEX),
            ];

            // If the message does not contain the target words, ignore it
            if (!matches || matches.length <= 0) return;

            // If the message is from a bot, ignore it
            if (message.author.bot) return;

            // Reply to the message with a message
            await message
                .reply({
                    content: '🦜すごい🦜すごい🦜アンビリーバボー🦜',
                    allowedMentions: {
                        parse: [],
                    },
                })
                // React to the message with the 🦜 emoji
                .then(() => message.react('🦜'))
                // record user metrics in metrics.json
                .then(() => {
                    recordMetrics(message);
                });
        });

        client.on("interactionCreate", async (interaction) => {
            try {
                // for now, just hardcode commands. Probably good enough.
                if (interaction.commandName == "sugois") {
                    SUGOIS_COMMAND.handler(interaction);
                }
            } catch (error) {
                console.error(error);

                if (interaction.isRepliable() && !interaction.replied) {
                    await interaction.reply({
                        ephemeral: true,
                        embeds: [
                            new EmbedBuilder()
                                .setColor(Colors.Red)
                                .setDescription("Something went wrong!"),
                        ],
                    })
                }
            }
        });
    } catch (error) {
        console.error(error);
    }
}
// Call the main function
try {
    main();
} catch (error) {
    console.error(error);
}

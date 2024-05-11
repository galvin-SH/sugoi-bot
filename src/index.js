require('dotenv').config();
const fs = require('fs');
const metrics = require('../metrics.json');
const {
    EmbedBuilder,
    Colors,
} = require('discord.js');

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

// Record user metrics in metrics.json
async function recordMetrics(message) {
    // Read the metrics object from the metrics.json file
    // If the file does not exist, create it
    if (!metrics) {
        console.error('metrics.json not found');
        fs.writeFile('./metrics.json', '{}', (err) => {
            if (err) console.error(err);
        });
    }
    // Initialize the metrics object if it doesn't exist
    if (!metrics['times sugoied']) metrics['times sugoied'] = 1;
    else metrics['times sugoied']++;
    if (!metrics['users']) metrics['users'] = [];
    // Add the user to the list of users who have been sugoied
    if (!metrics['users'].find((user) => user.id === message.author.id))
        // If the user is not in the list of users who have been sugoied
        // Add the user to the list of users who have been sugoied
        // and set the number of times they have been sugoied to 1
        metrics['users'].push({
            id: message.author.id,
            name: message.author.username,
            sugois: 1,
        });
    else {
        // If the user is in the list of users who have been sugoied
        // Increment the number of times they have been sugoied
        const user = metrics['users'].find(
            (user) => user.id === message.author.id
        );
        user.sugois++;
    }
    // Write the metrics object to the metrics.json file
    fs.writeFile('./metrics.json', JSON.stringify(metrics, null, 4), (err) => {
        if (err) console.error(err);
    });
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

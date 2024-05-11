const fs = require('fs');

// Get the metrics object from metrics.json
function getMetrics() {
    try {
        // Check if metrics.json exists
        if (!fs.existsSync('./metrics.json')) {
            console.log('metrics.json does not exist. Creating a new file...');
            // Create a new metrics.json file if it does not exist
            fs.writeFileSync('./metrics.json', '{}');
        }
        // Return the metrics object from metrics.json
        return JSON.parse(fs.readFileSync('./metrics.json'));
    } catch (error) {
        console.error(error);
    }
}

// Record user metrics in metrics.json
async function recordMetrics(message) {
    try {
        const metrics = await getMetrics();
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
        fs.writeFile(
            './metrics.json',
            JSON.stringify(metrics, null, 4),
            (err) => {
                if (err) console.error(err);
            }
        );
    } catch (error) {
        console.error(error);
    }
}

module.exports = { getMetrics, recordMetrics }

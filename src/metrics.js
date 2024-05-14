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
        // The metrics object should have the keys 'total' and 'users'
        // 'total' is the total number of times users have been sugoied
        // 'users' is an object with user ids as keys
        // and the number of times they have been sugoied as values
        if (!metrics['total']) metrics['total'] = 1;
        else metrics['total']++;
        if (!metrics['users']) metrics['users'] = new Object();

        const ids = Object.keys(metrics['users']);
        const sugois = Object.values(metrics['users']);

        // Check if the user is in the list of users who have been sugoied
        if (ids.includes(message.author.id)) {
            // Find the index of the user in the list of users who have been sugoied
            const index = ids.indexOf(message.author.id);
            // Increment the number of times the user has been sugoied
            sugois[index]++;
            // Update the user's sugois in the metrics object
            metrics['users'][message.author.id] = sugois[index];
        } else {
            // Add the user to the list of users who have been sugoied
            // and set the number of times they have been sugoied to 1
            metrics['users'][message.author.id] = 1;
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

module.exports = { getMetrics, recordMetrics };

const fs = require('fs');
const { getMetrics } = require('./metrics');

// reformat the metrics.json file to have the 'total' key instead of 'times sugoied'
async function update(metrics) {
    try {
        // If the 'times sugoied' key does not exist, return the metrics object as is
        if (!metrics['times sugoied']) return metrics;

        // Write new key 'total' with the value of the old key 'times sugoied'
        // and delete the old key
        metrics['total'] = metrics['times sugoied'];
        delete metrics['times sugoied'];

        return metrics;
    } catch (error) {
        console.error(error);
    }
}

async function reformat(metrics) {
    try {
        // If the users object is not an array, return the metrics object as is
        if (!Array.isArray(metrics.users)) return metrics;

        // Create a new metrics object
        const newMetrics = {};
        // Add the total key to the new metrics object
        newMetrics.total = metrics.total;
        // Add the users key to the new metrics object
        newMetrics.users = new Object();

        // Add the users to the new metrics object
        metrics.users.forEach((e) => {
            // Add the user id as the key and the sugois as the value
            newMetrics.users[e.id] = e.sugois;
        });

        return newMetrics;
    } catch (error) {
        console.error(error);
    }
}

async function write(metrics) {
    // Write the new metrics object to the metrics.json file
    fs.writeFile('./metrics.json', JSON.stringify(metrics, null, 4), (err) => {
        if (err) console.error(err);
    });
}

async function main() {
    // Get the metrics object
    const metrics = await getMetrics();

    // Update, reformat, and write the new metrics object to file
    const updated = await update(metrics);
    const reformatted = await reformat(updated);
    await write(reformatted);
}

main();

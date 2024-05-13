const fs = require('fs');
const { getMetrics } = require('./metrics');

// reformat the metrics.json file to have the 'total' key instead of 'times sugoied'
async function updateJSONFile() {
    try {
        // Get the metrics object from metrics.json
        const metrics = await getMetrics();

        // If the 'times sugoied' key does not exist, return
        if (!metrics['times sugoied']) return;

        // Write new key 'total' with the value of the old key 'times sugoied'
        metrics['total'] = metrics['times sugoied'];
        delete metrics['times sugoied'];

        // Rewrite the 'users' key to be the last key in the object
        const replaced = metrics['users'];
        delete metrics['users'];
        metrics['users'] = replaced;

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

updateJSONFile();

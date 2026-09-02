const express = require('express');
const cron = require('node-cron');

// !!! THIS WAS MISSING OR PLACED IN THE WRONG ORDER !!!
const app = express(); 

const PORT = process.env.PORT || 3000;
const WEBHOOK_URL = process.env.WEBHOOK_URL;

// WEB SERVER: Keeps Render awake when external monitoring pings it
app.get('/', (req, res) => {
    res.send('Bot is active and running 24/7!');
});

// Bind to 0.0.0.0 so Render can read the server port health check
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Web server listening on port ${PORT}`);
});

// DISCORD WEBHOOK LOGIC
async function sendDailyFact() {
    if (!WEBHOOK_URL) {
        console.error("CRITICAL ERROR: WEBHOOK_URL environment variable is missing!");
        return;
    }
    try {
        // Fetch a dynamic fact from a free public API
        const apiResponse = await fetch('https://jsph.pl');
        const apiData = await apiResponse.json();
        const liveFact = apiData.text;

        // Post the dynamic fact directly to your Discord Webhook
        const response = await fetch(WEBHOOK_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ content: `☀️ **Daily Fact:** ${liveFact}` })
        });

        if (response.ok) {
            console.log(`[${new Date().toISOString()}] Live fact sent to Discord!`);
        } else {
            console.error(`[Error] Discord responded with status: ${response.status}`);
        }
    } catch (error) {
        console.error("Failed to fetch or dispatch live daily webhook:", error);
    }
}

// DAILY SCHEDULE (Fires at 9:00 AM server time)
cron.schedule('0 9 * * *', () => {
    console.log('Triggering scheduled daily fact dispatch...');
    sendDailyFact();
});

console.log("Daily Fact code initialization sequence finished!");

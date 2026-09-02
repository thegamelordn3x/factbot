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
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Web server listening on port ${PORT}`);
});

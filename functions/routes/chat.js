const express = require('express');
const { GoogleGenAI } = require('@google/genai');

const router = express.Router();

const apiKey = Buffer.from('QUl6YVN5QURna2pBdjU5MjkzcUVUVVFGb3FjZC0tNXYyY25PVVM4', 'base64').toString('ascii');
const ai = new GoogleGenAI({ apiKey });

router.post('/', async (req, res) => {
  const { context, message } = req.body;

  if (!message) {
    return res.status(400).json({ error: 'Message is required' });
  }

  if (!context) {
    return res.status(400).json({ error: 'Context (llms.txt) is required' });
  }

  if (!apiKey || apiKey === 'your_gemini_api_key_here') {
    return res.json({
      text: "This is a mocked response because a real Gemini API Key was not provided. If I were a real AI, I would use the llms.txt context to answer your question: " + message
    });
  }

  try {
    const systemPrompt = `You are an AI assistant designed to answer questions strictly based on the provided llms.txt file context.
If the answer is not contained within the context, simply state that you don't have enough information.
Keep your answers helpful, concise, and formatted in markdown.

--- LLMS.TXT CONTEXT ---
${context}
------------------------
`;

    const result = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: message,
      config: {
        systemInstruction: systemPrompt
      }
    });

    res.json({ text: result.text });
  } catch (error) {
    console.error('Error generating chat response:', error.message);
    res.status(500).json({ error: 'Failed to generate response. Check backend logs.' });
  }
});

module.exports = router;

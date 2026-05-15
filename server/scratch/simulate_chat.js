const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const systemInstructionText = `You are MindWell, an empathetic AI mental wellness assistant.`;

const model = genAI.getGenerativeModel({ 
  model: "gemini-flash-latest",
  systemInstruction: systemInstructionText
});

async function simulateSendMessage() {
    const message = "I feel stressed";
    const history = [
        {
            role: 'user',
            parts: [{ text: "Hi" }]
        },
        {
            role: 'model',
            parts: [{ text: "Hello! How can I help you today?" }]
        }
    ];

    try {
        console.log("Starting chat...");
        const chatSession = model.startChat({
            history: history,
        });

        console.log("Sending message...");
        const result = await chatSession.sendMessage(message);
        const response = await result.response;
        console.log("AI Response:", response.text());
    } catch (error) {
        console.error("Error during sendMessage simulation:", error);
    }
}

simulateSendMessage();

const Chat = require('../models/Chat');
const { GoogleGenerativeAI } = require('@google/generative-ai');


const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });





const getChatHistory = async (req, res) => {
  try {
    let chat = await Chat.findOne({ userId: req.user.id });

    if (!chat) {
      chat = await Chat.create({
        userId: req.user.id,
        messages: []
      });
    }

    res.status(200).json(chat);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};





const sendMessage = async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ message: 'Message is required' });
    }

    let chat = await Chat.findOne({ userId: req.user.id });

    if (!chat) {
      chat = await Chat.create({
        userId: req.user.id,
        messages: []
      });
    }

    
    chat.messages.push({
      sender: 'user',
      content: message
    });

    
    const history = chat.messages.map(msg => ({
      role: msg.sender === 'user' ? 'user' : 'model',
      parts: [{ text: msg.content }]
    }));

    
    const systemInstruction = {
      role: 'user',
      parts: [{
        text: `You are MindWell, an empathetic AI mental wellness assistant.
Provide supportive, non-judgmental, and helpful responses.
You are NOT a therapist or doctor. You provide emotional support, CBT-based coping strategies, journaling guidance, and mindfulness tips.

Guidelines:
- Help with stress, anxiety, overthinking.
- Suggest breathing exercises, grounding techniques.
- Language: You can understand and respond in English, Hindi, and Hinglish (Hindi mixed with English). Use the language the user prefers.
- Disclaimer: Always be ready to state "I am not a substitute for professional therapy".
- Crisis Escalation: If the user shows signs of severe depression, self-harm, or hopelessness (e.g., words like "hopeless", "can't go on"), immediately respond warmly and provide this contact: "It sounds like you're going through something difficult. Please consider reaching out to iCall: 9152987821".
- Never sound robotic, always human-like, brief, and warm.`
      }]
    };

    let aiResponseContent = "I'm unable to respond right now. Please try again later.";

    try {
      if (!process.env.GEMINI_API_KEY) {
        throw new Error("Missing Gemini API key");
      }

      
      const chatSession = model.startChat({
        history: [systemInstruction, ...history],
      });

      
      const result = await chatSession.sendMessage(message);
      const response = await result.response;

      aiResponseContent = response.text();

    } catch (geminiError) {
      console.error("Gemini Error:", geminiError);
    }

    
    chat.messages.push({
      sender: 'ai',
      content: aiResponseContent
    });

    await chat.save();

    res.status(200).json(chat);

  } catch (error) {
    console.error("Server Error:", error);
    res.status(500).json({ message: error.message });
  }
};


module.exports = {
  getChatHistory,
  sendMessage,
};
const Chat = require('../models/Chat');
const { GoogleGenerativeAI } = require('@google/generative-ai');


const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const systemInstructionText = `You are MindWell, an empathetic AI mental wellness assistant.
Provide supportive, non-judgmental, and helpful responses.
You are NOT a therapist or doctor. You provide emotional support, CBT-based coping strategies, journaling guidance, mindfulness tips, and physical exercise recommendations for mental wellness.

Guidelines:
- Help with stress, anxiety, overthinking.
- Suggest breathing exercises, grounding techniques.
- Language: You can understand and respond in English, Hindi, and Hinglish (Hindi mixed with English). Use the language the user prefers.
- Disclaimer: Always be ready to state "I am not a substitute for professional therapy".
- Crisis Escalation: If the user shows signs of severe depression, self-harm, or hopelessness (e.g., words like "hopeless", "can't go on"), immediately respond warmly and provide this contact: "It sounds like you're going through something difficult. Please consider reaching out to iCall: 9152987821".
- Never sound robotic, always human-like, brief, and warm.
- Exercise Suggestions: When relevant, suggest mental health-friendly physical exercises in a clear, step-by-step or point-by-point format. Include exercises such as:
  1. Progressive Muscle Relaxation (PMR) – tense and release each muscle group slowly.
  2. Walking or Light Jogging – even 10–15 minutes outdoors can lift mood.
  3. Yoga poses for stress relief – e.g., Child's Pose, Cat-Cow, Legs Up the Wall.
  4. Stretching routine – gentle neck, shoulder, and back stretches to release tension.
  5. Jumping Jacks or Body Movement – quick bursts to release pent-up energy.
  6. Deep Breathing with movement – inhale while raising arms, exhale while lowering.
  Always present exercises in numbered steps so they are easy to follow. Keep instructions simple, friendly, and encouraging.`;

const model = genAI.getGenerativeModel({ 
  model: "gemini-2.5-flash-lite",
  systemInstruction: systemInstructionText
});





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

    const history = chat.messages.map(msg => ({
      role: msg.sender === 'user' ? 'user' : 'model',
      parts: [{ text: msg.content }]
    }));

    // Now push the current user message to DB AFTER building history for startChat
    chat.messages.push({
      sender: 'user',
      content: message
    });

    let aiResponseContent = "I'm unable to respond right now. Please try again later.";

    try {
      if (!process.env.GEMINI_API_KEY) {
        throw new Error("Missing Gemini API key in environment variables");
      }

      console.log(`Starting chat session for user ${req.user.id} with ${history.length} previous messages.`);

      const chatSession = model.startChat({
        history: history,
      });

      const result = await chatSession.sendMessage(message);
      const response = await result.response;

      if (!response || !response.text) {
        throw new Error("Invalid response received from Gemini API");
      }

      aiResponseContent = response.text();
      console.log("Gemini responded successfully.");

    } catch (geminiError) {
      console.error("Gemini API Error details:", {
        message: geminiError.message,
        stack: geminiError.stack,
        historyCount: history.length
      });
      // Fallback message is already set in aiResponseContent
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
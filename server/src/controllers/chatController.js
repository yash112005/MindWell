const Chat = require('../models/Chat');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const systemInstructionText = `
You are MindWell, an empathetic AI mental wellness assistant.

Provide supportive, calm, and non-judgmental responses.

You are NOT a therapist or doctor.
You provide emotional support, CBT-based coping strategies,
journaling guidance, mindfulness tips, and mental wellness exercises.

Guidelines:
- Help with stress, anxiety, burnout, overthinking.
- Suggest grounding exercises and breathing techniques.
- Keep responses concise, warm, and conversational.
- Never sound robotic.
- Never pretend to be a licensed therapist.
- Language: Respond in English, Hindi, or Hinglish depending on the user's language.

Crisis Handling:
If user mentions self-harm, suicide, hopelessness, or severe emotional distress,
respond supportively and encourage contacting:
iCall Helpline: 9152987821

Exercise Suggestions:
When relevant, suggest:
1. Deep breathing
2. Progressive Muscle Relaxation
3. Walking
4. Stretching
5. Yoga
6. Light movement exercises

Always explain exercises step-by-step.
`;





// =======================
// GET CHAT HISTORY
// =======================

const getChatHistory = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({
        message: 'User not authenticated'
      });
    }

    let chat = await Chat.findOne({
      userId: req.user.id
    });

    if (!chat) {
      chat = await Chat.create({
        userId: req.user.id,
        messages: []
      });
    }

    res.status(200).json(chat);

  } catch (error) {
    console.error('Get Chat Error:', error);

    res.status(500).json({
      message: 'Internal server error'
    });
  }
};






// =======================
// SEND MESSAGE
// =======================

const sendMessage = async (req, res) => {
  try {

    const { message } = req.body;

    // Validate message
    if (!message || !message.trim()) {
      return res.status(400).json({
        message: 'Message is required'
      });
    }

    // Validate user
    if (!req.user || !req.user.id) {
      return res.status(401).json({
        message: 'User not authenticated'
      });
    }

    // Find/Create chat
    let chat = await Chat.findOne({
      userId: req.user.id
    });

    if (!chat) {
      chat = await Chat.create({
        userId: req.user.id,
        messages: []
      });
    }






    // =======================
    // CRISIS DETECTION
    // =======================

    const crisisKeywords = [
      'suicide',
      'kill myself',
      'end my life',
      'hopeless',
      "can't go on",
      'self harm',
      'die',
      'want to die'
    ];

    const lowerMessage = message.toLowerCase();

    const isCrisis = crisisKeywords.some(keyword =>
      lowerMessage.includes(keyword)
    );

    if (isCrisis) {

      const crisisResponse = `
It sounds like you're going through something really difficult right now.

Please consider reaching out to iCall:
9152987821

You do not have to go through this alone.

I am not a substitute for professional therapy, but I am here to support you.
`;

      chat.messages.push({
        sender: 'user',
        content: message
      });

      chat.messages.push({
        sender: 'ai',
        content: crisisResponse
      });

      await chat.save();

      return res.status(200).json(chat);
    }







    // =======================
    // BUILD HISTORY
    // =======================

    const MAX_HISTORY = 20;

    const history = chat.messages
      .slice(-MAX_HISTORY)
      .map(msg => ({
        role: msg.sender === 'user' ? 'user' : 'model',
        parts: [{ text: msg.content }]
      }));







    // =======================
    // GEMINI
    // =======================

    let aiResponseContent =
      "I'm unable to respond right now. Please try again later.";

    try {

      if (!process.env.GEMINI_API_KEY) {
        throw new Error('Missing GEMINI_API_KEY');
      }

      console.log('Initializing Gemini...');

      const genAI = new GoogleGenerativeAI(
        process.env.GEMINI_API_KEY
      );

      const model = genAI.getGenerativeModel({
        model: 'gemini-1.5-flash',

        systemInstruction: systemInstructionText,

        generationConfig: {
          temperature: 0.7,
          topP: 0.9,
          maxOutputTokens: 300
        }
      });

      console.log(
        `Starting chat with ${history.length} previous messages`
      );

      const chatSession = model.startChat({
        history
      });

      const result = await chatSession.sendMessage(message);

      console.log('Gemini raw result received');

      const response = result.response;

      if (!response) {
        throw new Error('No response from Gemini');
      }

      aiResponseContent = response.text();

      console.log('AI Response:', aiResponseContent);

    } catch (geminiError) {

      console.error('Gemini Error:', geminiError);

      if (
        geminiError.message &&
        geminiError.message.includes('SAFETY')
      ) {

        aiResponseContent =
          "I'm sorry, I cannot respond to that request. Please try talking about it differently.";

      } else {

        aiResponseContent =
          "I'm having trouble responding right now. Please try again in a moment.";
      }
    }







    // =======================
    // SAVE MESSAGES
    // =======================

    chat.messages.push({
      sender: 'user',
      content: message
    });

    chat.messages.push({
      sender: 'ai',
      content: aiResponseContent
    });

    await chat.save();







    // =======================
    // RESPONSE
    // =======================

    return res.status(200).json(chat);

  } catch (error) {

    console.error('Server Error:', error);

    return res.status(500).json({
      message: 'Internal server error'
    });
  }
};






module.exports = {
  getChatHistory,
  sendMessage
};
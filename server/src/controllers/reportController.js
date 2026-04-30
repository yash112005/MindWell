const Report = require('../models/Report');
const Journal = require('../models/Journal');
const { GoogleGenerativeAI } = require('@google/generative-ai');


const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });





const getReport = async (req, res) => {
  try {
    const journals = await Journal.find({ userId: req.user.id })
      .sort({ date: -1 })
      .limit(7);

    if (journals.length === 0) {
      return res.status(200).json({
        message: 'No journals found to generate a report.',
        insights: 'Start writing in your journal to get personalized insights!'
      });
    }

    
    const averageMood =
      journals.reduce((acc, curr) => acc + curr.mood, 0) / journals.length;

    
    const moodDataForAI = journals.map(j => ({
      date: j.date,
      mood: j.mood,
      sentiment: j.sentiment,
      snippet: j.content.substring(0, 80)
    }));

    let insights = "Keep journaling to track your mental wellness over time.";

    try {
      if (!process.env.GEMINI_API_KEY) {
        throw new Error("Missing Gemini API key");
      }

      
      const prompt = `
You are an AI wellness analyst.

Analyze this 7-day journal data and return ONLY:
- 2 short sentences
- encouraging tone
- mention mood trend (improving / declining / stable)

Data:
${JSON.stringify(moodDataForAI)}
`;

      
      const result = await model.generateContent(prompt);
      const response = await result.response;

      insights = response.text();

    } catch (geminiError) {
      console.error('Gemini Error:', geminiError);
    }

    
    let report = await Report.findOne({ userId: req.user.id })
      .sort({ createdAt: -1 });

    if (!report) {
      report = await Report.create({
        userId: req.user.id,
        dateRange: {
          start: new Date(new Date().setDate(new Date().getDate() - 7)),
          end: new Date()
        },
        insights,
        averageMood,
        streaks: journals.length
      });
    } else {
      report.insights = insights;
      report.averageMood = averageMood;
      report.streaks = journals.length;
      await report.save();
    }

    res.status(200).json(report);

  } catch (error) {
    console.error("Server Error:", error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getReport,
};
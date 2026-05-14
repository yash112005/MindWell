const Journal = require('../models/Journal');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);




const getJournals = async (req, res) => {
  try {
    const journals = await Journal.find({ userId: req.user.id }).sort({ date: -1 });
    res.status(200).json(journals);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};




const createJournal = async (req, res) => {
  try {
    const { title, content, mood, sentiment, image, tags } = req.body;

    if (!title || !content || !mood) {
      return res.status(400).json({ message: 'Please add all required fields' });
    }

    let nlpSentiment = sentiment || 'Neutral';
    let dominantEmotion = 'neutral';
    let keyThemes = [];

    
    try {
      const nlpResponse = await fetch('http://127.0.0.1:5001/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: content })
      });
      if (nlpResponse.ok) {
        const nlpData = await nlpResponse.json();
        nlpSentiment = nlpData.sentiment.charAt(0).toUpperCase() + nlpData.sentiment.slice(1);
        dominantEmotion = nlpData.dominantEmotion;
        keyThemes = nlpData.keyThemes;
      }
    } catch (nlpErr) {
      console.error('NLP Service Error:', nlpErr.message);
      
    }

    const journal = await Journal.create({
      userId: req.user.id,
      title,
      content,
      mood,
      sentiment: nlpSentiment,
      dominantEmotion,
      keyThemes,
      image,
      tags: tags || [],
    });

    
    const crisisKeywords = ["hopeless", "can't go on", "end it", "no point", "want to disappear", "harm myself", "give up", "nobody cares", "worthless", "suicidal"];
    const contentLower = content.toLowerCase();
    const foundKeyword = crisisKeywords.find(kw => contentLower.includes(kw));
    
    if (foundKeyword || nlpSentiment === 'Negative' || dominantEmotion === 'sadness') {
      const CrisisAlert = require('../models/CrisisAlert');
      const snippetStart = Math.max(0, contentLower.indexOf(foundKeyword || contentLower) - 50);
      const snippet = content.substring(snippetStart, snippetStart + 150) + '...';
      
      const alert = await CrisisAlert.create({
        userId: req.user.id,
        type: 'journal',
        keyword: foundKeyword || 'Negative Sentiment/Emotion',
        contextSnippet: snippet
      });
      
      
      const io = req.app.get('socketio');
      if (io) {
        io.emit('crisis:new-alert', { alert, journalId: journal._id });
      }
    }

    res.status(201).json(journal);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};




const updateJournal = async (req, res) => {
  try {
    const journal = await Journal.findById(req.params.id);

    if (!journal) return res.status(404).json({ message: 'Journal not found' });
    if (journal.userId.toString() !== req.user.id)
      return res.status(401).json({ message: 'User not authorized' });

    const updatedJournal = await Journal.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json(updatedJournal);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};




const deleteJournal = async (req, res) => {
  try {
    const journal = await Journal.findById(req.params.id);

    if (!journal) return res.status(404).json({ message: 'Journal not found' });
    if (journal.userId.toString() !== req.user.id)
      return res.status(401).json({ message: 'User not authorized' });

    await journal.deleteOne();
    res.status(200).json({ id: req.params.id });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};




const getDashboardStats = async (req, res) => {
  try {
    const userId = req.user.id;

    
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const allEntries = await Journal.find({
      userId,
      date: { $gte: thirtyDaysAgo },
    }).sort({ date: 1 });

    const totalEntries = await Journal.countDocuments({ userId });

    
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const weeklyMoodMap = {};
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);

    
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = days[d.getDay()];
      weeklyMoodMap[key] = { day: key, score: null, count: 0 };
    }

    allEntries
      .filter((e) => new Date(e.date) >= sevenDaysAgo)
      .forEach((e) => {
        const key = days[new Date(e.date).getDay()];
        if (weeklyMoodMap[key]) {
          const prev = weeklyMoodMap[key];
          weeklyMoodMap[key] = {
            day: key,
            score: prev.count === 0 ? e.mood : Math.round((prev.score * prev.count + e.mood) / (prev.count + 1)),
            count: prev.count + 1,
          };
        }
      });

    const weeklyMood = Object.values(weeklyMoodMap).map(({ day, score }) => ({
      day,
      score: score !== null ? score : 0,
    }));

    
    const heatmap = allEntries.map((e) => ({
      date: new Date(e.date).toISOString().split('T')[0],
      mood: e.mood,
      sentiment: e.sentiment,
    }));

    
    const uniqueDates = [
      ...new Set(
        (await Journal.find({ userId }).sort({ date: -1 }).select('date'))
          .map((e) => new Date(e.date).toISOString().split('T')[0])
      ),
    ].sort((a, b) => new Date(b) - new Date(a));

    let streak = 0;
    let cursor = new Date();
    cursor.setHours(0, 0, 0, 0);

    for (const dateStr of uniqueDates) {
      const d = new Date(dateStr);
      const diff = Math.round((cursor - d) / (1000 * 60 * 60 * 24));
      if (diff <= 1) {
        streak++;
        cursor = d;
      } else {
        break;
      }
    }

    
    const sentimentCounts = { Positive: 0, Neutral: 0, Negative: 0, Mixed: 0 };
    const emotionCounts = { joy: 0, sadness: 0, fear: 0, anger: 0, surprise: 0, neutral: 0 };

    allEntries.forEach((e) => {
      
      const s = e.sentiment ? e.sentiment.charAt(0).toUpperCase() + e.sentiment.slice(1).toLowerCase() : 'Neutral';
      sentimentCounts[s] = (sentimentCounts[s] || 0) + 1;
      
      if (e.dominantEmotion) {
        emotionCounts[e.dominantEmotion] = (emotionCounts[e.dominantEmotion] || 0) + 1;
      }
    });

    
    let insights = 'Keep journaling consistently to unlock personalised insights about your emotional patterns.';
    let insightPattern = null;

    if (allEntries.length >= 3) {
      try {
        if (process.env.GEMINI_API_KEY) {
          const model = genAI.getGenerativeModel({ model: 'gemini-flash-latest' });

          
          const anonymousData = allEntries.map((e) => ({
            dayOfWeek: days[new Date(e.date).getDay()],
            mood: e.mood,
            sentiment: e.sentiment,
          }));

          const prompt = `
You are a wellness AI analyst. Analyze this anonymous mood data (no personal details included).

Data: ${JSON.stringify(anonymousData)}

Return ONLY a JSON object with exactly these two keys:
{
  "insight": "One specific behavioural pattern you notice (e.g. 'You tend to feel more positive on weekends'). Max 20 words.",
  "tip": "One short, calming, actionable suggestion based on the pattern. Max 20 words."
}
Return raw JSON only, no markdown.
`;
          const result = await model.generateContent(prompt);
          const raw = result.response.text().trim();
          const parsed = JSON.parse(raw);
          insights = parsed.insight || insights;
          insightPattern = parsed.tip || null;
        }
      } catch (err) {
        console.error('Gemini insight error:', err.message);
      }
    }
    // Early Identification Logic (last 14 days)
    let riskLevel = 'Normal';
    let riskRecommendation = '';
    
    const fourteenDaysAgo = new Date();
    fourteenDaysAgo.setDate(fourteenDaysAgo.getDate() - 14);
    
    const recentEntries = allEntries.filter(e => new Date(e.date) >= fourteenDaysAgo);
    const lowMoodCount = recentEntries.filter(e => e.mood < 4).length;
    const negativeSentimentCount = recentEntries.filter(e => e.sentiment && e.sentiment.toLowerCase() === 'negative').length;
    const sadnessCount = recentEntries.filter(e => e.dominantEmotion === 'sadness').length;
    const fearCount = recentEntries.filter(e => e.dominantEmotion === 'fear').length;

    if (sadnessCount >= 4 || lowMoodCount >= 4) {
      riskLevel = 'Signs of Depression';
      riskRecommendation = 'We notice you\'ve been experiencing persistent low mood. Please consider talking to a mental health professional.';
    } else if (fearCount >= 3 || (negativeSentimentCount >= 3 && fearCount >= 1)) {
      riskLevel = 'Emerging Anxiety';
      riskRecommendation = 'You seem to be carrying a lot of anxiety lately. Reaching out for professional support could be really helpful.';
    } else if (negativeSentimentCount >= 3 || lowMoodCount >= 2) {
      riskLevel = 'Early Stress';
      riskRecommendation = 'You are showing early signs of stress. Consider taking a break or trying some grounding exercises.';
    }

    res.status(200).json({
      weeklyMood,
      heatmap,
      streak,
      totalEntries,
      sentimentCounts,
      emotionCounts,
      insights,
      insightPattern,
      riskLevel,
      riskRecommendation,
    });
  } catch (error) {
    console.error('Stats error:', error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getJournals,
  createJournal,
  updateJournal,
  deleteJournal,
  getDashboardStats,
};

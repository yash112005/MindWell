// Body-Mind Sync Utility

const SYNC_DATA_KEY = 'mindwell_body_mind_sync_data';
const INSIGHTS_KEY = 'mindwell_body_mind_insights';

export const getSyncData = () => {
  const data = localStorage.getItem(SYNC_DATA_KEY);
  return data ? JSON.parse(data) : [];
};

export const saveDailySync = (syncEntry) => {
  const data = getSyncData();
  const dateStr = new Date().toISOString().split('T')[0];
  
  // Find if entry for today already exists, update it, else push
  const index = data.findIndex(d => d.date === dateStr);
  if (index !== -1) {
    data[index] = { ...data[index], ...syncEntry };
  } else {
    data.push({ date: dateStr, ...syncEntry });
  }
  
  localStorage.setItem(SYNC_DATA_KEY, JSON.stringify(data));
  runPatternEngine(data);
};

export const getInsights = () => {
  const data = localStorage.getItem(INSIGHTS_KEY);
  return data ? JSON.parse(data) : [];
};

export const runPatternEngine = (syncData) => {
  if (syncData.length < 5) return; // Need at least some data

  const insights = [];

  // Correlation 1: Poor sleep precedes mood dip 2 days later
  let sleepMoodCorrelationCount = 0;
  for (let i = 0; i < syncData.length - 2; i++) {
    const sleepDay = syncData[i];
    const moodDay = syncData[i + 2];
    
    if (sleepDay.sleepScore <= 2 && moodDay.moodScore < 4) {
      sleepMoodCorrelationCount++;
    }
  }

  if (sleepMoodCorrelationCount >= 3) {
    insights.push({
      id: 'sleep-mood-dip',
      text: "your lowest mood entries tend to follow nights of poor sleep. Want to explore this?",
      type: 'sleep',
      severity: 'info'
    });
  }

  // Correlation 2: Exercise boost
  let exerciseBoostCount = 0;
  for (let i = 0; i < syncData.length; i++) {
    if (syncData[i].exercised && syncData[i].moodScore >= 7) {
      exerciseBoostCount++;
    }
  }

  if (exerciseBoostCount >= 4) {
    insights.push({
      id: 'exercise-boost',
      text: "you consistently report a higher mood on days you exercise. It seems movement is your secret weapon!",
      type: 'exercise',
      severity: 'success'
    });
  }

  localStorage.setItem(INSIGHTS_KEY, JSON.stringify(insights));
};

export const dismissInsight = (id) => {
  const insights = getInsights().filter(i => i.id !== id);
  localStorage.setItem(INSIGHTS_KEY, JSON.stringify(insights));
};

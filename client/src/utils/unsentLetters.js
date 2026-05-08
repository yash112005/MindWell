// Unsent Letters Utility

const STORAGE_KEY = 'mindwell_unsent_letters';

// Simple Base64 "encryption" for demo
const encrypt = (text) => btoa(unescape(encodeURIComponent(text)));
const decrypt = (encoded) => decodeURIComponent(escape(atob(encoded)));

export const getLetters = () => {
  const data = localStorage.getItem(STORAGE_KEY);
  if (!data) return [];
  
  try {
    const rawLetters = JSON.parse(data);
    return rawLetters.map(l => ({
      ...l,
      text: decrypt(l.text)
    }));
  } catch (e) {
    console.error("Failed to decrypt letters:", e);
    return [];
  }
};

export const saveLetter = (letterData) => {
  const letters = getLetters();
  const encryptedLetter = {
    ...letterData,
    text: encrypt(letterData.text),
    id: Date.now().toString(),
    detected_emotions: detectEmotions(letterData.text)
  };
  
  letters.push(encryptedLetter);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(letters.map(l => ({
    ...l,
    text: encrypt(l.text) // Re-encrypt to be sure
  }))));
  
  return encryptedLetter;
};

export const deleteLetter = (id) => {
  const letters = getLetters();
  const filtered = letters.filter(l => l.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered.map(l => ({
    ...l,
    text: encrypt(l.text)
  }))));
};

const detectEmotions = (text) => {
  const emotions = [];
  const lowerText = text.toLowerCase();
  
  const keywords = {
    sadness: ['sad', 'hurt', 'cry', 'pain', 'lonely', 'miss', 'sorry'],
    anger: ['angry', 'mad', 'hate', 'frustrated', 'annoyed', 'why'],
    love: ['love', 'appreciate', 'thank', 'grateful', 'care', 'miss'],
    hope: ['hope', 'future', 'will', 'soon', 'better', 'growth'],
    regret: ['wish', 'should', 'could', 'regret', 'sorry', 'if only']
  };
  
  Object.entries(keywords).forEach(([emotion, words]) => {
    if (words.some(word => lowerText.includes(word))) {
      emotions.push(emotion);
    }
  });
  
  return emotions;
};

export const getPatterns = (recipient) => {
  const letters = getLetters().filter(l => l.recipient === recipient);
  if (letters.length < 3) return null;
  
  const emotionCounts = {};
  letters.forEach(l => {
    l.detected_emotions.forEach(e => {
      emotionCounts[e] = (emotionCounts[e] || 0) + 1;
    });
  });
  
  const topEmotion = Object.entries(emotionCounts).sort((a, b) => b[1] - a[1])[0];
  
  const themes = {
    sadness: 'healing and processing loss',
    anger: 'resolving unspoken conflict',
    love: 'deep appreciation and connection',
    hope: 'optimism for what lies ahead',
    regret: 'finding closure and forgiveness'
  };
  
  return topEmotion ? themes[topEmotion[0]] : 'general reflection';
};

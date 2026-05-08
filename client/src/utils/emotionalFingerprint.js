// Emotional Fingerprint Utility

const FINGERPRINT_KEY = 'mindwell_emotional_fingerprint';

const standardEmotions = [
  'anxious', 'stressed', 'overwhelmed', 'depressed', 'sad', 
  'happy', 'excited', 'angry', 'frustrated', 'lonely', 
  'tired', 'relaxed', 'calm', 'worried'
];

export const getFingerprint = () => {
  const data = localStorage.getItem(FINGERPRINT_KEY);
  return data ? JSON.parse(data) : { mappings: {}, tracking: {} };
};

export const saveFingerprint = (data) => {
  localStorage.setItem(FINGERPRINT_KEY, JSON.stringify(data));
};

/**
 * Detects potential emotional vocabulary from a journal entry.
 * Logic: If a word is used with "I feel" or "feeling" and isn't a standard emotion, track it.
 */
export const detectEmotionalVocab = (text) => {
  const fingerprint = getFingerprint();
  const words = text.toLowerCase().split(/\s+/);
  
  // Simple pattern matching for "I feel [word]" or "feeling [word]"
  const regex = /(?:i feel|feeling|i'm feeling|i am feeling)\s+(\w+)/gi;
  let match;
  
  while ((match = regex.exec(text.toLowerCase())) !== null) {
    const word = match[1];
    
    // Ignore standard emotions and short words
    if (standardEmotions.includes(word) || word.length < 3) continue;
    
    // Update tracking
    if (!fingerprint.tracking[word]) {
      fingerprint.tracking[word] = { count: 0, examples: [], mappedTo: null };
    }
    
    fingerprint.tracking[word].count += 1;
    if (fingerprint.tracking[word].examples.length < 3) {
      fingerprint.tracking[word].examples.push(text.substring(Math.max(0, match.index - 20), Math.min(text.length, match.index + 50)));
    }
    
    // If count reaches 3, try to infer the mapping or mark it for review
    // For this simple version, we'll try to find a standard emotion in the same entry to map it to
    if (fingerprint.tracking[word].count >= 3 && !fingerprint.mappings[word]) {
      const relatedEmotion = standardEmotions.find(e => text.toLowerCase().includes(e));
      if (relatedEmotion) {
        fingerprint.mappings[word] = relatedEmotion;
        fingerprint.tracking[word].mappedTo = relatedEmotion;
      }
    }
  }
  
  saveFingerprint(fingerprint);
};

/**
 * Refelects back using user's own vocabulary.
 * Replaces clinical terms with user's words.
 */
export const reflectWithVocabulary = (text) => {
  const fingerprint = getFingerprint();
  let reflectedText = text;
  
  // Reverse mapping: standard emotion -> user word
  const reverseMappings = {};
  Object.entries(fingerprint.mappings).forEach(([userWord, standardEmotion]) => {
    reverseMappings[standardEmotion] = userWord;
  });
  
  Object.entries(reverseMappings).forEach(([standardEmotion, userWord]) => {
    // Replace with case-insensitive regex
    const regex = new RegExp(`\\b${standardEmotion}\\b`, 'gi');
    reflectedText = reflectedText.replace(regex, userWord);
  });
  
  return reflectedText;
};

export const updateMapping = (word, mappedTo) => {
  const fingerprint = getFingerprint();
  if (mappedTo) {
    fingerprint.mappings[word] = mappedTo;
  } else {
    delete fingerprint.mappings[word];
  }
  saveFingerprint(fingerprint);
};

export const deleteVocabulary = (word) => {
  const fingerprint = getFingerprint();
  delete fingerprint.mappings[word];
  delete fingerprint.tracking[word];
  saveFingerprint(fingerprint);
};

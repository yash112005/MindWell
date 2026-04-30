import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';


const resources = {
  en: {
    translation: {
      "dashboard.welcome": "Good morning",
      "chat.placeholder": "Type your message here...",
      "chat.send": "Send Message",
      "journal.title": "My Journal",
      "settings.language": "App Language"
    }
  },
  hi: {
    translation: {
      "dashboard.welcome": "सुप्रभात",
      "chat.placeholder": "अपना संदेश यहाँ लिखें...",
      "chat.send": "संदेश भेजें",
      "journal.title": "मेरी डायरी",
      "settings.language": "ऐप की भाषा"
    }
  },
  hinglish: {
    translation: {
      "dashboard.welcome": "Good morning dosto",
      "chat.placeholder": "Apna message yahan likhein...",
      "chat.send": "Message Bhejein",
      "journal.title": "Mera Journal",
      "settings.language": "App Language"
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false, 
    }
  });

export default i18n;

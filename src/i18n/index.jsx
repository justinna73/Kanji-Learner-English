import { createContext, useContext, useEffect, useState } from 'react';
import { messages } from './messages';

const LanguageContext = createContext(null);
export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(() => {
    try { return localStorage.getItem('kanji-study-language') === 'ko' ? 'ko' : 'en'; } catch { return 'en'; }
  });
  useEffect(() => {
    document.documentElement.lang = language;
    try { localStorage.setItem('kanji-study-language', language); } catch { /* Storage may be disabled. */ }
  }, [language]);
  return <LanguageContext.Provider value={{ language, setLanguage, t: key => messages[language][key] ?? messages.en[key] ?? key }}>{children}</LanguageContext.Provider>;
}
export const useLanguage = () => useContext(LanguageContext);

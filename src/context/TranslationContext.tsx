import { createContext, useContext, useState, useCallback, useRef } from 'react';
import type { ReactNode } from 'react';
import { translateToChinese } from '../services/translate';

interface TranslationCache {
  [key: string]: string;
}

interface TranslationContextType {
  enabled: boolean;
  toggle: () => void;
  translate: (text: string) => Promise<string>;
  getTranslated: (key: string) => string | undefined;
  setTranslation: (key: string, value: string) => void;
}

const TranslationContext = createContext<TranslationContextType | null>(null);

export function TranslationProvider({ children }: { children: ReactNode }) {
  const [enabled, setEnabled] = useState(false);
  const cacheRef = useRef<TranslationCache>({});

  const toggle = useCallback(() => {
    setEnabled((prev) => !prev);
  }, []);

  const getTranslated = useCallback((key: string): string | undefined => {
    return cacheRef.current[key];
  }, []);

  const setTranslation = useCallback((key: string, value: string) => {
    cacheRef.current[key] = value;
  }, []);

  const translate = useCallback(async (text: string): Promise<string> => {
    if (!text || text.trim().length === 0) return text;

    const cacheKey = text.slice(0, 100);
    if (cacheRef.current[cacheKey]) {
      return cacheRef.current[cacheKey];
    }

    const result = await translateToChinese(text);
    cacheRef.current[cacheKey] = result;
    return result;
  }, []);

  return (
    <TranslationContext.Provider
      value={{ enabled, toggle, translate, getTranslated, setTranslation }}
    >
      {children}
    </TranslationContext.Provider>
  );
}

export function useTranslation() {
  const ctx = useContext(TranslationContext);
  if (!ctx) throw new Error('useTranslation must be used within TranslationProvider');
  return ctx;
}

import { useState, useEffect, useRef, type ReactNode } from 'react';
import { useTranslation } from '../context/TranslationContext';

interface TranslatedTextProps {
  text: string;
  className?: string;
  fallback?: string;
  children?: ReactNode;
}

export function TranslatedText({ text, className, fallback }: TranslatedTextProps) {
  const { enabled, translate, getTranslated, setTranslation } = useTranslation();
  const [translated, setTranslated] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => { mountedRef.current = false; };
  }, []);

  useEffect(() => {
    if (!enabled) {
      setTranslated(null);
      return;
    }

    const cacheKey = text.slice(0, 100);
    const cached = getTranslated(cacheKey);
    if (cached) {
      setTranslated(cached);
      return;
    }

    let cancelled = false;
    setLoading(true);

    translate(text).then((result) => {
      if (!cancelled && mountedRef.current) {
        setTranslated(result);
        setTranslation(cacheKey, result);
        setLoading(false);
      }
    }).catch(() => {
      if (!cancelled && mountedRef.current) {
        setLoading(false);
      }
    });

    return () => { cancelled = true; };
  }, [enabled, text, translate, getTranslated, setTranslation]);

  if (!enabled) {
    return <span className={className}>{text}</span>;
  }

  if (loading && !translated) {
    return (
      <span className={className}>
        <span className="inline-block h-3 w-16 animate-pulse rounded bg-[var(--color-skeleton)]" />
      </span>
    );
  }

  return (
    <span className={className} title={text}>
      {translated || fallback || text}
    </span>
  );
}

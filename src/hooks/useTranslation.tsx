import {
  createContext,
  useContext,
  useMemo,
  type ReactNode,
} from "react";
import { useProfile } from "./useProfile";
import {
  type Lang,
  type TranslationKey,
  translate,
  SUPPORTED_LANGS,
} from "@/lib/i18n";

type I18nContextValue = {
  /** Current language code */
  lang: Lang;
  /** Translate a key. Supports interpolation: t("welcomeName", { name: "Ruhul" }) */
  t: (key: TranslationKey, params?: Record<string, string | number>) => string;
  /** Whether the language is currently loading from profile */
  isLoading: boolean;
};

const I18nContext = createContext<I18nContextValue | null>(null);

function detectBrowserLang(): Lang {
  if (typeof navigator === "undefined") return "en";
  const browser = navigator.language?.toLowerCase() ?? "en";
  if (browser.startsWith("bn")) return "bn";
  return "en";
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const { data: profile, isLoading } = useProfile();

  const value = useMemo<I18nContextValue>(() => {
    // Priority: profile.language → browser → "en"
    let lang: Lang = "en";
    if (profile?.language && SUPPORTED_LANGS.includes(profile.language)) {
      lang = profile.language;
    } else if (!isLoading) {
      // Only fall back to browser after we know there's no profile language
      lang = detectBrowserLang();
    }

    return {
      lang,
      isLoading,
      t: (key, params) => translate(lang, key, params),
    };
  }, [profile?.language, isLoading]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

/**
 * Main hook for translations inside React components.
 *
 * @example
 * const { t, lang } = useTranslation();
 * return <h1>{t("goodMorning")}</h1>;
 * return <p>{t("welcomeName", { name: user.name })}</p>;
 */
export function useTranslation() {
  const ctx = useContext(I18nContext);
  if (!ctx) {
    // Graceful fallback so the app doesn't crash if used outside provider
    // (useful during tests or Storybook)
    const fallbackLang: Lang = "en";
    return {
      lang: fallbackLang,
      isLoading: false,
      t: (key: TranslationKey, params?: Record<string, string | number>) =>
        translate(fallbackLang, key, params),
    };
  }
  return ctx;
}

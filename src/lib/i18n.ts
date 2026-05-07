export type Lang = "en" | "bn";

export const t = {
  en: {
    lifeClock: "Life Clock",
    timeSpent: "Time you've already spent",
    years: "Years", months: "Months", days: "Days",
    hours: "Hours", minutes: "Minutes", seconds: "Seconds",
    guilt: "Time is the only currency you can never earn back. Spend it on what matters.",
    askDob: "When were you born?",
    askDobSub: "We'll calculate, in real time, how much of your life has passed — so every minute counts.",
    day: "Day", month: "Month", year: "Year",
    save: "Save",
    later: "Later",
    addToHome: "Add to Home Screen",
    addToHomeHint: "Open browser menu → Add to Home Screen so you see this every day without opening the app.",
    language: "Language",
    english: "English", bangla: "বাংলা",
    invalidDate: "Please enter a valid date",
    notifEnabled: "Notifications enabled",
    notifDenied: "Notifications were blocked. Enable them from settings.",
  },
  bn: {
    lifeClock: "জীবন-ঘড়ি",
    timeSpent: "তুমি ইতিমধ্যে যত সময় কাটিয়েছ",
    years: "বছর", months: "মাস", days: "দিন",
    hours: "ঘন্টা", minutes: "মিনিট", seconds: "সেকেন্ড",
    guilt: "সময়ই একমাত্র মুদ্রা যা একবার চলে গেলে আর ফিরে পাওয়া যায় না। যা গুরুত্বপূর্ণ তাতেই খরচ কর।",
    askDob: "তোমার জন্ম কবে?",
    askDobSub: "আমরা রিয়েল-টাইমে দেখাব তোমার কত সময় ইতিমধ্যে চলে গেছে — যেন প্রতিটা মিনিট মূল্যবান হয়।",
    day: "দিন", month: "মাস", year: "সাল",
    save: "সংরক্ষণ",
    later: "পরে",
    addToHome: "হোম স্ক্রিনে যোগ কর",
    addToHomeHint: "ব্রাউজার মেনু → Add to Home Screen করো, যেন প্রতিদিন অ্যাপ না খুলেই দেখতে পাও।",
    language: "ভাষা",
    english: "English", bangla: "বাংলা",
    invalidDate: "সঠিক তারিখ দাও",
    notifEnabled: "নোটিফিকেশন চালু হয়েছে",
    notifDenied: "নোটিফিকেশন ব্লক করা আছে। সেটিংস থেকে চালু কর।",
  },
} as const;

export function tr(lang: Lang, key: keyof typeof t["en"]) {
  return t[lang]?.[key] ?? t.en[key];
}

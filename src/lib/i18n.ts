/**
 * NightMind i18n System
 * --------------------
 * Simple, type-safe, zero-dependency internationalization.
 *
 * Architecture:
 * 1. Dictionary lives here (`t` object)
 * 2. I18nProvider (src/hooks/useTranslation.tsx) reads language from profile
 * 3. Components call `const { t, lang } = useTranslation()`
 * 4. Language is persisted in `profiles.language`
 *
 * Supported features:
 * - Nested keys via flat object (type-safe)
 * - Interpolation: t("welcome", { name: "Ruhul" }) → "Welcome, Ruhul"
 * - Fallback to English if key missing in current language
 */

export type Lang = "en" | "bn";

export const SUPPORTED_LANGS: Lang[] = ["en", "bn"];

export const t = {
  en: {
    // Life Clock
    lifeClock: "Life Clock",
    timeSpent: "Time you've already spent",
    years: "Years",
    months: "Months",
    days: "Days",
    hours: "Hours",
    minutes: "Minutes",
    seconds: "Seconds",
    guilt: "Time is the only currency you can never earn back. Spend it on what matters.",

    // Date of birth
    askDob: "When were you born?",
    askDobSub: "We'll calculate, in real time, how much of your life has passed — so every minute counts.",
    day: "Day",
    month: "Month",
    year: "Year",
    save: "Save",
    later: "Later",
    invalidDate: "Please enter a valid date",

    // Language & system
    language: "Language",
    english: "English",
    bangla: "বাংলা",
    addToHome: "Add to Home Screen",
    addToHomeHint: "Open browser menu → Add to Home Screen so you see this every day without opening the app.",
    notifEnabled: "Notifications enabled",
    notifDenied: "Notifications were blocked. Enable them from settings.",

    // Greetings
    goodMorning: "Good Morning",
    goodAfternoon: "Good Afternoon",
    goodEvening: "Good Evening",

    // Bottom navigation
    navHome: "Home",
    navCheckin: "Check-in",
    navTasks: "Tasks",
    navProfile: "Profile",

    // Home
    planReady: "Plan ready. Start with clarity.",
    sleepInsight: "Sleep Insight",
    youSlept: "You slept",
    todaysPlan: "Today's Plan",
    top3Priority: "Top 3 Priority Tasks",
    noPlanYet: "No plan yet for today.",
    startNightCheckin: "Start Night Check-in",
    viewFullPlan: "View Full Plan",
    progress: "Progress",
    ofCompleted: "of",
    completed: "completed",
    credibilityScore: "Credibility Score",
    greatConsistency: "Great consistency yesterday!",
    topPerformers: "Top performers",
    viewAll: "View all",
    thisWeek: "this week",

    // Check-in
    nightCheckin: "Night Check-in",
    planTonight: "Plan tonight, win tomorrow.",
    whatToAccomplish: "What do you want to accomplish tomorrow?",
    typeYourAnswer: "Type your answer...",
    generateAiPlan: "Generate AI Plan",
    examplesYouCanTry: "Examples you can try",
    voice: "Voice",
    stop: "Stop",
    addMore: "Add More",
    notSure: "Not Sure",

    // Tasks
    todaysPlanTitle: "Today's Plan",
    tasksCount: "tasks · tap any task for details",
    highPriority: "High Priority",
    otherTasks: "Other Tasks",
    nothingPlanned: "Nothing planned. Run a Night Check-in to generate your day.",
    startCheckin: "Start Check-in",
    markAsDone: "Mark as done",
    skip: "Skip",
    taskDetails: "Task details",
    title: "Title",
    notes: "Notes",
    reminderTime: "Reminder time",
    noReminder: "No reminder set.",
    youllBeReminded: "You'll be reminded at",
    markDone: "Mark done",
    markUndone: "Mark undone",

    // Profile
    profile: "Profile",
    sleepSchedule: "Sleep schedule",
    birthDate: "Birth date",
    notSetTapToAdd: "Not set — tap to add",
    editSleepSchedule: "Edit sleep schedule",
    leaderboard: "Leaderboard",
    credibility: "Credibility",
    patterns: "Patterns",
    weeklyDebrief: "Weekly Debrief",
    reminders: "Reminders",
    signOut: "Sign out",
    profilePictureUpdated: "Profile picture updated",
    scheduleUpdated: "Schedule updated",
    setFocusAreas: "Set your focus areas",
    tapToSwitch: "Tap to switch",

    // Leaderboard
    leaderboardTitle: "Leaderboard",
    topPerformersThisWeek: "Top performers this week",
    noDataYet: "No data yet. Be the first to complete tasks!",
    allRankings: "All rankings",
    total: "total",
    you: "You",

    // Common
    continue: "Continue",
    finish: "Finish",
    loading: "Loading...",
    errorGeneric: "Something went wrong",
    welcomeName: "Welcome, {name}",
  },

  bn: {
    // Life Clock
    lifeClock: "জীবন-ঘড়ি",
    timeSpent: "তুমি ইতিমধ্যে যত সময় কাটিয়েছ",
    years: "বছর",
    months: "মাস",
    days: "দিন",
    hours: "ঘন্টা",
    minutes: "মিনিট",
    seconds: "সেকেন্ড",
    guilt: "সময়ই একমাত্র মুদ্রা যা একবার চলে গেলে আর ফিরে পাওয়া যায় না। যা গুরুত্বপূর্ণ তাতেই খরচ কর।",

    // Date of birth
    askDob: "তোমার জন্ম কবে?",
    askDobSub: "আমরা রিয়েল-টাইমে দেখাব তোমার কত সময় ইতিমধ্যে চলে গেছে — যেন প্রতিটা মিনিট মূল্যবান হয়।",
    day: "দিন",
    month: "মাস",
    year: "সাল",
    save: "সংরক্ষণ",
    later: "পরে",
    invalidDate: "সঠিক তারিখ দাও",

    // Language & system
    language: "ভাষা",
    english: "English",
    bangla: "বাংলা",
    addToHome: "হোম স্ক্রিনে যোগ কর",
    addToHomeHint: "ব্রাউজার মেনু → Add to Home Screen করো, যেন প্রতিদিন অ্যাপ না খুলেই দেখতে পাও।",
    notifEnabled: "নোটিফিকেশন চালু হয়েছে",
    notifDenied: "নোটিফিকেশন ব্লক করা আছে। সেটিংস থেকে চালু কর।",

    // Greetings
    goodMorning: "সুপ্রভাত",
    goodAfternoon: "শুভ অপরাহ্ন",
    goodEvening: "শুভ সন্ধ্যা",

    // Bottom navigation
    navHome: "হোম",
    navCheckin: "চেক-ইন",
    navTasks: "টাস্ক",
    navProfile: "প্রোফাইল",

    // Home
    planReady: "প্ল্যান তৈরি। স্পষ্টতা নিয়ে শুরু করো।",
    sleepInsight: "ঘুমের ইনসাইট",
    youSlept: "তুমি ঘুমিয়েছ",
    todaysPlan: "আজকের প্ল্যান",
    top3Priority: "শীর্ষ ৩ অগ্রাধিকার টাস্ক",
    noPlanYet: "আজকের জন্য এখনো কোনো প্ল্যান নেই।",
    startNightCheckin: "নাইট চেক-ইন শুরু করো",
    viewFullPlan: "সম্পূর্ণ প্ল্যান দেখো",
    progress: "অগ্রগতি",
    ofCompleted: "এর মধ্যে",
    completed: "সম্পন্ন",
    credibilityScore: "ক্রেডিবিলিটি স্কোর",
    greatConsistency: "গতকাল দারুণ কনসিস্টেন্সি ছিল!",
    topPerformers: "শীর্ষ পারফর্মার",
    viewAll: "সব দেখো",
    thisWeek: "এই সপ্তাহে",

    // Check-in
    nightCheckin: "নাইট চেক-ইন",
    planTonight: "আজ রাতে প্ল্যান করো, কাল জয় করো।",
    whatToAccomplish: "কাল কী অর্জন করতে চাও?",
    typeYourAnswer: "তোমার উত্তর লেখো...",
    generateAiPlan: "AI প্ল্যান তৈরি করো",
    examplesYouCanTry: "চেষ্টা করতে পারো এমন উদাহরণ",
    voice: "ভয়েস",
    stop: "বন্ধ",
    addMore: "আরো যোগ করো",
    notSure: "নিশ্চিত না",

    // Tasks
    todaysPlanTitle: "আজকের প্ল্যান",
    tasksCount: "টাস্ক · বিস্তারিত দেখতে ট্যাপ করো",
    highPriority: "উচ্চ অগ্রাধিকার",
    otherTasks: "অন্যান্য টাস্ক",
    nothingPlanned: "কিছুই প্ল্যান করা নেই। দিন তৈরি করতে নাইট চেক-ইন চালাও।",
    startCheckin: "চেক-ইন শুরু করো",
    markAsDone: "সম্পন্ন করো",
    skip: "স্কিপ",
    taskDetails: "টাস্কের বিস্তারিত",
    title: "শিরোনাম",
    notes: "নোট",
    reminderTime: "রিমাইন্ডার সময়",
    noReminder: "কোনো রিমাইন্ডার সেট করা নেই।",
    youllBeReminded: "তোমাকে রিমাইন্ড করা হবে",
    markDone: "সম্পন্ন করো",
    markUndone: "অসম্পন্ন করো",

    // Profile
    profile: "প্রোফাইল",
    sleepSchedule: "ঘুমের সময়সূচি",
    birthDate: "জন্ম তারিখ",
    notSetTapToAdd: "সেট করা নেই — যোগ করতে ট্যাপ করো",
    editSleepSchedule: "ঘুমের সময়সূচি এডিট করো",
    leaderboard: "লিডারবোর্ড",
    credibility: "ক্রেডিবিলিটি",
    patterns: "প্যাটার্ন",
    weeklyDebrief: "সাপ্তাহিক ডিব্রিফ",
    reminders: "রিমাইন্ডার",
    signOut: "সাইন আউট",
    profilePictureUpdated: "প্রোফাইল ছবি আপডেট হয়েছে",
    scheduleUpdated: "সময়সূচি আপডেট হয়েছে",
    setFocusAreas: "ফোকাস এরিয়া সেট করো",
    tapToSwitch: "ট্যাপ করে পরিবর্তন করো",

    // Leaderboard
    leaderboardTitle: "লিডারবোর্ড",
    topPerformersThisWeek: "এই সপ্তাহের শীর্ষ পারফর্মার",
    noDataYet: "এখনো কোনো ডেটা নেই। প্রথম টাস্ক সম্পন্ন করো!",
    allRankings: "সব র‍্যাঙ্কিং",
    total: "মোট",
    you: "তুমি",

    // Common
    continue: "চালিয়ে যাও",
    finish: "শেষ",
    loading: "লোড হচ্ছে...",
    errorGeneric: "কিছু একটা ভুল হয়েছে",
    welcomeName: "স্বাগতম, {name}",
  },
} as const;

export type TranslationKey = keyof typeof t["en"];

/** Simple interpolation: replaces {key} with values from params */
function interpolate(template: string, params?: Record<string, string | number>): string {
  if (!params) return template;
  return template.replace(/\{(\w+)\}/g, (_, key) =>
    params[key] !== undefined ? String(params[key]) : `{${key}}`,
  );
}

/**
 * Low-level translation function (used by the hook and non-React code).
 * Prefer `useTranslation().t` inside React components.
 */
export function translate(
  lang: Lang,
  key: TranslationKey,
  params?: Record<string, string | number>,
): string {
  const raw = t[lang]?.[key] ?? t.en[key] ?? key;
  return interpolate(raw, params);
}

/** @deprecated Use `translate` or `useTranslation().t` instead */
export function tr(lang: Lang, key: TranslationKey): string {
  return translate(lang, key);
}

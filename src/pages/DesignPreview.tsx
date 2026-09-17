import { useState } from "react";
import {
  ArrowRight,
  BarChart3,
  Bell,
  BookOpen,
  Brain,
  Check,
  ChevronLeft,
  CircleHelp,
  Flame,
  Heart,
  Home,
  Mic,
  Moon,
  MoreHorizontal,
  Plus,
  Sparkles,
  Target,
  Trophy,
  UserRound,
  Zap,
} from "lucide-react";
import moonCompanion from "@/assets/realistic-moon-companion.png";
import focusTarget from "@/assets/realistic-focus-target.png";
import heartMovement from "@/assets/realistic-heart-movement.png";
import journal from "@/assets/realistic-journal.png";
import brainSpark from "@/assets/realistic-brain-spark.png";

const screens = [
  { id: "auth", label: "Welcome", eyebrow: "Start" },
  { id: "onboarding", label: "Focus", eyebrow: "Set up" },
  { id: "sleep", label: "Sleep time", eyebrow: "Set up" },
  { id: "home", label: "Today", eyebrow: "Home" },
  { id: "checkin", label: "Check-in", eyebrow: "Reflect" },
  { id: "plan", label: "Plan", eyebrow: "Tomorrow" },
  { id: "tasks", label: "Tasks", eyebrow: "Momentum" },
  { id: "why", label: "Why", eyebrow: "Reflect" },
  { id: "patterns", label: "Patterns", eyebrow: "Insights" },
  { id: "credibility", label: "Credibility", eyebrow: "Progress" },
  { id: "leaderboard", label: "Leaderboard", eyebrow: "Community" },
  { id: "adjustment", label: "Adjust", eyebrow: "Reset" },
  { id: "reminder", label: "Reminder", eyebrow: "Nudge" },
  { id: "debrief", label: "Debrief", eyebrow: "Weekly" },
  { id: "profile", label: "Profile", eyebrow: "You" },
];

const iconMap = { auth: Moon, onboarding: Target, sleep: Moon, home: Home, checkin: Moon, plan: Sparkles, tasks: Check, why: CircleHelp, patterns: BarChart3, credibility: Flame, leaderboard: Trophy, adjustment: Zap, reminder: Bell, debrief: BookOpen, profile: UserRound };

export default function DesignPreview() {
  const params = new URLSearchParams(window.location.search);
  const capture = params.get("capture") === "1";
  const [active, setActive] = useState(params.get("screen") ?? "home");
  const current = screens.find((screen) => screen.id === active) ?? screens[0];
  return (
    <main className={`design-preview ${capture ? "capture-mode" : ""}`}>
      <section className="preview-hero">
        <div>
          <span className="preview-kicker"><Sparkles size={14} /> NightMind / new visual system</span>
          <h1>Better nights.<br /><em>More intentional</em> days.</h1>
          <p>A calmer, warmer redesign inspired by Budget Buddy's friendly voice-first experience—adapted for sleep, habits, and daily momentum.</p>
        </div>
        <div className="hero-orbit"><Moon size={48} /><span>23:14</span><small>wind down</small></div>
      </section>

      <section className="preview-layout">
        <aside className="screen-picker">
          <div className="picker-label">Screens in this direction</div>
          {screens.map((screen) => {
            const Icon = iconMap[screen.id as keyof typeof iconMap];
            return <button key={screen.id} className={active === screen.id ? "active" : ""} onClick={() => setActive(screen.id)}><Icon size={17} /><span><small>{screen.eyebrow}</small>{screen.label}</span><ArrowRight size={15} /></button>;
          })}
          <div className="picker-note"><CircleHelp size={16} /><span>Tap a screen to inspect the direction before we connect it to GitHub.</span></div>
        </aside>
        <div className="phone-stage"><PhoneFrame screen={current.id} /></div>
      </section>

      <section className="design-principles">
        <div><span>01</span><h3>Talk first</h3><p>Every important action starts with a natural reflection, not a form.</p></div>
        <div><span>02</span><h3>Soft clarity</h3><p>Warm surfaces, generous spacing, and one clear next step at a time.</p></div>
        <div><span>03</span><h3>Kind momentum</h3><p>Progress feels encouraging—never punitive—when plans change.</p></div>
      </section>
    </main>
  );
}

function PhoneFrame({ screen }: { screen: string }) {
  return <div className="phone-frame"><div className="phone-notch" /><div className="phone-screen"><div className="phone-top"><span>9:41</span><span>•••</span></div>{screen === "auth" && <AuthScreen />}{screen === "onboarding" && <OnboardingScreen />}{screen === "sleep" && <SleepScreen />}{screen === "home" && <HomeScreen />}{screen === "checkin" && <CheckinScreen />}{screen === "plan" && <PlanScreen />}{screen === "tasks" && <TasksScreen />}{screen === "why" && <WhyScreen />}{screen === "patterns" && <PatternsScreen />}{screen === "credibility" && <CredibilityScreen />}{screen === "leaderboard" && <LeaderboardScreen />}{screen === "adjustment" && <AdjustmentScreen />}{screen === "reminder" && <ReminderScreen />}{screen === "debrief" && <DebriefScreen />}{screen === "profile" && <ProfileScreen />}</div></div>;
}

function ScreenTitle({ eyebrow, title, action = <MoreHorizontal size={19} /> }: { eyebrow: string; title: string; action?: React.ReactNode }) { return <div className="screen-title"><div><small>{eyebrow}</small><h2>{title}</h2></div><button className="icon-button">{action}</button></div>; }
function Nav({ active = "home" }: { active?: string }) { return <div className="phone-nav">{["home", "checkin", "plan", "tasks"].map((id) => { const screen = screens.find((s) => s.id === id)!; const Icon = iconMap[id as keyof typeof iconMap]; return <div className={active === id ? "selected" : ""} key={id}><Icon size={17} /><small>{screen.label}</small></div>; })}<div className={active === "profile" ? "selected" : ""}><UserRound size={17} /><small>You</small></div></div>; }

function AuthScreen() { return <div className="journey-screen auth-screen"><img className="journey-mascot" src={moonCompanion} alt="NightMind" /><small>YOUR AI COMPANION FOR BETTER DAYS</small><h2>Make tomorrow<br /><em>feel lighter.</em></h2><p>Say what is on your mind. NightMind turns it into a day you can actually live.</p><div className="auth-input">Your name</div><div className="auth-input">Email address</div><button className="wide-button">Create my space <ArrowRight size={17} /></button><span className="auth-foot">Already have an account? <b>Sign in</b></span></div>; }
function OnboardingScreen() { return <div className="journey-screen"><ScreenTitle eyebrow="A little setup" title="What matters to you?" action={<span>2/3</span>} /><p className="journey-copy">Choose what you want NightMind to gently make space for.</p><div className="choice-card selected"><img src={heartMovement} alt="Health" /><div><strong>Health</strong><small>Sleep, movement, mindful eating</small></div><Check size={17} /></div><div className="choice-card"><img src={focusTarget} alt="Work" /><div><strong>Work</strong><small>Deep focus, deadlines, momentum</small></div></div><div className="choice-card"><img src={journal} alt="Learning" /><div><strong>Learning</strong><small>Reading, skills, growth</small></div></div><button className="wide-button">Continue <ArrowRight size={17} /></button></div>; }
function SleepScreen() { return <div className="journey-screen"><ScreenTitle eyebrow="A better night starts here" title="When do you sleep?" /><div className="sleep-visual"><img src={moonCompanion} alt="Moon companion" /><strong>10:30 <small>PM</small></strong><span>Drag to set your usual bedtime</span></div><div className="mini-hint"><Brain size={17} /> We’ll use this to make your reminders feel timely—not noisy.</div><button className="wide-button">Save sleep time <ArrowRight size={17} /></button></div>; }
function WhyScreen() { return <div className="journey-screen"><ScreenTitle eyebrow="No guilt here" title="What got in the way?" action={<ChevronLeft size={19} />} /><div className="chat-welcome"><img src={moonCompanion} alt="Companion" /><div><strong>Skipping happens.</strong><small>Which one feels closest?</small></div></div><div className="reason-card">I ran out of energy <span>›</span></div><div className="reason-card">The plan was too much <span>›</span></div><div className="reason-card">Something unexpected came up <span>›</span></div><div className="reason-card">I changed my mind <span>›</span></div><button className="soft-button">Tell NightMind another way</button></div>; }
function AdjustmentScreen() { return <div className="journey-screen"><ScreenTitle eyebrow="A small reset" title="Let's make it lighter" action={<Zap size={18} />} /><img className="journey-art wide-art" src={brainSpark} alt="Reset" /><p className="center-copy">You have 3 tasks left. Want me to move the low-energy ones to tomorrow?</p><button className="wide-button">Yes, make it lighter <ArrowRight size={17} /></button><button className="soft-button">Keep my plan</button></div>; }
function ReminderScreen() { return <div className="journey-screen"><ScreenTitle eyebrow="Gentle nudges" title="Your reminders" action={<Bell size={18} />} /><div className="reminder-card"><div className="reminder-icon"><Moon size={20} /></div><div><strong>Wind-down reminder</strong><small>Every night at 10:00 PM</small></div><div className="toggle-on" /></div><div className="reminder-card"><div className="reminder-icon peach"><Target size={20} /></div><div><strong>Focus window</strong><small>Weekdays at 10:30 AM</small></div><div className="toggle-on" /></div><button className="soft-button">+ Add a reminder</button></div>; }
function DebriefScreen() { return <div className="journey-screen"><ScreenTitle eyebrow="Your week in a minute" title="A week worth noticing" action={<BookOpen size={18} />} /><div className="debrief-hero"><img src={journal} alt="Journal" /><div><strong>You kept 18 promises<br />to yourself.</strong><small>That is worth celebrating.</small></div></div><div className="debrief-stat"><span>Best moment</span><strong>Three calm mornings in a row</strong></div><div className="debrief-stat"><span>Next experiment</span><strong>Protect your first hour</strong></div><button className="wide-button">See my patterns <ArrowRight size={17} /></button></div>; }

function HomeScreen() { return <><ScreenTitle eyebrow="Tuesday, 17 September" title="Good evening, Ria" action={<Bell size={18} />} /><div className="mood-card"><img src={moonCompanion} alt="Moon companion" /><div><strong>How are you arriving tonight?</strong><p>One honest minute is enough.</p></div><button><ArrowRight size={17} /></button></div><div className="section-row"><span>Tomorrow, gently</span><small>3 tasks · 1h 20m</small></div><div className="task-stack"><Task icon={<img src={focusTarget} alt="Focus" />} title="Deep work block" meta="45 min · high energy" color="peach" /><Task icon={<img src={heartMovement} alt="Movement" />} title="Move your body" meta="20 min · medium energy" color="lilac" /><Task icon={<img src={journal} alt="Journal" />} title="Read before bed" meta="15 min · low energy" color="mint" /></div><div className="life-card"><div className="life-icon"><Sparkles size={18} /></div><div><small>Your tiny win</small><strong>7 day streak</strong></div><span>+12</span></div><Nav /> </>; }
function CheckinScreen() { return <><ScreenTitle eyebrow="Night check-in" title="Let's slow down" action={<ChevronLeft size={19} />} /><div className="chat-welcome"><img src={moonCompanion} alt="NightMind companion" /><div><strong>Hi Ria, what is sitting<br />with you tonight?</strong><small>You can type, talk, or just choose a feeling.</small></div></div><div className="chat-bubble user">A little scattered, but proud I finished the proposal.</div><div className="chat-bubble buddy"><Sparkles size={14} /> That sounds like a real win. What would make tomorrow feel lighter?</div><div className="chat-input"><span>Tell me in your own words...</span><button><Mic size={17} /></button><button className="send-button"><ArrowRight size={17} /></button></div><div className="quick-chips"><span>🌙 Tired</span><span>✨ Proud</span><span>🫧 Hopeful</span></div><Nav active="checkin" /></>; }
function PlanScreen() { return <><ScreenTitle eyebrow="AI plan · tomorrow" title="A softer plan" action={<Sparkles size={18} />} /><div className="plan-intro"><Sparkles size={20} /><p>Built around your energy, not an ideal version of you.</p></div><div className="plan-time"><span>08:00</span><div><strong>Start slowly</strong><small>Water + 10 min outside</small></div><span className="pill peach-pill">low</span></div><div className="plan-time"><span>10:30</span><div><strong>Focus window</strong><small>Finish proposal · 45 min</small></div><span className="pill coral-pill">high</span></div><div className="plan-time"><span>18:30</span><div><strong>Come back to yourself</strong><small>Walk with a podcast</small></div><span className="pill mint-pill">mid</span></div><button className="wide-button">Make this my plan <ArrowRight size={17} /></button><Nav active="plan" /></>; }
function TasksScreen() { return <><ScreenTitle eyebrow="Tuesday rhythm" title="Your tasks" action={<Plus size={19} />} /><div className="progress-strip"><div><small>Today</small><strong>2 of 5 done</strong></div><div className="progress-ring">40%</div></div><div className="section-row"><span>In motion</span><small>Tap to complete</small></div><div className="task-stack"><Task checked icon={<Target />} title="Deep work block" meta="45 min · high energy" color="peach" /><Task checked icon={<Heart />} title="Move your body" meta="20 min · medium energy" color="lilac" /><Task icon={<Brain />} title="Plan one kind thing" meta="10 min · low energy" color="mint" /></div><div className="add-task"><Plus size={16} /> Add a task in your own words</div><Nav active="tasks" /></>; }
function PatternsScreen() { return <><ScreenTitle eyebrow="Your patterns" title="What we notice" action={<BarChart3 size={18} />} /><div className="pattern-hero"><img src={brainSpark} alt="AI insight" /><div><strong>Your evenings are<br /><em>getting kinder.</em></strong><p>On nights you wind down before 11, your next-day follow-through is 28% higher.</p></div></div><div className="insight-card"><span className="insight-number">01</span><div><strong>Protect your first hour</strong><p>Your clearest work happens before messages begin.</p></div></div><div className="insight-card"><span className="insight-number coral">02</span><div><strong>Movement unlocks momentum</strong><p>A short walk makes your evening check-in more honest.</p></div></div><Nav active="profile" /></>; }
function CredibilityScreen() { return <><ScreenTitle eyebrow="Consistency, not perfection" title="Your credibility" action={<Flame size={18} />} /><div className="score-card"><div className="score-circle"><strong>82</strong><small>/ 100</small></div><div><small>this week</small><strong>Quietly consistent</strong><p>You're showing up for yourself.</p></div></div><div className="cred-stats"><div><Flame size={18} /><strong>7</strong><small>day streak</small></div><div><Check size={18} /><strong>24</strong><small>tasks kept</small></div><div><Heart size={18} /><strong>91%</strong><small>honesty</small></div></div><div className="quote-card">“The goal is not a perfect day. It is a day you can believe.”</div><Nav active="profile" /></>; }
function LeaderboardScreen() { return <><ScreenTitle eyebrow="Weekly circle" title="Gentle competition" action={<Trophy size={18} />} /><div className="leader-hero"><Trophy size={25} /><div><strong>You're #4 this week</strong><p>Two kind choices away from #3.</p></div></div><div className="leader-row top"><span>01</span><div className="avatar pink">M</div><strong>Maya</strong><b>96</b></div><div className="leader-row"><span>02</span><div className="avatar blue">S</div><strong>Sam</strong><b>91</b></div><div className="leader-row"><span>03</span><div className="avatar yellow">A</div><strong>Ari</strong><b>88</b></div><div className="leader-row you"><span>04</span><div className="avatar lilac">R</div><strong>You</strong><b>82</b></div><Nav active="profile" /></>; }
function ProfileScreen() { return <><ScreenTitle eyebrow="Your space" title="Ria's rhythm" action={<MoreHorizontal size={18} />} /><div className="profile-head"><div className="profile-avatar">R</div><div><strong>Ria Rahman</strong><p>Member since September</p></div><button className="edit-button">Edit</button></div><div className="sleep-card"><Moon size={20} /><div><small>Sleep window</small><strong>22:45 — 07:00</strong></div><ChevronLeft size={18} className="rotate" /></div><div className="profile-menu"><div><Bell size={17} /><span>Reminders</span><ChevronLeft size={16} className="rotate" /></div><div><Zap size={17} /><span>Language · বাংলা</span><ChevronLeft size={16} className="rotate" /></div><div><CircleHelp size={17} /><span>How NightMind works</span><ChevronLeft size={16} className="rotate" /></div></div><Nav active="profile" /></>; }

function Task({ icon, title, meta, color, checked = false }: { icon: React.ReactNode; title: string; meta: string; color: string; checked?: boolean }) { return <div className={`task ${color} ${checked ? "done" : ""}`}><div className="task-icon">{checked ? <Check size={17} /> : icon}</div><div><strong>{title}</strong><small>{meta}</small></div><span className="task-more">•••</span></div>; }

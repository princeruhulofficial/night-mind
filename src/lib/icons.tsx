import { Target, Dumbbell, BookOpen, PenLine, Flower2, Brain, Briefcase, Heart, Coffee, Code2, Music, Sparkles, type LucideIcon } from "lucide-react";

export const TASK_ICONS: Record<string, LucideIcon> = {
  target: Target,
  dumbbell: Dumbbell,
  book: BookOpen,
  pen: PenLine,
  meditate: Flower2,
  brain: Brain,
  briefcase: Briefcase,
  heart: Heart,
  coffee: Coffee,
  code: Code2,
  music: Music,
  sparkles: Sparkles,
};

export function getTaskIcon(name?: string | null): LucideIcon {
  return TASK_ICONS[name ?? "target"] ?? Target;
}

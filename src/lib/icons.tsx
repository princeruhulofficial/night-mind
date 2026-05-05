import { Target, Dumbbell, BookOpen, PenLine, Flower2, Brain, Briefcase, Heart, Coffee, Code2, Music, Sparkles, type LucideIcon } from "lucide-react";
import targetImg from "@/assets/icons/target.png";
import dumbbellImg from "@/assets/icons/dumbbell.png";
import bookImg from "@/assets/icons/book.png";
import penImg from "@/assets/icons/pen.png";
import meditateImg from "@/assets/icons/meditate.png";
import brainImg from "@/assets/icons/brain.png";
import briefcaseImg from "@/assets/icons/briefcase.png";
import heartImg from "@/assets/icons/heart.png";

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

export const TASK_IMAGES: Record<string, string> = {
  target: targetImg,
  dumbbell: dumbbellImg,
  book: bookImg,
  pen: penImg,
  meditate: meditateImg,
  brain: brainImg,
  briefcase: briefcaseImg,
  heart: heartImg,
};

export function getTaskImage(name?: string | null): string {
  return TASK_IMAGES[name ?? "target"] ?? targetImg;
}

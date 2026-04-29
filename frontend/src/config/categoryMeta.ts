import {
  Sparkles,
  Film,
  Trophy,
  Palmtree,
  UtensilsCrossed,
  Ticket,
} from "lucide-react";

export const CATEGORY_META: Record<
  string,
  { label: string; icon: any; color: string }
> = {
  EVENT:   { label: "Events",   icon: Sparkles,        color: "#f97316" },
  MOVIE:   { label: "Movies",   icon: Film,            color: "#ef4444" },
  SPORT:   { label: "Sports",   icon: Trophy,          color: "#22c55e" },
  HOLIDAY: { label: "Holidays", icon: Palmtree,        color: "#06b6d4" },
  FOOD:    { label: "Foods",    icon: UtensilsCrossed, color: "#eab308" },
  OTHER:   { label: "Other",    icon: Ticket,          color: "#ec4899" },
};
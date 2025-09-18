// src/components/ui/glass-card.tsx
import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface GlassCardProps {
  children: ReactNode;
  className?: string;
}

export function GlassCard({ children, className }: GlassCardProps) {
  return (
    <div 
      className={cn(
        "glass dark:glass-dark rounded-2xl p-8",
        "transition-all duration-300 hover:shadow-2xl",
        className
      )}
    >
      {children}
    </div>
  );
}
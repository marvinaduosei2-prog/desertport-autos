import React from 'react';
import { cn } from '@/lib/utils';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'light' | 'medium' | 'heavy';
  hover?: boolean;
  onClick?: () => void;
}

export function GlassCard({
  children,
  className,
  variant = 'medium',
  hover = false,
  onClick,
}: GlassCardProps) {
  const variants = {
    light: 'bg-white/10 backdrop-blur-sm',
    medium: 'bg-white/15 backdrop-blur-md',
    heavy: 'bg-white/25 backdrop-blur-lg',
  };

  return (
    <div
      className={cn(
        'rounded-2xl border border-white/20 shadow-glass',
        variants[variant],
        hover && 'transition-all duration-300 hover:bg-white/20 hover:shadow-glass-lg hover:scale-[1.02]',
        onClick && 'cursor-pointer',
        className
      )}
      onClick={onClick}
    >
      {children}
    </div>
  );
}


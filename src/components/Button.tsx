import React from 'react';
import { cn } from '@/src/lib/utils';
import { synth } from '../lib/synth';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'yellow' | 'ghost';
  pill?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', pill = true, onClick, ...props }, ref) => {
    
    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      synth.playClick();
      if (onClick) {
        onClick(e);
      }
    };

    return (
      <button
        ref={ref}
        onClick={handleClick}
        className={cn(
          'inline-flex items-center justify-center font-bold transition-all duration-300 active:scale-95 disabled:opacity-50 disabled:pointer-events-none',
          pill ? 'rounded-full px-8 py-3' : 'rounded-2xl px-6 py-3',
          variant === 'primary' && 'bg-primary-accent text-white custom-shadow',
          variant === 'yellow' && 'bg-cta-yellow text-slate-900 button-raised',
          variant === 'secondary' && 'bg-white text-primary-accent border-2 border-primary-accent',
          variant === 'ghost' && 'bg-transparent text-primary-accent hover:bg-white/20',
          className
        )}
        {...props}
      />
    );
  }
);

import React from 'react';
import { CheckCircle2, User, Shirt, Sparkles } from 'lucide-react';

interface StepCardProps {
  stepNumber: number;
  title: string;
  imageSrc?: string;
  isActive: boolean;
  isCompleted: boolean;
  icon: 'user' | 'shirt' | 'magic';
}

export const StepCard: React.FC<StepCardProps> = ({ 
  stepNumber, 
  title, 
  imageSrc, 
  isActive, 
  isCompleted,
  icon 
}) => {
  
  const getIcon = () => {
    switch (icon) {
      case 'user': return <User className="w-6 h-6" />;
      case 'shirt': return <Shirt className="w-6 h-6" />;
      case 'magic': return <Sparkles className="w-6 h-6" />;
    }
  };

  return (
    <div 
      className={`
        relative overflow-hidden rounded-2xl transition-all duration-500 card-tilt
        ${isActive ? 'ring-4 ring-yellow-400 shadow-xl scale-105 z-10' : 'opacity-70 scale-95'}
        ${isCompleted ? 'border-green-500' : 'border-white/20'}
        bg-white h-48 sm:h-64 w-full flex flex-col shadow-lg
      `}
    >
      <div className="absolute top-3 left-3 z-20 flex items-center gap-2">
        <span className={`
          flex items-center justify-center w-8 h-8 rounded-full font-bold text-sm
          ${isActive ? 'bg-yellow-400 text-black' : 'bg-gray-200 text-gray-500'}
        `}>
          {stepNumber}
        </span>
        <span className="text-xs font-bold uppercase tracking-wider bg-black/50 text-white px-2 py-1 rounded-full backdrop-blur-sm">
          {title}
        </span>
      </div>

      {isCompleted && (
        <div className="absolute top-3 right-3 z-20 text-green-500 bg-white rounded-full p-1 shadow-sm">
          <CheckCircle2 size={20} fill="currentColor" className="text-white bg-green-500 rounded-full" />
        </div>
      )}

      <div className="flex-1 w-full h-full bg-gray-100 flex items-center justify-center overflow-hidden relative">
        {imageSrc ? (
          <img 
            src={imageSrc} 
            alt={`Step ${stepNumber}`} 
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="text-gray-300 flex flex-col items-center gap-2">
            {getIcon()}
            <span className="text-xs text-gray-400">待选择</span>
          </div>
        )}
        
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent pointer-events-none" />
      </div>
    </div>
  );
};

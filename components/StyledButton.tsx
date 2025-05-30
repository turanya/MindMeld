import React, { ReactNode } from 'react';

interface StyledButtonProps {
  children: ReactNode;
  isActive?: boolean;
  onClick?: () => void;
}

export const StyledButton: React.FC<StyledButtonProps> = ({ 
  children, 
  isActive = false, 
  onClick 
}) => {
  return (
    <button
      onClick={onClick}
      className={`
        flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg
        transition-all duration-200 ease-in-out
        ${isActive 
          ? 'bg-[#b259ff] text-white' 
          : 'bg-transparent text-white/70 hover:text-white hover:bg-white/10'
        }
      `}
    >
      {children}
    </button>
  );
};

export default StyledButton;

import React, { type ReactNode } from 'react';
import { type LucideIcon } from 'lucide-react';

interface ButtonProps {
  contentType: 'icon' | 'text' | 'both';
  type: 'filled' | 'outline' | 'plain';
  status?: 'active' | 'disabled' | 'busy';
  icon?: LucideIcon;
  iconPosition?: 'left' | 'right';
  children?: ReactNode;
  onClick?: () => void;
  href?: string;
  target?: string;
  rel?: string;
  className?: string;
  fillColor?: string;
  textColor?: string;
  borderColor?: string;
  hoverFillColor?: string;
  hoverTextColor?: string;
}

export const Button: React.FC<ButtonProps> = ({
  contentType,
  type,
  status = 'active',
  icon: Icon,
  iconPosition = 'left',
  children,
  onClick,
  href,
  target,
  rel,
  className = '',
  fillColor = 'bg-blue-600',
  textColor = 'text-white',
  borderColor = 'border-blue-600',
  hoverFillColor = 'hover:bg-blue-700',
  hoverTextColor = 'hover:text-blue-700',
}) => {
  const isDisabled = status === 'disabled';
  const isBusy = status === 'busy';

  // Base styles
  const baseStyles =
    'inline-flex items-center justify-center gap-2 px-6 py-3 font-semibold rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2';

  // Type-specific styles
  const typeStyles = {
    filled: `${fillColor} ${textColor} ${!isDisabled && !isBusy ? hoverFillColor : ''} dark:${fillColor}`,
    outline: `border-2 ${borderColor} ${textColor} ${!isDisabled && !isBusy ? `hover:${hoverFillColor}` : ''} dark:border-gray-200 dark:${textColor}`,
    plain: `${textColor} ${!isDisabled && !isBusy ? hoverTextColor : ''} dark:${textColor}`,
  };

  // Status styles
  const statusStyles = {
    active: '',
    disabled: 'opacity-50 cursor-not-allowed',
    busy: 'opacity-75 cursor-wait',
  };

  // Content rendering
  const renderContent = () => {
    switch (contentType) {
      case 'icon':
        return Icon ? <Icon size={20} /> : null;
      case 'text':
        return children;
      case 'both':
        return (
          <>
            {Icon && iconPosition === 'left' && <Icon size={20} />}
            <span>{children}</span>
            {Icon && iconPosition === 'right' && <Icon size={20} />}
          </>
        );
    }
  };

  const combinedClassName = `${baseStyles} ${typeStyles[type]} ${statusStyles[status]} ${className}`;

  if (href) {
    return (
      <a
        href={href}
        target={target}
        rel={rel}
        onClick={!isDisabled && !isBusy ? onClick : undefined}
        className={combinedClassName}
        style={{ pointerEvents: isDisabled ? 'none' : 'auto' }}
      >
        {renderContent()}
      </a>
    );
  }

  return (
    <button
      onClick={onClick}
      disabled={isDisabled || isBusy}
      className={combinedClassName}
    >
      {renderContent()}
    </button>
  );
};

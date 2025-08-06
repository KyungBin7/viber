import React from 'react';

interface LoadingProps {
  text?: string;
  className?: string;
  variant?: 'dots' | 'pulse' | 'spinner';
}

const Loading: React.FC<LoadingProps> = ({
  text = "Loading...",
  className = "",
  variant = "dots"
}) => {
  const renderAnimation = () => {
    switch (variant) {
      case 'dots':
        return (
          <div className="flex space-x-1">
            <div className="w-3 h-3 bg-blue-400 rounded-full animate-bounce"></div>
            <div className="w-3 h-3 bg-purple-400 rounded-full animate-bounce delay-75"></div>
            <div className="w-3 h-3 bg-pink-400 rounded-full animate-bounce delay-150"></div>
          </div>
        );
      case 'spinner':
        return (
          <div className="w-8 h-8 border-2 border-gray-600 border-t-blue-400 rounded-full animate-spin"></div>
        );
      case 'pulse':
      default:
        return (
          <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full animate-pulse"></div>
        );
    }
  };

  return (
    <div className={`min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 ${className}`}>
      {renderAnimation()}
      <p className="text-white text-lg mt-4 animate-pulse">{text}</p>
    </div>
  );
};

export default Loading;
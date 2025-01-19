// components/LoadingSpinner.tsx
interface LoadingSpinnerProps {
    size?: 'small' | 'medium' | 'large';
  }
  
  export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ size = 'medium' }) => {
    const sizeClasses = {
      small: 'w-4 h-4',
      medium: 'w-8 h-8',
      large: 'w-12 h-12'
    };
  
    return (
      <div className={`animate-spin ${sizeClasses[size]}`}>
        {/* Spinner SVG */}
      </div>
    );
  };
  
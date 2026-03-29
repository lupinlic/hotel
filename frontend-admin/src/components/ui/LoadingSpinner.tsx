import React from "react";

const LoadingSpinner: React.FC<{ size?: "sm" | "md" | "lg"; className?: string }> = ({ size = "md", className = "" }) => {
  const sizeClass = {
    sm: "w-4 h-4",
    md: "w-6 h-6",
    lg: "w-8 h-8",
  };

  return (
    <div className={`inline-flex items-center justify-center ${className}`}>
      <div
        className={`animate-spin rounded-full border-2 border-t-transparent border-current ${sizeClass[size]}`}
        role="status"
        aria-label="Loading"
      />
    </div>
  );
};

export default LoadingSpinner;

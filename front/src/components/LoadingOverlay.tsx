import React from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface LoadingOverlayProps {
  isVisible: boolean;
  message?: string;
  className?: string;
  backdropClassName?: string;
  spinnerClassName?: string;
  messageClassName?: string;
}

const LoadingOverlay: React.FC<LoadingOverlayProps> = ({
  isVisible,
  message = "Transaction en cours...",
  className,
  backdropClassName,
  spinnerClassName,
  messageClassName,
}) => {
  if (!isVisible) return null;

  return (
    <div
      className={cn(
        "fixed inset-0 z-50 flex items-center justify-center",
        "bg-black/50 backdrop-blur-sm",
        backdropClassName
      )}
    >
      <div
        className={cn(
          "bg-white rounded-lg p-6 shadow-lg",
          "flex flex-col items-center justify-center space-y-4",
          "min-w-[200px] min-h-[120px]",
          className
        )}
      >
        <Loader2
          className={cn(
            "w-8 h-8 animate-spin text-genshi-blue-secondary",
            spinnerClassName
          )}
        />
        <p
          className={cn(
            "text-sm text-gray-600 text-center font-medium",
            messageClassName
          )}
        >
          {message}
        </p>
      </div>
    </div>
  );
};

export default LoadingOverlay;
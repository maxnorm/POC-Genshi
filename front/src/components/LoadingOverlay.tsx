import React, { useEffect, useRef } from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface LoadingOverlayProps {
  isVisible: boolean;
  message?: string;
  className?: string;
  backdropClassName?: string;
  spinnerClassName?: string;
  messageClassName?: string;
  dismissible?: boolean;
  onDismiss?: () => void;
}

const LoadingOverlay: React.FC<LoadingOverlayProps> = ({
  isVisible,
  message = "Transaction en cours...",
  className,
  backdropClassName,
  spinnerClassName,
  messageClassName,
  dismissible = false,
  onDismiss,
}) => {
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isVisible) {
      document.body.style.overflow = 'hidden';
      
      if (overlayRef.current) {
        overlayRef.current.focus();
      }

      return () => {
        document.body.style.overflow = 'unset';
      };
    }
  }, [isVisible]);

  const handleBackdropClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (dismissible && onDismiss) {
      onDismiss();
    }
  };

  const handleContentClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  if (!isVisible) return null;

  return (
    <div
      ref={overlayRef}
      tabIndex={-1}
      className={cn(
        "fixed inset-0 z-[10000] flex items-center justify-center w-screen h-screen",
        "bg-black/50 backdrop-blur-sm",
        "pointer-events-auto",
        backdropClassName
      )}
      onClick={handleBackdropClick}
      onMouseDown={(e) => e.preventDefault()}
      onTouchStart={(e) => e.preventDefault()}
      onKeyDown={(e) => {
        if (e.key === 'Escape' && dismissible && onDismiss) {
          onDismiss();
        }
      }}
    >
      <div
        className={cn(
          "bg-white rounded-lg p-6 shadow-lg",
          "flex flex-col items-center justify-center space-y-4",
          "min-w-[200px] min-h-[120px]",
          "pointer-events-auto",
          className
        )}
        onClick={handleContentClick}
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
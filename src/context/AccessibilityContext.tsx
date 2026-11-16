import React from 'react';
import { useDoseBridge } from '../store/useDoseBridge';
import { useAppSelector } from '../store/hooks';

// Context API is replaced with Redux Toolkit store.
// AccessibilityProvider is kept as a transparent passthrough wrapper with ARIA live announcer.
export const AccessibilityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const announcement = useAppSelector((state) => state.accessibility.announcement);

  return (
    <>
      {/* Hidden ARIA Live region for screen readers */}
      <div aria-live="polite" aria-atomic="true" className="sr-only">
        {announcement}
      </div>
      {children}
    </>
  );
};

// All accessibility state & actions flow directly through Redux Toolkit
export const useAccessibility = () => {
  return useDoseBridge();
};

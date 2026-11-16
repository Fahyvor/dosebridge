import React from 'react';
import { useDoseBridge } from '../store/useDoseBridge';

// Context API is replaced with Redux Toolkit store.
// AppProvider is kept as a transparent passthrough wrapper.
export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <>{children}</>;
};

// All state & actions now flow directly through Redux Toolkit
export const useApp = () => {
  return useDoseBridge();
};

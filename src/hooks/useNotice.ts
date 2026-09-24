import { createContext, useContext } from 'react';

export type NoticeVariant = 'success' | 'error' | 'info';

export interface Notice {
  variant: NoticeVariant;
  title: string;
  // Say what happened in plain words: the readers are not technical
  description: string;
  // Short "what to do now" instructions, shown as a numbered list
  steps?: string[];
}

interface NoticeContextValue {
  showNotice: (notice: Notice) => void;
}

export const NoticeContext = createContext<NoticeContextValue | null>(null);

// Tells the user something through a modal that has to be dismissed, instead of a toast that fades away
export const useNotice = () => {
  const context = useContext(NoticeContext);
  if (!context) throw new Error('useNotice must be used inside <NoticeProvider>');
  return context;
};

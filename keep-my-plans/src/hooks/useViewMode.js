import { useState } from 'react';
import { VIEW_MODES } from '../constants';

export const useViewMode = () => {
  const [viewMode, setViewModeState] = useState(() => {
    const savedMode = localStorage.getItem('watchqueue_view');
    return savedMode || VIEW_MODES.QUEUE;
  });

  const setViewMode = (mode) => {
    setViewModeState(mode);
    localStorage.setItem('watchqueue_view', mode);
  };

  return { viewMode, setViewMode };
};
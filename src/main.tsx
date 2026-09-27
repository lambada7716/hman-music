import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import { ErrorBoundary } from './components/ErrorBoundary.tsx';
import './index.css';

// Handle unhandled promise rejections gracefully to prevent runtime crash
window.addEventListener('unhandledrejection', (event) => {
  // Prevent browser's default fatal error logging
  event.preventDefault();

  const reason = event.reason;
  const isHarmless =
    reason?.name === 'AbortError' ||
    reason?.name === 'NotAllowedError' ||
    (typeof reason === 'string' &&
      (reason.includes('user gesture') ||
        reason.includes('AudioContext') ||
        reason.includes('AbortError'))) ||
    (reason?.message &&
      (reason.message.includes('user gesture') ||
        reason.message.includes('AudioContext') ||
        reason.message.includes('The play() request was interrupted')));

  if (!isHarmless && reason) {
    console.warn('Unhandled rejection captured:', reason);
  }
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>
);

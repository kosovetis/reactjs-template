import { createRoot } from 'react-dom/client';
import { StrictMode } from 'react';

import { init } from '@/init';
import { Root } from '@/components/Root';

import './index.css';

// Mock Telegram environment for development.
import './mockEnv';

const platform = new URLSearchParams(window.location.search).get('tgWebAppPlatform');

// Initialize the SDK.
init({
  debug: import.meta.env.DEV,
  eruda: import.meta.env.DEV,
  // A bug in Telegram for macOS makes it necessary to mock the environment.
  mockForMacOS: platform === 'macos',
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Root />
  </StrictMode>,
);
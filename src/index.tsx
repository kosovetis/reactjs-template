import { createRoot } from 'react-dom/client';
import { StrictMode } from 'react';
import { init } from './init'; // <-- 1. Импортировать функцию
import './mockEnv';
import { Root } from './components/Root';
import './index.css';

// 2. Вызвать инициализацию перед отрисовкой приложения
init({ debug: true, eruda: true, mockForMacOS: true }).then(() => {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <Root />
    </StrictMode>,
  );
});
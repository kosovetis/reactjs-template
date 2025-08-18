// src/utils/analytics.ts

// ID счетчика Яндекс.Метрики
const YANDEX_COUNTER_ID = 103789750;

// Функция для безопасного вызова Яндекс.Метрики
export const trackEvent = (goal: string, params?: object) => {
  try {
    if (typeof window !== 'undefined' && window.ym) {
      window.ym(YANDEX_COUNTER_ID, 'reachGoal', goal, params);
      console.log('✅ Яндекс.Метрика: событие отправлено', goal, params);
    } else {
      console.warn('⚠️ Яндекс.Метрика не загружена');
    }
  } catch (error) {
    console.error('❌ Ошибка отправки события в Яндекс.Метрику:', error);
  }
};

// Предустановленные события для вашего приложения
export const AnalyticsEvents = {
  TEST_STARTED: 'test_started',
  TEST_COMPLETED: 'test_completed', 
  GUIDE_CLICKED: 'guide_clicked',
  BLOCK_COMPLETED: 'block_completed',
  TEST_RESTARTED: 'test_restarted'
} as const;

// Типизация для TypeScript
declare global {
  interface Window {
    ym: (counterId: number, method: string, goal?: string, params?: object) => void;
  }
}
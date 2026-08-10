// Дизайн-токены kosovetis.com — перенесены из own-products/website/index.html (:root).
// Светлая тема сайта: белая страница, бирюза + оранжевый, крем-подложки,
// Unbounded для заголовков, Onest для текста.

import type { CSSProperties } from 'react';

export const colors = {
  bg: '#ffffff',
  panel: '#f0fafb',      // светлейший бирюза-тинт: фоны чипов и карточек (--c-base-soft-1)
  panel2: '#ddf1f5',     // бирюза-тинт плотнее (--c-base-soft-2)
  track: '#eef1f4',      // нейтральный трек шкал и прогресс-бара

  ink: '#2d3748',        // основной текст (--c-ink)
  inkSoft: '#4a5568',    // второстепенный текст (--c-ink-soft)
  inkFaint: '#8492a6',   // подписи, цифры шкал

  line: '#e2e8f0',
  lineStrong: '#cbd5e0',

  base: '#79cfdd',       // светлая бирюза: теги, тинты (--c-base)
  baseDeep: '#4bacbe',   // глубокая бирюза: рамки, градиенты (--c-base-deep)
  accent: '#ec672d',     // оранжевый: заголовки и действия (--c-accent)
  accentDeep: '#d64427', // тёмный оранжевый: градиенты (--c-accent-deep)

  white: '#ffffff',
} as const;

export const gradients = {
  accent: 'linear-gradient(135deg, #ec672d 0%, #d64427 100%)',           // --grad-accent
  base: 'linear-gradient(135deg, #79cfdd 0%, #4bacbe 100%)',             // --grad-base
  hero: 'linear-gradient(115deg, #f0b6a0 0%, #e9f1e9 48%, #86d4e2 100%)', // --grad-hero
  bandChroma: 'linear-gradient(122deg, #e7f5f3 0%, #f7f0e7 55%, #fbe7dd 100%)', // --band-chroma
} as const;

// Растворение низа hero-подложки в белом — smoothstep (3x²−2x³), как на сайте:
// пологая кривая на обоих концах, не видно ни начала фейда, ни прихода в белый.
export const heroFade =
  'linear-gradient(to bottom, rgba(255,255,255,0) 0%, rgba(255,255,255,0.04) 12.5%, ' +
  'rgba(255,255,255,0.16) 25%, rgba(255,255,255,0.32) 37.5%, rgba(255,255,255,0.5) 50%, ' +
  'rgba(255,255,255,0.68) 62.5%, rgba(255,255,255,0.84) 75%, rgba(255,255,255,0.96) 87.5%, ' +
  'rgba(255,255,255,1) 100%)';

// Маркерная подсветка ключевых фраз — фирменный приём сайта (.highlight-word).
export const highlightWord: CSSProperties = {
  background: 'linear-gradient(transparent 52%, rgba(121, 207, 221, 0.5) 52%)',
  padding: '0 1px',
  fontWeight: 600,
};

// Заголовок-секция сайта: оранжевый градиент, обрезанный по тексту (.section-title).
export const gradTitle: CSSProperties = {
  background: gradients.accent,
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  backgroundClip: 'text',
};

export const font = {
  display: "'Unbounded', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  text: "'Onest', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
  heading: 700,
  semibold: 600,
  medium: 500,
  regular: 400,
} as const;

// Оранжевая pill-кнопка действия — как .cta-button на сайте.
export const ctaButton: CSSProperties = {
  display: 'inline-block',
  background: gradients.accent,
  color: colors.white,
  padding: '15px 32px',
  borderRadius: '999px',
  fontSize: '16px',
  fontWeight: font.semibold,
  border: 'none',
  fontFamily: font.text,
  boxShadow: '0 4px 15px rgba(236, 103, 45, 0.4)',
  transition: 'all 0.3s ease',
  cursor: 'pointer',
};

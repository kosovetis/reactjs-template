// src/phrases.ts
export const blocks = [
  // Блок 1 (например, «Миссия бренда»)
  [
    { id: 'H1', text: 'Мы вдохновляем клиентов побеждать трудности', archetype: 'hero' },
    { id: 'R1', text: 'Мы устанавливаем стандарты отрасли',           archetype: 'ruler' },
    { id: 'C1', text: 'Мы создаём новое, а не улучшаем старое',        archetype: 'creator' },
    { id: 'J1', text: 'Мы превращаем серьёзное в игру',               archetype: 'jester' },
    { id: "S1", text: "Мы слушаем клиентов и быстро отвечаем", archetype: "caregiver" },

    /* ещё 8 фраз этого блока */
  ],

  // Блок 2 (например, «Голос / тон общения»)
  [
    { id: 'H2', text: 'Наш тон — воодушевляющий и энергичный', archetype: 'hero' },
    { id: 'R2', text: 'Наш тон — авторитетный и уверенный',     archetype: 'ruler' },
    /* … всего 12 фраз */
  ],

  /* всего 7 таких массивов */
];

// Быстрая помощь серверу: таблица «id → архетип»
export const idToArch = Object.fromEntries(
  blocks.flat().map(({ id, archetype }) => [id, archetype])
);

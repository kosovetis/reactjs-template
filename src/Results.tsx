import { useMemo, useEffect, CSSProperties } from "react";
import { openLink } from '@telegram-apps/sdk-react';
import { blocks } from "./phrases";
import { trackEvent, AnalyticsEvents } from "./utils/analytics.ts";
import { colors, font, gradients, gradTitle, highlightWord, ctaButton } from "./styles/tokens";

interface ResultsProps {
  results?: { blockIndex: number; selected: string[]; ranked: string[] }[];
  onRestart: () => void;
  idToArch: Record<string, string>;
  /* false — служебный превью-режим (/#/preview): события в Метрику не отправляются */
  tracking?: boolean;
}

interface ArchetypeData {
  name: string;
  emoji: string;
  color: string;
  description: string;
  traits: string[];
  examples: string[];
}

// Цвета архетипов разведены по hue для различимости шкал на белом фоне.
const archetypeDescriptions: Record<string, ArchetypeData> = {
  caregiver: { name: "ЗАБОТЛИВЫЙ", emoji: "🤲", color: "#14B8A6", description: "Защищает и поддерживает — словно надёжный друг, который всегда подставит плечо, делая мир безопаснее.", traits: ["Забота", "Сопереживание", "Желание помочь", "Альтруизм"], examples: ["Johnson & Johnson", "Nivea", "Pampers"] },
  jester: { name: "ШУТ", emoji: "🎭", color: "#F59E0B", description: "Снимает напряжение, прогоняет скуку и заряжает юмором, помогая жить здесь и сейчас и наслаждаться моментом.", traits: ["Юмор", "Веселье", "Оптимизм", "Легкость"], examples: ["Burger King", "Old Spice", "Skittles"] },
  magician: { name: "МАГ", emoji: "🪄", color: "#7C3AED", description: "Воплощает невозможное, расширяя границы реальности и вдохновляя людей.", traits: ["Инновации", "Визионерство", "Трансформация", "Возможности"], examples: ["Apple", "Disney", "Dyson"] },
  hero: { name: "ГЕРОЙ", emoji: "🏆", color: "#DC2626", description: "Бросает вызов трудностям и ведёт за собой, мотивируя преодолевать препятствия и достигать смелых целей.", traits: ["Мужество", "Решительность", "Честь", "Мотивация"], examples: ["Nike", "Red Bull", "BMW"] },
  creator: { name: "ТВОРЕЦ", emoji: "🎨", color: "#A855F7", description: "Открывает возможности к самовыражению и созданию нового, воплощая идеи в уникальные формы и поощряя оригинальное видение.", traits: ["Креативность", "Воображение", "Самовыражение", "Оригинальность"], examples: ["Adobe", "LEGO", "Pinterest"] },
  rebel: { name: "БУНТАРЬ", emoji: "⚡", color: "#991B1B", description: "Бросает вызов статус-кво, шокирует и нарушает правила, дает ощущение настоящей свободы.", traits: ["Нарушение правил", "Освобождение", "Дерзость", "Шок"], examples: ["Harley-Davidson","Diesel"] },
  sage: { name: "МУДРЕЦ", emoji: "📚", color: "#2563EB", description: "Раскрывает истину и делится проверенными знаниями, избавляя от заблуждений и проясняя картину мира.", traits: ["Мудрость", "Знания", "Истина", "Интеллект"], examples: ["Google", "National Geographic", "BBC"] },
  everyman: { name: "СЛАВНЫЙ МАЛЫЙ", emoji: "🤝", color: "#65A30D", description: "«Такой же, как ты»: понимает повседневные заботы и создаёт ощущение домашнего уюта, где каждому рады.", traits: ["Принадлежность", "Понятность", "Дружелюбие", "Доступность"], examples: ["IKEA", "Пятерочка"] },
  ruler: { name: "ПРАВИТЕЛЬ", emoji: "👑", color: "#92400E", description: "Устанавливает порядок и поднимает планку, обещая превосходное качество и статус тем, кто следует за ним.", traits: ["Лидерство", "Влияние", "Престиж"], examples: ["Mercedes-Benz", "Rolex"] },
  innocent: { name: "НЕВИННЫЙ", emoji: "🌸", color: "#EC4899", description: "Как луч света: дарит ощущение чистоты, надежды и радости маленьких моментов.", traits: ["Оптимизм", "Честность", "Чистота", "Простота"], examples: ["Coca-Cola", "Kinder"] },
  explorer: { name: "ИССЛЕДОВАТЕЛЬ", emoji: "🧭", color: "#16A34A", description: "Расширяет горизонты и зовёт к приключениям, помогая открывать новое и сохранять чувство свободы.", traits: ["Свобода", "Поиск", "Неутомимость"], examples: ["Jeep", "The North Face", "GoPro"] },
  lover: { name: "ЛЮБОВНИК", emoji: "❤️", color: "#BE185D", description: "Очаровывает эстетикой и чувственностью, дарит насыщенные эмоции и удовольствие, создавая атмосферу глубокой связи.", traits: ["Чувственность", "Наслаждение", "Эстетика", "Удовольствие"], examples: ["Victoria's Secret", "Godiva"] }
};

// Максимальный балл одного архетипа: на каждом блоке топ-1 даёт 5 баллов.
const MAX_SCORE = blocks.length * 5;

function Results({ results, onRestart, idToArch, tracking = true }: ResultsProps) {
  const archetypeScores = useMemo(() => {
    if (!results) return {};
    const scores: Record<string, number> = {};
    results.forEach(({ ranked }) => {
      ranked.forEach((id, index) => {
        const archetype = idToArch[id];
        if (archetype) {
          const points = 5 - index;
          scores[archetype] = (scores[archetype] || 0) + points;
        }
      });
    });
    return scores;
  }, [results, idToArch]);

  // Все 12 архетипов со счётом (отсутствующие = 0), отсортированы по убыванию.
  const ranking = useMemo(() => {
    return Object.entries(archetypeDescriptions)
      .map(([slug, data]) => ({ slug, data, score: archetypeScores[slug] ?? 0 }))
      .sort((a, b) => b.score - a.score);
  }, [archetypeScores]);

  const first = ranking[0];
  const second = ranking[1];

  useEffect(() => {
    window.scrollTo(0, 0);
    if (tracking && first && second && first.score > 0) {
      trackEvent(AnalyticsEvents.TEST_COMPLETED, {
        primary_archetype: first.slug,
        primary_score: first.score,
        secondary_archetype: second.slug,
        secondary_score: second.score,
        total_archetypes: ranking.length
      });
    }
  }, [tracking, first, second, ranking.length]);

  if (!results || !first || first.score === 0) {
    return <div style={{ padding: 24, fontFamily: font.text, color: colors.ink }}>Ошибка: не удалось определить архетип</div>;
  }

  const handleGuideClick = () => {
    if (tracking) {
      trackEvent(AnalyticsEvents.GUIDE_CLICKED, {
        primary_archetype: first.slug,
        secondary_archetype: second ? second.slug : null,
        primary_score: first.score
      });
    }

    // Используем openLink для внешних сайтов
    openLink('https://archetypes-guide.vercel.app/');
  };

  // ── Стили ───────────────────────────────────────────────
  const containerStyle: CSSProperties = {
    padding: "28px 24px 40px",
    maxWidth: "680px",
    margin: "0 auto",
    fontFamily: font.text,
    color: colors.ink,
  };

  // Заголовок как .section-title на сайте: оранжевый градиент по тексту
  const mainTitleStyle: CSSProperties = {
    ...gradTitle,
    fontFamily: font.display,
    fontSize: "24px",
    fontWeight: font.heading,
    textAlign: "left",
    lineHeight: "1.3",
    letterSpacing: "-0.5px",
    marginBottom: "28px",
  };

  const badgeMain: CSSProperties = {
    display: "inline-block",
    fontSize: "10.5px",
    fontWeight: font.semibold,
    letterSpacing: "1px",
    textTransform: "uppercase",
    color: colors.white,
    background: gradients.accent,
    padding: "3px 10px",
    borderRadius: "999px",
  };

  const badgeSecondary: CSSProperties = {
    ...badgeMain,
    color: colors.baseDeep,
    background: "transparent",
    border: `1.5px solid ${colors.baseDeep}`,
    padding: "2px 9px",
  };

  const ctaBlockStyle: CSSProperties = {
    padding: "28px 24px",
    background: gradients.bandChroma,
    borderRadius: "20px",
    textAlign: "center",
    marginBottom: "28px",
  };

  const ctaHeadlineStyle: CSSProperties = {
    fontFamily: font.display,
    fontSize: "19px",
    fontWeight: font.semibold,
    lineHeight: "1.35",
    letterSpacing: "-0.3px",
    marginBottom: "16px",
    color: colors.ink,
  };

  const ctaTextStyle: CSSProperties = {
    fontSize: "15px",
    lineHeight: "1.55",
    marginBottom: "24px",
    color: colors.inkSoft,
  };

  const restartButtonStyle: CSSProperties = {
    background: "none",
    border: "none",
    color: colors.inkFaint,
    fontSize: "14px",
    fontFamily: font.text,
    textDecoration: "underline",
    cursor: "pointer",
    padding: "8px 0",
    display: "block",
    margin: "0 auto",
  };

  return (
    <div style={containerStyle}>
      <h1 style={mainTitleStyle}>Ваши архетипы:</h1>

      {/* Полный рейтинг всех 12 архетипов со шкалами */}
      <div style={{ marginBottom: "36px" }}>
        {ranking.map((entry, index) => {
          const pct = MAX_SCORE > 0 ? Math.round((entry.score / MAX_SCORE) * 100) : 0;
          const isTop2 = index < 2;
          return (
            <div key={entry.slug} style={{ marginBottom: "16px", opacity: entry.score === 0 ? 0.55 : 1 }}>
              {isTop2 && (
                <div style={{ marginBottom: "6px" }}>
                  <span style={index === 0 ? badgeMain : badgeSecondary}>
                    {index === 0 ? "Основной" : "Дополнительный"}
                  </span>
                </div>
              )}
              <div style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                marginBottom: "6px", fontSize: "14.5px",
                fontWeight: isTop2 ? font.heading : font.medium,
                color: isTop2 ? colors.ink : colors.inkSoft,
              }}>
                <span>
                  <span style={{ marginRight: "6px" }}>{entry.data.emoji}</span>
                  {entry.data.name}
                </span>
                <span style={{ color: colors.inkFaint, fontSize: "12.5px", fontWeight: font.medium, flexShrink: 0, marginLeft: "8px" }}>
                  {entry.score}/{MAX_SCORE}
                </span>
              </div>
              <div style={{
                height: "10px", width: "100%", backgroundColor: colors.track,
                borderRadius: "999px", overflow: "hidden",
              }}>
                <div style={{
                  height: "100%", width: `${pct}%`,
                  background: entry.data.color,
                  boxShadow: isTop2 ? `0 0 12px ${entry.data.color}55` : "none",
                  borderRadius: "999px", transition: "width 0.5s ease",
                }} />
              </div>
            </div>
          );
        })}
      </div>

      <div style={ctaBlockStyle}>
        <h3 style={ctaHeadlineStyle}>
          Как использовать эти результаты?
        </h3>
        <div style={{ ...ctaTextStyle, textAlign: "left" }}>
          <p style={{ marginBottom: "14px" }}>
            Архетип – это основа для всей коммуникации бренда.
          </p>
          <p style={{ marginBottom: "14px" }}>
            У меня есть целый <b>ГАЙД</b>, из которого вы узнаете{' '}
            <span style={highlightWord}>тёмную сторону вашего архетипа и его суперсилу</span>,
            какие ценности он транслирует вашей аудитории, и как не попасть в ловушку.
          </p>
          <p style={{ marginBottom: "0" }}>
            А еще – узнаете, как превратить это знание в реальный инструмент, как отстроиться
            от конкурентов, и как говорить с клиентами, чтобы они не только доверяли, но и покупали.
          </p>
        </div>

        <button
          onClick={handleGuideClick}
          style={ctaButton}
          onMouseEnter={(e: React.MouseEvent<HTMLButtonElement>) => {
            e.currentTarget.style.transform = "translateY(-2px)";
            e.currentTarget.style.boxShadow = "0 8px 25px rgba(236, 103, 45, 0.6)";
          }}
          onMouseLeave={(e: React.MouseEvent<HTMLButtonElement>) => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow = "0 4px 15px rgba(236, 103, 45, 0.4)";
          }}
        >
          Получить Гайд
        </button>
      </div>

      <div style={{ textAlign: "center" }}>
        <button onClick={onRestart} style={restartButtonStyle}>
          Пройти тест заново
        </button>
      </div>
    </div>
  );
}

export default Results;

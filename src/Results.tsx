import { useMemo, useEffect, CSSProperties } from "react";
import { openLink } from '@telegram-apps/sdk-react';
import { trackEvent, AnalyticsEvents } from "./utils/analytics.ts";

interface ResultsProps {
  results?: { blockIndex: number; selected: string[]; ranked: string[] }[];
  onRestart: () => void;
  idToArch: Record<string, string>;
}

interface ArchetypeData {
  name: string;
  emoji: string;
  color: string;
  description: string;
  traits: string[];
  examples: string[];
}

const archetypeDescriptions: Record<string, ArchetypeData> = {
  caregiver: { name: "ЗАБОТЛИВЫЙ", emoji: "🤲", color: "#10B981", description: "Защищает и поддерживает — словно надёжный друг, который всегда подставит плечо, делая мир безопаснее.", traits: ["Забота", "Сопереживание", "Желание помочь", "Альтруизм"], examples: ["Johnson & Johnson", "Nivea", "Pampers"] },
  jester: { name: "ШУТ", emoji: "🎭", color: "#F59E0B", description: "Снимает напряжение, прогоняет скуку и заряжает юмором, помогая жить здесь и сейчас и наслаждаться моментом.", traits: ["Юмор", "Веселье", "Оптимизм", "Легкость"], examples: ["Burger King", "Old Spice", "Skittles"] },
  magician: { name: "МАГ", emoji: "🪄", color: "#8B5CF6", description: "Воплощает невозможное, расширяя границы реальности и вдохновляя людей.", traits: ["Инновации", "Визионерство", "Трансформация", "Возможности"], examples: ["Apple", "Disney", "Dyson"] },
  hero: { name: "ГЕРОЙ", emoji: "🏆", color: "#DC2626", description: "Бросает вызов трудностям и ведёт за собой, мотивируя преодолевать препятствия и достигать смелых целей.", traits: ["Мужество", "Решительность", "Честь", "Мотивация"], examples: ["Nike", "Red Bull", "BMW"] },
  creator: { name: "ТВОРЕЦ", emoji: "🎨", color: "#7C3AED", description: "Открывает возможности к самовыражению и созданию нового, воплощая идеи в уникальные формы и поощряя оригинальное видение.", traits: ["Креативность", "Воображение", "Самовыражение", "Оригинальность"], examples: ["Adobe", "LEGO", "Pinterest"] },
  rebel: { name: "БУНТАРЬ", emoji: "⚡", color: "#991B1B", description: "Бросает вызов статус-кво, шокирует и нарушает правила, дает ощущение настоящей свободы.", traits: ["Нарушение правил", "Освобождение", "Дерзость", "Шок"], examples: ["Harley-Davidson","Diesel"] },
  sage: { name: "МУДРЕЦ", emoji: "📚", color: "#1E40AF", description: "Раскрывает истину и делится проверенными знаниями, избавляя от заблуждений и проясняя картину мира.", traits: ["Мудрость", "Знания", "Истина", "Интеллект"], examples: ["Google", "National Geographic", "BBC"] },
  everyman: { name: "СЛАВНЫЙ МАЛЫЙ", emoji: "🤝", color: "#059669", description: "«Такой же, как ты»: понимает повседневные заботы и создаёт ощущение домашнего уюта, где каждому рады.", traits: ["Принадлежность", "Понятность", "Дружелюбие", "Доступность"], examples: ["IKEA", "Пятерочка"] },
  ruler: { name: "ПРАВИТЕЛЬ", emoji: "👑", color: "#7C2D12", description: "Устанавливает порядок и поднимает планку, обещая превосходное качество и статус тем, кто следует за ним.", traits: ["Лидерство", "Влияние", "Престиж"], examples: ["Mercedes-Benz", "Rolex"] },
  innocent: { name: "НЕВИННЫЙ", emoji: "🌸", color: "#DB2777", description: "Как луч света: дарит ощущение чистоты, надежды и радости маленьких моментов.", traits: ["Оптимизм", "Честность", "Чистота", "Простота"], examples: ["Coca-Cola", "Kinder"] },
  explorer: { name: "ИССЛЕДОВАТЕЛЬ", emoji: "🧭", color: "#16A34A", description: "Расширяет горизонты и зовёт к приключениям, помогая открывать новое и сохранять чувство свободы.", traits: ["Свобода", "Поиск", "Неутомимость"], examples: ["Jeep", "The North Face", "GoPro"] },
  lover: { name: "ЛЮБОВНИК", emoji: "❤️", color: "#BE185D", description: "Очаровывает эстетикой и чувственностью, дарит насыщенные эмоции и удовольствие, создавая атмосферу глубокой связи.", traits: ["Чувственность", "Наслаждение", "Эстетика", "Удовольствие"], examples: ["Victoria's Secret", "Godiva"] }
};

function Results({ results, onRestart, idToArch }: ResultsProps) {
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

  const sortedArchetypes = Object.entries(archetypeScores).sort(([, a], [, b]) => (b as number) - (a as number));
  const [first, second] = sortedArchetypes;

  useEffect(() => {
    window.scrollTo(0, 0);
    
    if (first && second) {
      trackEvent(AnalyticsEvents.TEST_COMPLETED, {
        primary_archetype: first[0],
        primary_score: first[1],
        secondary_archetype: second[0],
        secondary_score: second[1],
        total_archetypes: sortedArchetypes.length
      });
    }
  }, [first, second, sortedArchetypes.length]);

  if (!results || !first) return <div>Ошибка: не удалось определить архетип</div>;

  const handleGuideClick = () => {
    trackEvent(AnalyticsEvents.GUIDE_CLICKED, {
      primary_archetype: first[0],
      secondary_archetype: second ? second[0] : null,
      primary_score: first[1]
    });

    // Используем openLink для внешних сайтов
    openLink('https://archetypes-guide.vercel.app/');
  };


  // Стили
  const containerStyle: CSSProperties = {
    padding: "24px",
    maxWidth: "800px",
    margin: "0 auto",
    fontFamily: "'Montserrat', sans-serif",
    paddingBottom: "32px"
  };

  const mainTitleStyle: CSSProperties = {
    fontSize: "28px",
    fontWeight: "700",
    textAlign: "center",
    marginBottom: "32px",
    fontFamily: "'Montserrat', sans-serif",
    color: "#1f2937"
  };

  const archetypeContainerStyle: CSSProperties = {
    marginBottom: "48px",
    textAlign: "center",
    padding: "24px",
    borderRadius: "16px",
    backgroundColor: "#f9fafb",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)"
  };

  const emojiStyle: CSSProperties = {
    fontSize: "48px",
    marginBottom: "16px",
    display: "block"
  };

  const archetypeNameStyle: CSSProperties = {
    fontSize: "24px",
    fontWeight: "700",
    marginBottom: "16px",
    fontFamily: "'Montserrat', sans-serif"
  };

  const descriptionStyle: CSSProperties = {
    fontSize: "18px",
    lineHeight: "1.6",
    maxWidth: "600px",
    margin: "0 auto 24px",
    fontFamily: "'Montserrat', sans-serif",
    color: "#374151"
  };

  const sectionTitleStyle: CSSProperties = {
    fontSize: "18px",
    fontWeight: "600",
    marginBottom: "12px",
    fontFamily: "'Montserrat', sans-serif",
    color: "#1f2937"
  };

  const traitsListStyle: CSSProperties = {
    listStyle: "none",
    padding: 0,
    margin: "0 0 24px 0",
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: "8px"
  };

  const traitItemStyle: CSSProperties = {
    background: "#e5e7eb",
    padding: "6px 12px",
    borderRadius: "20px",
    fontSize: "14px",
    fontFamily: "'Montserrat', sans-serif",
    color: "#374151"
  };

  const examplesStyle: CSSProperties = {
    fontSize: "16px",
    fontFamily: "'Montserrat', sans-serif",
    color: "#6b7280"
  };

  const ctaBlockStyle: CSSProperties = {
    padding: "32px",
    backgroundColor: "#3b82f6",
    borderRadius: "12px",
    textAlign: "center",
    marginBottom: "32px",
    border: "2px solid #2563eb",
    position: "relative"
  };

  const ctaEmojiStyle: CSSProperties = {
    fontSize: "48px",
    marginBottom: "20px",
    display: "block",
    textAlign: "center"
  };

  const ctaHeadlineStyle: CSSProperties = {
    fontSize: "22px",
    fontWeight: "700",
    lineHeight: "1.3",
    marginBottom: "16px",
    fontFamily: "'Montserrat', sans-serif",
    color: "white"
  };

  const ctaTextStyle: CSSProperties = {
    fontSize: "16px",
    lineHeight: "1.5",
    marginBottom: "24px",
    fontFamily: "'Montserrat', sans-serif",
    color: "white",
    opacity: 0.95
  };

  const ctaButtonStyle: CSSProperties = {
    display: "inline-block",
    backgroundColor: "white",
    color: "#3b82f6",
    padding: "16px 32px",
    borderRadius: "8px",
    fontSize: "16px",
    fontWeight: "700",
    border: "2px solid white",
    fontFamily: "'Montserrat', sans-serif",
    transition: "all 0.2s ease",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
    cursor: "pointer",
  };

  const restartButtonStyle: CSSProperties = {
    background: "none",
    border: "none",
    color: "#3b82f6",
    fontSize: "16px",
    fontFamily: "'Montserrat', sans-serif",
    textDecoration: "underline",
    cursor: "pointer",
    padding: "8px 0",
    display: "block",
    margin: "0 auto"
  };

  return (
    <div style={containerStyle}>
      <h1 style={mainTitleStyle}>Ваши архетипы:</h1>

      {[first, second].map(([arch], index) => {
        const data = archetypeDescriptions[arch as keyof typeof archetypeDescriptions];
        if (!data) return null;

        return (
          <div key={arch} style={archetypeContainerStyle}>
            <span style={emojiStyle}>{data.emoji}</span>
            <h2 style={{ ...archetypeNameStyle, color: "#1f2937" }}>
              <span style={{ color: "#1f2937" }}>{index === 0 ? "ОСНОВНОЙ: " : "ДОПОЛНИТЕЛЬНЫЙ: "}</span>
              <span style={{ color: data.color }}>{data.name}</span>
            </h2>
            <p style={descriptionStyle}>{data.description}</p>

            <div>
              <h3 style={sectionTitleStyle}>Ключевые черты:</h3>
              <ul style={traitsListStyle}>
                {data.traits.map((trait, idx) => (
                  <li key={idx} style={traitItemStyle}>{trait}</li>
                ))}
              </ul>
            </div>

            <div>
              <h3 style={sectionTitleStyle}>Примеры брендов:</h3>
              <p style={examplesStyle}>{data.examples.join(", ")}</p>
            </div>

            {index === 0 && (
              <div style={{
                marginTop: "32px",
                textAlign: "center"
              } as CSSProperties}>
                <div style={{
                  display: "inline-block",
                  color: "#9ca3af",
                  fontSize: "10px",
                  fontWeight: "600",
                  fontFamily: "'Montserrat', sans-serif",
                  letterSpacing: "1px",
                  border: "1px solid #d1d5db",
                  borderRadius: "12px",
                  padding: "6px 12px",
                  marginBottom: "8px"
                } as CSSProperties}>
                  SCROLL
                </div>
                <div style={{ 
                  fontSize: "18px",
                  lineHeight: "0.8",
                  opacity: 0.7,
                  color: "#9ca3af",
                  animation: "bounce 2s infinite"
                } as CSSProperties}>
                  <style>{`
                    @keyframes bounce {
                      0%, 20%, 50%, 80%, 100% {
                        transform: translateY(0);
                      }
                      40% {
                        transform: translateY(-5px);
                      }
                      60% {
                        transform: translateY(-3px);
                      }
                    }
                  `}</style>
                  ⌄<br/>⌄<br/>⌄
                </div>
              </div>
            )}
          </div>
        );
      })}

      <div style={ctaBlockStyle}>
        <span style={ctaEmojiStyle}>👩‍💼</span>
        <h3 style={ctaHeadlineStyle}>
          Как использовать эти результаты?
        </h3>
        <div style={{ ...ctaTextStyle, textAlign: "center" as const }}>
          <p style={{ marginBottom: "16px" }}>
            Архетип – это основа для всей коммуникации бренда.
          </p>
          <p style={{ marginBottom: "16px" }}>
            У меня есть целый <strong>ГАЙД</strong>, из которого вы узнаете темную сторону вашего архетипа и его суперсилу, какие ценности он транслирует вашей аудитории, и как не попасть в ловушку.
          </p>
          <p style={{ marginBottom: "0" }}>
            А еще – узнаете, как превратить это знание в реальный инструмент, как отстроиться от конкурентов, и как говорить с клиентами, чтобы они не только доверяли, но и покупали.
          </p>
        </div>
        
        <button
          onClick={handleGuideClick}
          style={ctaButtonStyle}
          onMouseEnter={(e: React.MouseEvent<HTMLButtonElement>) => {
            const target = e.currentTarget;
            target.style.backgroundColor = "#f3f4f6";
            target.style.color = "#1f2937";
            target.style.transform = "translateY(-2px)";
            target.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.2)";
          }}
          onMouseLeave={(e: React.MouseEvent<HTMLButtonElement>) => {
            const target = e.currentTarget;
            target.style.backgroundColor = "white";
            target.style.color = "#3b82f6";
            target.style.transform = "translateY(0)";
            target.style.boxShadow = "none";
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
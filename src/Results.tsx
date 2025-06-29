// src/Results.tsx
import { useMemo, useEffect } from "react";

const archetypeDescriptions = {
  caregiver: { name: "ЗАБОТЛИВЫЙ", emoji: "🤲", color: "#10B981", description: "Ваш бренд стремится помогать другим и заботиться о них. Вы ставите потребности клиентов выше собственной выгоды.", traits: ["Сострадание", "Щедрость", "Желание помочь", "Альтруизм"], examples: ["Johnson & Johnson", "Volvo", "UNICEF"] },
  jester: { name: "ШУТ", emoji: "🎭", color: "#F59E0B", description: "Ваш бренд приносит радость и веселье в жизнь людей. Вы помогаете клиентам наслаждаться моментом.", traits: ["Юмор", "Веселье", "Оптимизм", "Легкость"], examples: ["Ben & Jerry's", "Old Spice", "Skittles"] },
  magician: { name: "МАГ", emoji: "🪄", color: "#8B5CF6", description: "Ваш бренд превращает мечты в реальность. Вы создаете трансформационные решения.", traits: ["Инновации", "Видение", "Трансформация", "Возможности"], examples: ["Apple", "Disney", "Tesla"] },
  hero: { name: "ГЕРОЙ", emoji: "🏆", color: "#DC2626", description: "Ваш бренд вдохновляет людей преодолевать препятствия и достигать целей. Вы мотивируете на подвиги.", traits: ["Мужество", "Решительность", "Честь", "Вдохновение"], examples: ["Nike", "FedEx", "BMW"] },
  creator: { name: "ТВОРЕЦ", emoji: "🎨", color: "#7C3AED", description: "Ваш бренд помогает людям выражать себя и создавать что-то новое. Вы цените оригинальность.", traits: ["Креативность", "Воображение", "Самовыражение", "Оригинальность"], examples: ["Adobe", "LEGO", "Pinterest"] },
  rebel: { name: "БУНТАРЬ", emoji: "⚡", color: "#991B1B", description: "Ваш бренд бросает вызов статус-кво и помогает людям нарушать правила. Вы за революцию.", traits: ["Революция", "Освобождение", "Дикость", "Шок"], examples: ["Harley-Davidson", "Virgin", "Diesel"] },
  sage: { name: "МУДРЕЦ", emoji: "📚", color: "#1E40AF", description: "Ваш бренд помогает людям понимать мир. Вы делитесь знаниями и мудростью.", traits: ["Мудрость", "Знания", "Истина", "Интеллект"], examples: ["Google", "Harvard", "BBC"] },
  everyman: { name: "СЛАВНЫЙ МАЛЫЙ", emoji: "🤝", color: "#059669", description: "Ваш бренд стремится принадлежать и соединять людей. Вы цените подлинность и честность.", traits: ["Принадлежность", "Реализм", "Сочувствие", "Дружелюбие"], examples: ["IKEA", "Home Depot", "Target"] },
  ruler: { name: "ПРАВИТЕЛЬ", emoji: "👑", color: "#7C2D12", description: "Ваш бренд создает процветание и успех. Вы стремитесь к лидерству и контролю.", traits: ["Лидерство", "Ответственность", "Компетентность", "Престиж"], examples: ["Mercedes-Benz", "Rolex", "IBM"] },
  innocent: { name: "НЕВИННЫЙ", emoji: "🌸", color: "#DB2777", description: "Ваш бренд стремится к счастью и простоте. Вы помогаете людям чувствовать себя хорошо.", traits: ["Оптимизм", "Честность", "Чистота", "Простота"], examples: ["Coca-Cola", "McDonald's", "Dove"] },
  explorer: { name: "ИССЛЕДОВАТЕЛЬ", emoji: "🧭", color: "#16A34A", description: "Ваш бренд помогает людям найти себя через исследование мира. Вы цените свободу и аутентичность.", traits: ["Свобода", "Аутентичность", "Амбиции", "Первопроходство"], examples: ["Jeep", "The North Face", "Red Bull"] },
  lover: { name: "ЛЮБОВНИК", emoji: "❤️", color: "#BE185D", description: "Ваш бренд помогает людям находить любовь и привлекательность. Вы цените страсть и близость.", traits: ["Страсть", "Близость", "Красота", "Приверженность"], examples: ["Victoria's Secret", "Hallmark", "Godiva"] }
};

interface ResultsProps {
  results?: { blockIndex: number; selected: string[]; ranked: string[] }[];
  onRestart: () => void;
  idToArch: Record<string, string>;
}

export default function Results({ results, onRestart, idToArch }: ResultsProps) {
  // Прокрутка к началу страницы при загрузке компонента
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

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

  const sortedArchetypes = Object.entries(archetypeScores).sort(([, a], [, b]) => b - a);
  const [first, second] = sortedArchetypes;

  if (!results || !first) return <div>Ошибка: не удалось определить архетип</div>;

  const containerStyle = {
    padding: "24px",
    maxWidth: "800px",
    margin: "0 auto",
    fontFamily: "'Montserrat', sans-serif",
    paddingBottom: "32px"
  };

  const mainTitleStyle = {
    fontSize: "28px",
    fontWeight: "700",
    textAlign: "center" as const,
    marginBottom: "32px",
    fontFamily: "'Montserrat', sans-serif",
    color: "#1f2937"
  };

  const archetypeContainerStyle = {
    marginBottom: "48px",
    textAlign: "center" as const,
    padding: "24px",
    borderRadius: "16px",
    backgroundColor: "#f9fafb",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)"
  };

  const emojiStyle = {
    fontSize: "48px",
    marginBottom: "16px",
    display: "block"
  };

  const archetypeNameStyle = {
    fontSize: "24px",
    fontWeight: "700",
    marginBottom: "16px",
    fontFamily: "'Montserrat', sans-serif"
  };

  const descriptionStyle = {
    fontSize: "18px",
    lineHeight: "1.6",
    maxWidth: "600px",
    margin: "0 auto 24px",
    fontFamily: "'Montserrat', sans-serif",
    color: "#374151"
  };

  const sectionTitleStyle = {
    fontSize: "18px",
    fontWeight: "600",
    marginBottom: "12px",
    fontFamily: "'Montserrat', sans-serif",
    color: "#1f2937"
  };

  const traitsListStyle = {
    listStyle: "none",
    padding: 0,
    margin: "0 0 24px 0",
    display: "flex",
    flexWrap: "wrap" as const,
    justifyContent: "center",
    gap: "8px"
  };

  const traitItemStyle = {
    background: "#e5e7eb",
    padding: "6px 12px",
    borderRadius: "20px",
    fontSize: "14px",
    fontFamily: "'Montserrat', sans-serif",
    color: "#374151"
  };

  const examplesStyle = {
    fontSize: "16px",
    fontFamily: "'Montserrat', sans-serif",
    color: "#6b7280"
  };

  // Обновленная плашка с синим цветом, белым шрифтом и эмоджи девушки
  const ctaBlockStyle = {
    padding: "32px",
    backgroundColor: "#3b82f6", // Синий цвет вместо желтого
    borderRadius: "12px",
    textAlign: "center" as const,
    marginBottom: "32px",
    border: "2px solid #2563eb", // Синяя рамка
    position: "relative" as const
  };

  const ctaTextStyle = {
    fontSize: "18px",
    lineHeight: "1.6",
    marginBottom: "16px",
    fontFamily: "'Montserrat', sans-serif",
    color: "white", // Белый цвет текста
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "12px"
  };

  const ctaButtonStyle = {
    display: "inline-block",
    backgroundColor: "white", // Белая кнопка на синем фоне
    color: "#3b82f6", // Синий текст на кнопке
    padding: "16px 32px",
    borderRadius: "8px",
    fontSize: "16px",
    fontWeight: "600",
    textDecoration: "none",
    fontFamily: "'Montserrat', sans-serif",
    transition: "background-color 0.2s ease",
    border: "2px solid white"
  };

  const restartButtonStyle = {
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
            <h2 style={{ ...archetypeNameStyle, color: data.color }}>
              {index === 0 ? "ОСНОВНОЙ: " : "ДОПОЛНИТЕЛЬНЫЙ: "}{data.name}
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
          </div>
        );
      })}

      <div style={ctaBlockStyle}>
        <p style={ctaTextStyle}>
          👩‍💼 О том, как использовать это в вашем бизнесе, что еще стоит за каждым архетипом, и как это может вас усилить
        </p>
        <p style={ctaTextStyle}>
          вы можете узнать в моем Гайде по архетипам.
        </p>
        <a
          href="https://kosovetis.com"
          target="_blank"
          rel="noopener noreferrer"
          style={ctaButtonStyle}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "#f3f4f6";
            e.currentTarget.style.color = "#1f2937";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "white";
            e.currentTarget.style.color = "#3b82f6";
          }}
        >
          ПОЛУЧИТЬ ГАЙД
        </a>
      </div>

      <div style={{ textAlign: "center" }}>
        <button onClick={onRestart} style={restartButtonStyle}>
          Пройти тест заново
        </button>
      </div>
    </div>
  );
}
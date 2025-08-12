// src/Results.tsx
import { useMemo, useEffect } from "react";

const archetypeDescriptions = {
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

  // Обновленная плашка с синим цветом, белым шрифтом и крупным эмоджи девушки
  const ctaBlockStyle = {
    padding: "32px",
    backgroundColor: "#3b82f6",
    borderRadius: "12px",
    textAlign: "center" as const,
    marginBottom: "32px",
    border: "2px solid #2563eb",
    position: "relative" as const
  };

  // Большой эмоджи как на плашках архетипов
  const ctaEmojiStyle = {
    fontSize: "48px",
    marginBottom: "20px",
    display: "block",
    textAlign: "center" as const
  };

  // Заголовок CTA
  const ctaHeadlineStyle = {
    fontSize: "22px",
    fontWeight: "700",
    lineHeight: "1.3",
    marginBottom: "16px",
    fontFamily: "'Montserrat', sans-serif",
    color: "white"
  };

  // Основной текст CTA
  const ctaTextStyle = {
    fontSize: "16px",
    lineHeight: "1.5",
    marginBottom: "24px",
    fontFamily: "'Montserrat', sans-serif",
    color: "white",
    opacity: 0.95
  };

  const ctaButtonStyle = {
    display: "inline-block",
    backgroundColor: "white",
    color: "#3b82f6",
    padding: "16px 32px",
    borderRadius: "8px",
    fontSize: "16px",
    fontWeight: "700",
    textDecoration: "none",
    fontFamily: "'Montserrat', sans-serif",
    transition: "all 0.2s ease",
    border: "2px solid white",
    textTransform: "uppercase" as const,
    letterSpacing: "0.5px"
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
            А еще увидите на реальных кейсах, как архетипы применяются в маркетинге.
          </p>
    </div>
        <a
          href="https://kosovetis.notion.site/6374b409220047f881a3d07b768e5cba?v=24db274a728f80858cbd000cacebf08e"
          target="_blank"
          rel="noopener noreferrer"
          style={ctaButtonStyle}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "#f3f4f6";
            e.currentTarget.style.color = "#1f2937";
            e.currentTarget.style.transform = "translateY(-2px)";
            e.currentTarget.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.2)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "white";
            e.currentTarget.style.color = "#3b82f6";
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow = "none";
          }}
        >
          Получить Гайд
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
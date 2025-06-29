// src/Results.tsx
import { useMemo } from "react";

const archetypeDescriptions = {
  caregiver: { name: "ЗАБОТЛИВЫЙ", emoji: "🤲", color: "#10B981", description: "Ваш бренд стремится помогать другим и заботиться о них. Вы ставите потребности клиентов выше собственной выгоды.", traits: ["Сострадание", "Щедрость", "Желание помочь", "Альтруизм"], examples: ["Johnson & Johnson", "Volvo", "UNICEF"] },
  jester: { name: "ШУТ", emoji: "🎭", color: "#F59E0B", description: "Ваш бренд приносит радость и веселье в жизнь людей. Вы помогаете клиентам наслаждаться моментом.", traits: ["Юмор", "Веселье", "Оптимизм", "Легкость"], examples: ["Ben & Jerry's", "Old Spice", "Skittles"] },
  magician: { name: "МАГ", emoji: "🪄", color: "#8B5CF6", description: "Ваш бренд превращает мечты в реальность. Вы создаете трансформационные решения.", traits: ["Инновации", "Видение", "Трансформация", "Возможности"], examples: ["Apple", "Disney", "Tesla"] },
  hero: { name: "ГЕРОЙ", emoji: "🏆", color: "#DC2626", description: "Ваш бренд вдохновляет людей преодолевать препятствия и достигать целей. Вы мотивируете на подвиги.", traits: ["Мужество", "Решительность", "Честь", "Вдохновение"], examples: ["Nike", "FedEx", "BMW"] },
  creator: { name: "ТВОРЕЦ", emoji: "🎨", color: "#7C3AED", description: "Ваш бренд помогает людям выражать себя и создавать что-то новое. Вы цените оригинальность.", traits: ["Креативность", "Воображение", "Самовыражение", "Оригинальность"], examples: ["Adobe", "LEGO", "Pinterest"] },
  rebel: { name: "БУНТАРЬ", emoji: "⚡", color: "#991B1B", description: "Ваш бренд бросает вызов статус-кво и помогает людям нарушать правила. Вы за революцию.", traits: ["Революция", "Освобождение", "Дикость", "Шок"], examples: ["Harley-Davidson", "Virgin", "Diesel"] },
  sage: { name: "МУДРЕЦ", emoji: "📚", color: "#1E40AF", description: "Ваш бренд помогает людям понимать мир. Вы делитесь знаниями и мудростью.", traits: ["Мудрость", "Знания", "Истина", "Интеллект"], examples: ["Google", "Harvard", "BBC"] },
  everyman: { name: "ПРОСТОЙ ЧЕЛОВЕК", emoji: "🤝", color: "#059669", description: "Ваш бренд стремится принадлежать и соединять людей. Вы цените подлинность и честность.", traits: ["Принадлежность", "Реализм", "Сочувствие", "Дружелюбие"], examples: ["IKEA", "Home Depot", "Target"] },
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

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-10">
      <h1 className="text-3xl font-bold text-center mb-4">Ваши архетипы:</h1>

      {[first, second].map(([arch]) => {
        const data = archetypeDescriptions[arch as keyof typeof archetypeDescriptions];
        if (!data) return null;

        return (
          <div key={arch} className="space-y-4 text-center">
            <div style={{ fontSize: "48px" }}>{data.emoji}</div>
            <h2 className="text-2xl font-bold" style={{ color: data.color }}>{data.name}</h2>
            <p className="text-lg max-w-xl mx-auto">{data.description}</p>

            <div>
              <h3 className="text-lg font-semibold mb-2">Ключевые черты:</h3>
              <ul className="list-disc list-inside space-y-1">
                {data.traits.map((trait, idx) => <li key={idx}>{trait}</li>)}
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">Примеры брендов:</h3>
              <p>{data.examples.join(", ")}</p>
            </div>
          </div>
        );
      })}

      <div className="p-6 bg-gray-100 rounded-lg text-center space-y-4">
        <p className="text-lg">Помимо теста я написала гайд, который поможет узнать больше об архетипе вашего бренда: его сильных и слабых сторонах, целях и ценностях.</p>
        <p className="text-lg">Но самое главное — о том, как применять все это на практике.</p>
        <a
          href="https://kosovetis.com"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
        >
          ПОЛУЧИТЬ ГАЙД
        </a>
      </div>

      <div className="text-center">
        <button onClick={onRestart} className="mt-6 text-blue-600 underline">
          Пройти тест заново
        </button>
      </div>
    </div>
  );
}

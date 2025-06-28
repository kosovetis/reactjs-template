// src/Results.tsx
import { useMemo } from "react";

// Типы для результатов
type BlockResult = {
  blockIndex: number;
  selected: string[];
  ranked: string[];
};

// Описания архетипов
const archetypeDescriptions = {
  caregiver: {
    name: "Заботливый (Caregiver)",
    description: "Ваш бренд стремится помогать другим и заботиться о них. Вы ставите потребности клиентов выше собственной выгоды.",
    traits: ["Сострадание", "Щедрость", "Желание помочь", "Альтруизм"],
    examples: ["Johnson & Johnson", "Volvo", "UNICEF"],
    color: "#10B981" // зеленый
  },
  jester: {
    name: "Шут (Jester)", 
    description: "Ваш бренд приносит радость и веселье в жизнь людей. Вы помогаете клиентам наслаждаться моментом.",
    traits: ["Юмор", "Веселье", "Оптимизм", "Легкость"],
    examples: ["Ben & Jerry's", "Old Spice", "Skittles"],
    color: "#F59E0B" // желтый
  },
  magician: {
    name: "Маг (Magician)",
    description: "Ваш бренд превращает мечты в реальность. Вы создаете трансформационные решения.",
    traits: ["Инновации", "Видение", "Трансформация", "Возможности"],
    examples: ["Apple", "Disney", "Tesla"],
    color: "#8B5CF6" // фиолетовый
  },
  hero: {
    name: "Герой (Hero)",
    description: "Ваш бренд вдохновляет людей преодолевать препятствия и достигать целей. Вы мотивируете на подвиги.",
    traits: ["Мужество", "Решительность", "Честь", "Вдохновение"],
    examples: ["Nike", "FedEx", "BMW"],
    color: "#DC2626" // красный
  },
  creator: {
    name: "Творец (Creator)",
    description: "Ваш бренд помогает людям выражать себя и создавать что-то новое. Вы цените оригинальность.",
    traits: ["Креативность", "Воображение", "Самовыражение", "Оригинальность"],
    examples: ["Adobe", "LEGO", "Pinterest"],
    color: "#7C3AED" // индиго
  },
  rebel: {
    name: "Бунтарь (Rebel)",
    description: "Ваш бренд бросает вызов статус-кво и помогает людям нарушать правила. Вы за революцию.",
    traits: ["Революция", "Освобождение", "Дикость", "Шок"],
    examples: ["Harley-Davidson", "Virgin", "Diesel"],
    color: "#991B1B" // темно-красный
  },
  sage: {
    name: "Мудрец (Sage)",
    description: "Ваш бренд помогает людям понимать мир. Вы делитесь знаниями и мудростью.",
    traits: ["Мудрость", "Знания", "Истина", "Интеллект"],
    examples: ["Google", "Harvard", "BBC"],
    color: "#1E40AF" // синий
  },
  everyman: {
    name: "Простой человек (Everyman)",
    description: "Ваш бренд стремится принадлежать и соединять людей. Вы цените подлинность и честность.",
    traits: ["Принадлежность", "Реализм", "Сочувствие", "Дружелюбие"],
    examples: ["IKEA", "Home Depot", "Target"],
    color: "#059669" // тeal
  },
  ruler: {
    name: "Правитель (Ruler)",
    description: "Ваш бренд создает процветание и успех. Вы стремитесь к лидерству и контролю.",
    traits: ["Лидерство", "Ответственность", "Компетентность", "Престиж"],
    examples: ["Mercedes-Benz", "Rolex", "IBM"],
    color: "#7C2D12" // коричневый
  },
  innocent: {
    name: "Невинный (Innocent)",
    description: "Ваш бренд стремится к счастью и простоте. Вы помогаете людям чувствовать себя хорошо.",
    traits: ["Оптимизм", "Честность", "Чистота", "Простота"],
    examples: ["Coca-Cola", "McDonald's", "Dove"],
    color: "#DB2777" // розовый
  },
  explorer: {
    name: "Исследователь (Explorer)",
    description: "Ваш бренд помогает людям найти себя через исследование мира. Вы цените свободу и аутентичность.",
    traits: ["Свобода", "Аутентичность", "Амбиции", "Первопроходство"],
    examples: ["Jeep", "The North Face", "Red Bull"],
    color: "#16A34A" // зеленый
  },
  lover: {
    name: "Любовник (Lover)",
    description: "Ваш бренд помогает людям находить любовь и привлекательность. Вы цените страсть и близость.",
    traits: ["Страсть", "Близость", "Красота", "Приверженность"],
    examples: ["Victoria's Secret", "Hallmark", "Godiva"],
    color: "#BE185D" // глубокий розовый
  }
};

interface ResultsProps {
  results: BlockResult[];
  onRestart: () => void;
  idToText: (id: string) => string;
  idToArch: Record<string, string>;
}

export default function Results({ results, onRestart, idToText, idToArch }: ResultsProps) {
  // Подсчитываем очки для каждого архетипа
  const archetypeScores = useMemo(() => {
    const scores: Record<string, number> = {};
    
    results.forEach(({ ranked }) => {
      ranked.forEach((id, index) => {
        const archetype = idToArch[id];
        if (archetype) {
          // Система очков: 1-е место = 5 очков, 2-е = 4, ..., 5-е = 1
          const points = 5 - index;
          scores[archetype] = (scores[archetype] || 0) + points;
        }
      });
    });
    
    return scores;
  }, [results, idToArch]);

  // Находим доминирующий архетип
  const dominantArchetype = useMemo(() => {
    const entries = Object.entries(archetypeScores);
    if (entries.length === 0) return null;
    
    return entries.reduce((max, current) => 
      current[1] > max[1] ? current : max
    )[0];
  }, [archetypeScores]);

  // Сортируем архетипы по очкам
  const sortedArchetypes = useMemo(() => {
    return Object.entries(archetypeScores)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5); // показываем топ-5
  }, [archetypeScores]);

  if (!dominantArchetype) {
    return <div>Ошибка: не удалось определить архетип</div>;
  }

  const archetype = archetypeDescriptions[dominantArchetype as keyof typeof archetypeDescriptions];

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Заголовок */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Результаты теста</h1>
        <p className="text-gray-600">Анализ архетипа вашего бренда</p>
      </div>

      {/* Основной результат */}
      <div 
        className="mb-8 p-6 rounded-lg text-white text-center"
        style={{ backgroundColor: archetype.color }}
      >
        <h2 className="text-2xl font-bold mb-3">{archetype.name}</h2>
        <p className="text-lg mb-4">{archetype.description}</p>
        <div className="text-sm opacity-90">
          Набрано очков: {archetypeScores[dominantArchetype]}
        </div>
      </div>

      {/* Ключевые черты */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-4">Ключевые черты вашего бренда:</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {archetype.traits.map((trait, index) => (
            <div key={index} className="bg-gray-100 p-3 rounded text-center text-sm font-medium">
              {trait}
            </div>
          ))}
        </div>
      </div>

      {/* Примеры брендов */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-4">Примеры брендов с таким архетипом:</h3>
        <div className="flex flex-wrap gap-2">
          {archetype.examples.map((brand, index) => (
            <span 
              key={index}
              className="px-3 py-1 rounded-full text-sm font-medium text-white"
              style={{ backgroundColor: archetype.color }}
            >
              {brand}
            </span>
          ))}
        </div>
      </div>

      {/* Детальная разбивка по архетипам */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-4">Распределение по архетипам:</h3>
        <div className="space-y-3">
          {sortedArchetypes.map(([arch, score], index) => {
            const archData = archetypeDescriptions[arch as keyof typeof archetypeDescriptions];
            const maxScore = sortedArchetypes[0][1];
            const percentage = (score / maxScore) * 100;
            
            return (
              <div key={arch} className="flex items-center">
                <div className="w-32 text-sm font-medium mr-4">{archData.name}</div>
                <div className="flex-1 bg-gray-200 rounded-full h-4 mr-4">
                  <div 
                    className="h-4 rounded-full transition-all duration-500"
                    style={{ 
                      width: `${percentage}%`,
                      backgroundColor: archData.color
                    }}
                  />
                </div>
                <div className="w-12 text-sm text-gray-600">{score} п.</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Детали по блокам */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-4">Детали по блокам:</h3>
        <div className="space-y-4">
          {results.map(({ blockIndex, ranked }) => (
            <div key={blockIndex} className="bg-gray-50 p-4 rounded">
              <h4 className="font-medium mb-2">Блок {blockIndex + 1}</h4>
              <div className="text-sm space-y-1">
                {ranked.map((id, index) => (
                  <div key={id} className="flex justify-between">
                    <span>{index + 1}. {idToText(id)}</span>
                    <span className="text-gray-500">
                      {archetypeDescriptions[idToArch[id] as keyof typeof archetypeDescriptions]?.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Кнопка перезапуска */}
      <div className="text-center">
        <button
          onClick={onRestart}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
        >
          Пройти тест заново
        </button>
      </div>
    </div>
  );
}
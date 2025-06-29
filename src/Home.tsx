// src/Home.tsx
import { useState, useEffect } from "react";
import { blocks, questions, rankingTitles, idToArch } from "./phrases";
import Rank from "./Rank";
import Results from "./Results";

const idToText = (id: string) => {
  for (const block of blocks) {
    const found = block.find(f => f.id === id);
    if (found) return found.text;
  }
  return id;
};

export default function Home() {
  const [blockIndex, setBlockIndex] = useState(0);
  const [selected, setSelected] = useState<string[]>([]);
  const [showRank, setShowRank] = useState(false);
  const [results, setResults] = useState<{ blockIndex: number; selected: string[]; ranked: string[] }[]>([]);
  const [showResults, setShowResults] = useState(false);

  // Прокрутка к началу страницы при изменении блока
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [blockIndex, showRank, showResults]);

  const toggle = (id: string) => {
    setSelected(prev =>
      prev.includes(id)
        ? prev.filter(x => x !== id)
        : prev.length < 5 ? [...prev, id] : prev
    );
  };

  const handleRankDone = (order: string[]) => {
    const newResult = {
      blockIndex,
      selected,
      ranked: order
    };

    if (blockIndex < blocks.length - 1) {
      setResults(prev => [...prev, newResult]);
      setBlockIndex(blockIndex + 1);
      setSelected([]);
      setShowRank(false);
    } else {
      setResults(prev => [...prev, newResult]);
      setShowResults(true);
    }
  };

  const goBack = () => {
    if (blockIndex > 0) {
      // Находим предыдущий результат и восстанавливаем состояние
      const previousResult = results[blockIndex - 1];
      if (previousResult) {
        setSelected(previousResult.selected);
        setResults(prev => prev.slice(0, -1)); // Удаляем последний результат
      }
      setBlockIndex(blockIndex - 1);
      setShowRank(false);
    }
  };

  if (showResults) {
    return (
      <Results
        results={results}
        onRestart={() => {
          setBlockIndex(0);
          setSelected([]);
          setShowRank(false);
          setShowResults(false);
          setResults([]);
        }}
        idToArch={idToArch}
      />
    );
  }

  if (showRank) {
    return (
      <Rank
        list={selected}
        idToText={idToText}
        onDone={handleRankDone}
        onBack={() => setShowRank(false)}
        title={rankingTitles[blockIndex]}
        blockIndex={blockIndex}
        totalBlocks={blocks.length}
      />
    );
  }

  // Прогресс-бар
  const progress = ((blockIndex + 1) / blocks.length) * 100;
  const progressBarStyle = {
    position: "fixed" as const,
    top: 0,
    left: 0,
    right: 0,
    height: "4px",
    backgroundColor: "#e5e7eb",
    zIndex: 1000
  };

  const progressFillStyle = {
    height: "100%",
    backgroundColor: "#3b82f6",
    width: `${progress}%`,
    transition: "width 0.3s ease"
  };

  const buttonStyle = {
    padding: "12px 24px",
    background: selected.length === 5 ? "#2563eb" : "#9ca3af",
    color: "white",
    borderRadius: "8px",
    cursor: selected.length === 5 ? "pointer" : "not-allowed",
    border: "none",
    fontSize: "16px",
    fontWeight: "500",
    fontFamily: "'Montserrat', sans-serif",
    transition: "all 0.2s ease",
    display: "inline-block",
    marginRight: blockIndex > 0 ? "12px" : "0"
  };

  const backButtonStyle = {
    padding: "12px 20px",
    background: "transparent",
    color: "#6b7280",
    borderRadius: "8px",
    cursor: "pointer",
    border: "1px solid #d1d5db",
    fontSize: "16px",
    fontWeight: "400",
    fontFamily: "'Montserrat', sans-serif",
    transition: "all 0.2s ease",
    display: "inline-block",
    marginRight: "12px"
  };

  const labelStyle = {
    display: "block",
    marginBottom: "12px",
    fontSize: "16px",
    lineHeight: "1.5",
    fontFamily: "'Montserrat', sans-serif",
    cursor: "pointer",
    padding: "8px",
    borderRadius: "6px",
    transition: "background-color 0.2s ease"
  };

  const checkboxStyle = {
    marginRight: "10px",
    transform: "scale(1.2)"
  };

  const questionStyle = {
    fontSize: "20px",
    fontWeight: "600",
    textAlign: "left" as const,
    marginBottom: "8px",
    fontFamily: "'Montserrat', sans-serif",
    color: "#1f2937",
    lineHeight: "1.4"
  };

  const instructionStyle = {
    fontSize: "14px",
    fontWeight: "400",
    textAlign: "center" as const,
    marginBottom: "24px",
    fontFamily: "'Montserrat', sans-serif",
    color: "#6b7280",
    fontStyle: "italic",
    backgroundColor: "#f9fafb",
    padding: "8px 12px",
    borderRadius: "6px",
    border: "1px solid #e5e7eb"
  };

  const counterStyle = {
    fontSize: "14px",
    fontWeight: "500",
    textAlign: "center" as const,
    fontFamily: "'Montserrat', sans-serif",
    color: "#6b7280",
    fontStyle: "italic",
    backgroundColor: "#f3f4f6",
    padding: "8px 12px",
    borderRadius: "6px",
    display: "block",
    marginTop: "16px",
    width: "fit-content",
    margin: "16px auto 0 auto"
  };

  // Очищаем вопросы от фразы "выберите 5 вариантов" и убираем скобки из "через 5 лет"
  const cleanedQuestion = questions[blockIndex]
    .replace(/\s*[Вв]ыберите ровно 5 вариантов\.?/g, '')
    .replace(/\s*[Вв]ыберите 5 наиболее подходящих вариантов\.?/g, '')
    .replace(/\s*[Вв]ыберите 5 наиболее подходящих\.?/g, '')
    .replace(/\s*([Вв]ыберите 5 наиболее подходящих пунктов)\.?/g, '')
    .replace(/\s*[Вв]ыберите 5\.?/g, '')
    .replace(/\s*\([^)]*выберите[^)]*\)/gi, '')
    .replace(/\(через 5 лет\)/g, 'через 5 лет') // Убираем скобки из "через 5 лет"
    .trim()
    .replace(/:\s*$/, ''); // Убираем двоеточие в конце если оно осталось

  return (
    <div>
      {/* Прогресс-бар */}
      <div style={progressBarStyle}>
        <div style={progressFillStyle}></div>
      </div>

      <div className="p-6 flex flex-col space-y-6 max-w-2xl mx-auto" style={{ paddingBottom: "32px", paddingTop: "20px" }}>
        <div>
          <h1 style={questionStyle}>
            {cleanedQuestion}
          </h1>
          <div style={instructionStyle}>
            Выберите 5 наиболее подходящих вариантов
          </div>
        </div>

        <div className="space-y-2">
          {blocks[blockIndex].map(({ id, text }) => (
            <label 
              key={id} 
              style={{
                ...labelStyle,
                backgroundColor: selected.includes(id) ? "#f0f9ff" : "transparent"
              }}
            >
              <input
                type="checkbox"
                checked={selected.includes(id)}
                onChange={() => toggle(id)}
                style={checkboxStyle}
              />
              <span style={{ fontFamily: "'Montserrat', sans-serif" }}>
                {text}
              </span>
            </label>
          ))}
        </div>

        <div className="text-center pt-4">
          {/* Счетчик по центру */}
          <div>
            <span style={counterStyle}>
              Выбрано: {selected.length}/5
            </span>
          </div>
          
          {/* Кнопки в одной строке */}
          <div style={{ marginTop: "20px" }}>
            {blockIndex > 0 && (
              <button
                onClick={goBack}
                style={backButtonStyle}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "#f3f4f6";
                  e.currentTarget.style.color = "#374151";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "transparent";
                  e.currentTarget.style.color = "#6b7280";
                }}
              >
                ← Назад
              </button>
            )}
            
            <button
              disabled={selected.length !== 5}
              onClick={() => setShowRank(true)}
              style={buttonStyle}
            >
              {blockIndex === blocks.length - 1 ? "Готово" : "Дальше"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
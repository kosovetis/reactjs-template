// src/Home.tsx
import { useState } from "react";
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
        title={rankingTitles[blockIndex]}
      />
    );
  }

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
    transition: "all 0.2s ease"
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

  // Новые стили для вопроса и инструкций
  const questionStyle = {
    fontSize: "14px", // Уменьшили с 24px до 14px (более чем вдвое)
    fontWeight: "600",
    textAlign: "center" as const,
    marginBottom: "8px",
    fontFamily: "'Montserrat', sans-serif",
    color: "#1f2937",
    lineHeight: "1.4"
  };

  const instructionStyle = {
    fontSize: "12px",
    fontWeight: "400",
    textAlign: "center" as const,
    marginBottom: "24px",
    fontFamily: "'Montserrat', sans-serif",
    color: "#6b7280", // Более светлый цвет для инструкций
    fontStyle: "italic", // Курсив для выделения
    backgroundColor: "#f9fafb", // Легкий фон
    padding: "8px 12px",
    borderRadius: "6px",
    border: "1px solid #e5e7eb"
  };

  const counterStyle = {
    fontSize: "12px",
    fontWeight: "500",
    textAlign: "center" as const,
    fontFamily: "'Montserrat', sans-serif",
    color: "#6b7280",
    fontStyle: "italic",
    backgroundColor: "#f3f4f6",
    padding: "6px 10px",
    borderRadius: "4px",
    display: "inline-block"
  };

  return (
    <div className="p-6 flex flex-col space-y-6 max-w-2xl mx-auto">
      <div>
        <h1 style={questionStyle}>
          {questions[blockIndex]}
        </h1>
        <div style={instructionStyle}>
          Выберите ровно 5 вариантов
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
        <button
          disabled={selected.length !== 5}
          onClick={() => setShowRank(true)}
          style={buttonStyle}
        >
          {blockIndex === blocks.length - 1 ? "Готово" : "Дальше"}
        </button>
        
        <div className="mt-3">
          <span style={counterStyle}>
            Выбрано: {selected.length}/5
          </span>
        </div>
      </div>
    </div>
  );
}
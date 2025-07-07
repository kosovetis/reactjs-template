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
      const previousResult = results[blockIndex - 1];
      if (previousResult) {
        setSelected(previousResult.selected);
        setResults(prev => prev.slice(0, -1));
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

  const totalSteps = blocks.length * 2;
  const currentStep = blockIndex * 2 + 1;
  const progress = (currentStep / totalSteps) * 100;

  // Стили
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

  const labelStyle = {
    display: "block",
    marginBottom: "12px",
    fontSize: "16px",
    lineHeight: "1.5",
    fontFamily: "'Montserrat', sans-serif",
    cursor: "pointer",
    padding: "8px",
    borderRadius: "6px",
    transition: "background-color 0.2s ease",
    color: "#1f2937", 
  };

  return (
    <div style={{ backgroundColor: 'white', minHeight: '100vh' }}>
      <div style={{
        position: "fixed", top: 0, left: 0, right: 0, height: "4px", backgroundColor: "#e5e7eb", zIndex: 1000
      }}>
        <div style={{
          height: "100%", backgroundColor: "#3b82f6", width: `${progress}%`, transition: "width 0.3s ease"
        }}></div>
      </div>

      {/* ↓↓↓ ГЛАВНОЕ ИЗМЕНЕНИЕ ЗДЕСЬ ↓↓↓
        Убираем className и прописываем стили с отступами напрямую
      */}
      <div style={{ padding: "24px", maxWidth: "700px", margin: "0 auto", paddingBottom: "32px", paddingTop: "20px" }}>
        <div>
          <h1 style={questionStyle}>
            {questions[blockIndex]}
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
                backgroundColor: selected.includes(id) ? "#f0f9ff" : "#ffffff"
              }}
            >
              <input
                type="checkbox"
                checked={selected.includes(id)}
                onChange={() => toggle(id)}
                style={{ marginRight: "10px", transform: "scale(1.2)" }}
              />
              <span style={{ fontFamily: "'Montserrat', sans-serif" }}>
                {text}
              </span>
            </label>
          ))}
        </div>

        <div className="text-center pt-4">
          <div>
            <span style={{
              fontSize: "14px", fontWeight: "500", textAlign: "center", fontFamily: "'Montserrat', sans-serif", color: "#6b7280", fontStyle: "italic", backgroundColor: "#f3f4f6", padding: "8px 12px", borderRadius: "6px", display: "block", marginTop: "16px", width: "fit-content", margin: "16px auto 0 auto"
            }}>
              Выбрано: {selected.length}/5
            </span>
          </div>
          
          <div style={{
            marginTop: "20px", display: "flex", justifyContent: "center", alignItems: "center"
          }}>
            {blockIndex > 0 && (
              <button
                onClick={goBack}
                style={{ padding: "12px 24px", background: "transparent", color: "#6b7280", borderRadius: "8px", cursor: "pointer", border: "1px solid #d1d5db", fontSize: "16px", fontWeight: "400", fontFamily: "'Montserrat', sans-serif", transition: "all 0.2s ease", display: "inline-block", marginRight: "12px" }}
              >
                ← Назад
              </button>
            )}
            
            <button
              disabled={selected.length !== 5}
              onClick={() => setShowRank(true)}
              style={{ padding: "12px 24px", background: selected.length === 5 ? "#2563eb" : "#9ca3af", color: "white", borderRadius: "8px", cursor: selected.length === 5 ? "pointer" : "not-allowed", border: "none", fontSize: "16px", fontWeight: "500", fontFamily: "'Montserrat', sans-serif", transition: "all 0.2s ease", display: "inline-block", marginRight: blockIndex > 0 ? "12px" : "0" }}
            >
              {blockIndex === blocks.length - 1 ? "Готово" : "Дальше"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
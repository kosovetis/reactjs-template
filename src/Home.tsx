// src/Home.tsx
import { useState, useEffect, CSSProperties } from "react";
import { blocks, questions, rankingTitles, idToArch } from "./phrases";
import Rank from "./Rank";
import Results from "./Results";
import { colors, font, gradients, ctaButton } from "./styles/tokens";

const idToText = (id: string) => {
  for (const block of blocks) {
    const found = block.find(f => f.id === id);
    if (found) return found.text;
  }
  return id;
};

// Перемешивание порядка утверждений внутри блока (Fisher-Yates).
// Снимает эффект первичности: позиция в списке не влияет на выбор.
// Меняет только порядок показа — id и скоринг не затрагиваются.
const shuffle = <T,>(arr: T[]): T[] => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

export default function Home() {
  const [blockIndex, setBlockIndex] = useState(0);
  const [selected, setSelected] = useState<string[]>([]);
  const [showRank, setShowRank] = useState(false);
  const [results, setResults] = useState<{ blockIndex: number; selected: string[]; ranked: string[] }[]>([]);
  const [showResults, setShowResults] = useState(false);
  // Свой случайный порядок для каждого блока, фиксируется один раз на сессию.
  const [shuffledBlocks] = useState(() => blocks.map(block => shuffle(block)));

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
  const questionStyle: CSSProperties = {
    fontFamily: font.display,
    fontSize: "18px",
    fontWeight: font.semibold,
    textAlign: "left",
    marginBottom: "12px",
    color: colors.ink,
    lineHeight: "1.4",
    letterSpacing: "-0.3px",
  };

  const instructionStyle: CSSProperties = {
    fontSize: "14px",
    fontWeight: font.regular,
    textAlign: "center",
    marginBottom: "20px",
    color: colors.inkSoft,
    backgroundColor: colors.panel,
    padding: "8px 12px",
    borderRadius: "10px",
    border: `1px solid ${colors.panel2}`,
  };

  const labelStyle: CSSProperties = {
    display: "flex",
    alignItems: "flex-start",
    gap: "10px",
    marginBottom: "10px",
    fontSize: "16px",
    lineHeight: "1.5",
    cursor: "pointer",
    padding: "12px 14px",
    borderRadius: "12px",
    transition: "all 0.2s ease",
    color: colors.ink,
  };

  const counterStyle: CSSProperties = {
    fontSize: "14px",
    fontWeight: font.medium,
    textAlign: "center",
    color: colors.inkSoft,
    backgroundColor: selected.length === 5 ? colors.panel2 : colors.panel,
    border: `1px solid ${selected.length === 5 ? colors.baseDeep : colors.panel2}`,
    padding: "8px 14px",
    borderRadius: "999px",
    display: "block",
    width: "fit-content",
    margin: "16px auto 0 auto",
    transition: "all 0.2s ease",
  };

  const backButtonStyle: CSSProperties = {
    padding: "12px 24px",
    background: "transparent",
    color: colors.inkSoft,
    borderRadius: "999px",
    cursor: "pointer",
    border: `1px solid ${colors.lineStrong}`,
    fontSize: "16px",
    fontWeight: font.regular,
    fontFamily: font.text,
    transition: "all 0.2s ease",
    display: "inline-block",
    marginRight: "12px",
  };

  const nextButtonStyle: CSSProperties = {
    ...ctaButton,
    padding: "13px 32px",
    ...(selected.length !== 5 && {
      background: colors.lineStrong,
      boxShadow: "none",
      cursor: "not-allowed",
    }),
  };

  return (
    <div style={{ backgroundColor: colors.bg, minHeight: '100vh', fontFamily: font.text }}>
      <div style={{
        position: "fixed", top: 0, left: 0, right: 0, height: "4px", backgroundColor: colors.track, zIndex: 1000
      }}>
        <div style={{
          height: "100%", background: gradients.base, width: `${progress}%`, transition: "width 0.3s ease"
        }}></div>
      </div>

      <div style={{ padding: "24px", maxWidth: "700px", margin: "0 auto", paddingBottom: "48px", paddingTop: "20px" }}>
        <div>
          <h1 style={questionStyle}>
            {questions[blockIndex]}
          </h1>
          <div style={instructionStyle}>
            Выберите 5 наиболее подходящих вариантов
          </div>
        </div>

        <div>
          {shuffledBlocks[blockIndex].map(({ id, text }) => {
            const isSelected = selected.includes(id);
            return (
              <label
                key={id}
                style={{
                  ...labelStyle,
                  backgroundColor: isSelected ? colors.panel : colors.bg,
                  border: `1.5px solid ${isSelected ? colors.baseDeep : colors.line}`,
                }}
              >
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => toggle(id)}
                  style={{ marginTop: "3px", transform: "scale(1.2)", accentColor: colors.baseDeep, flexShrink: 0 }}
                />
                <span>{text}</span>
              </label>
            );
          })}
        </div>

        <div>
          <span style={counterStyle}>
            Выбрано: {selected.length}/5
          </span>

          <div style={{
            marginTop: "20px", display: "flex", justifyContent: "center", alignItems: "center"
          }}>
            {blockIndex > 0 && (
              <button onClick={goBack} style={backButtonStyle}>
                ← Назад
              </button>
            )}

            <button
              disabled={selected.length !== 5}
              onClick={() => setShowRank(true)}
              style={nextButtonStyle}
            >
              {blockIndex === blocks.length - 1 ? "Готово" : "Дальше"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

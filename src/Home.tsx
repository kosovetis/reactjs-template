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

  return (
    <div className="p-4 flex flex-col space-y-4 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold">{questions[blockIndex]}</h1>

      <div>
        {blocks[blockIndex].map(({ id, text }) => (
          <label key={id} style={{ display: "block", marginBottom: "8px" }}>
            <input
              type="checkbox"
              checked={selected.includes(id)}
              onChange={() => toggle(id)}
              style={{ marginRight: "6px" }}
            />
            {text}
          </label>
        ))}
      </div>

      <button
        disabled={selected.length !== 5}
        onClick={() => setShowRank(true)}
        style={{
          padding: "8px 16px",
          background: selected.length === 5 ? "#2563eb" : "#9ca3af",
          color: "white",
          borderRadius: "4px",
          cursor: selected.length === 5 ? "pointer" : "not-allowed",
          border: "none"
        }}
      >
        {blockIndex === blocks.length - 1 ? "Готово" : "Дальше"}
      </button>
    </div>
  );
}

// src/Home.tsx
import { useState } from "react";
import { blocks } from "./phrases";
import Rank from "./Rank";
const idToText = (id: string) => {
  for (const block of blocks) {
    const found = block.find(f => f.id === id);
    if (found) return found.text;
  }
  return id; // fallback
};
export default function Home() {
  /* --------------------- состояния --------------------- */
  const [blockIndex, setBlockIndex] = useState(0);     // какой из 7-ми блоков
  const [selected, setSelected]     = useState<string[]>([]);
  const [showRank, setShowRank]     = useState(false); // false = экран чек-боксов

  /* -------------------- логика выбора ------------------ */
  const toggle = (id: string) => {
    setSelected(prev =>
      prev.includes(id)
        ? prev.filter(x => x !== id)                   // снять галочку
        : prev.length < 5 ? [...prev, id] : prev       // добавить, но ≤5
    );
  };

  /* -------------------- обработка «Готово» из Rank ----- */
  const handleRankDone = (order: string[]) => {
    // здесь потом Telegram.WebApp.sendData(...)
    console.log("итоговый порядок:", order);

    // 👉 если есть ещё блоки — показываем следующий
    if (blockIndex < blocks.length - 1) {
      setBlockIndex(blockIndex + 1);
      setSelected([]);
      setShowRank(false);
    } else {
      alert("Все блоки пройдены, спасибо!");
    }
  };

  /* --------------------- экран ранжирования ------------ */
  if (showRank) {
    return (
  <Rank
    list={selected}
    idToText={idToText}     // ⬅️ передаём
    onDone={handleRankDone}
  />
);
  }

  /* --------------------- экран выбора 5 фраз ------------ */
  return (
    <div className="p-4 flex flex-col space-y-4 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold">Выберите 5 фраз</h1>

      {/* список фраз текущего блока столбиком */}
      <div>
        {blocks[blockIndex].map(({ id, text }) => (
          <label
            key={id}
            style={{ display: "block", marginBottom: "8px" }}
          >
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

      {/* кнопка «Дальше» */}
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

// src/Rank.tsx
import { useState, useEffect } from "react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  MouseSensor,
  TouchSensor
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";

type Item = { id: string; text: string };

function Row({ item, index }: { item: Item; index: number }) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: item.id });

  const rowStyle = {
    WebkitUserSelect: "none" as const,
    WebkitTouchCallout: "none" as const,
    touchAction: "manipulation" as const,
    transform: `translate(${transform?.x ?? 0}px, ${transform?.y ?? 0}px)`,
    transition,
    padding: "16px",
    border: "2px solid #e5e7eb",
    marginBottom: "8px",
    background: "#ffffff",
    cursor: "grab",
    borderRadius: "8px",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
    fontFamily: "'Montserrat', sans-serif",
    fontSize: "16px",
    lineHeight: "1.5",
    position: "relative" as const,
    color: '#1f2937', // Явно задаем темный цвет текста
  };

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      style={rowStyle}
    >
      <div
        style={{
          position: "absolute",
          left: "8px",
          top: "50%",
          transform: "translateY(-50%)",
          background: "#3b82f6",
          color: "white",
          borderRadius: "50%",
          width: "24px",
          height: "24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "12px",
          fontWeight: "600",
          fontFamily: "'Montserrat', sans-serif"
        }}
      >
        {index + 1}
      </div>
      <div style={{ marginLeft: "40px", fontFamily: "'Montserrat', sans-serif" }}>
        {item.text}
      </div>
    </div>
  );
}

export default function Rank({
  list,
  onDone,
  onBack,
  idToText,
  title,
  blockIndex,
  totalBlocks
}: {
  list: string[];
  onDone: (order: string[]) => void;
  onBack: () => void;
  idToText: (id: string) => string;
  title: string;
  blockIndex: number;
  totalBlocks: number;
}) {
  const [items, setItems] = useState<Item[]>(list.map(id => ({ id, text: idToText(id) })));

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const sensors = useSensors(
    useSensor(MouseSensor),
    useSensor(TouchSensor, {
      activationConstraint: { delay: 150, tolerance: 10 },
    })
  );

  const handleDragEnd = (e: any) => {
    const { active, over } = e;
    if (active.id !== over.id) {
      const oldIndex = items.findIndex(i => i.id === active.id);
      const newIndex = items.findIndex(i => i.id === over.id);
      setItems(arrayMove(items, oldIndex, newIndex));
    }
  };

  const progress = ((blockIndex + 1) / totalBlocks) * 100;

  const titleParts = title.split('(');
  const mainTitle = titleParts[0].trim();
  const instruction = titleParts[1] ? titleParts[1].replace(/[()]/g, '').replace(/нажмите на него/g, 'зажмите его') : '';

  return (
    <div style={{ backgroundColor: 'white', minHeight: "100vh", overflowY: "auto" }}> {/* Задаем белый фон */}
      <div style={{
        position: "fixed", top: 0, left: 0, right: 0, height: "4px", backgroundColor: "#e5e7eb", zIndex: 1000
      }}>
        <div style={{
          height: "100%", backgroundColor: "#3b82f6", width: `${progress}%`, transition: "width 0.3s ease"
        }}></div>
      </div>

      <div style={{
        padding: "24px", maxWidth: "700px", margin: "0 auto", fontFamily: "'Montserrat', sans-serif", paddingBottom: "32px", paddingTop: "20px",
      }}>
        <h1 style={{
          fontSize: "20px", marginBottom: "12px", fontWeight: "600", textAlign: "left", lineHeight: "1.4", fontFamily: "'Montserrat', sans-serif", color: "#1f2937"
        }}>
          {mainTitle}
        </h1>
        
        {instruction && (
          <div style={{
            fontSize: "14px", fontWeight: "400", textAlign: "center", marginBottom: "24px", fontFamily: "'Montserrat', sans-serif", color: "#6b7280", fontStyle: "italic", backgroundColor: "#f9fafb", padding: "8px 12px", borderRadius: "6px", border: "1px solid #e5e7eb"
          }}>
            {instruction}
          </div>
        )}

        <div style={{ touchAction: "pan-y", overflowY: "visible" }}>
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={items.map(i => i.id)} strategy={verticalListSortingStrategy}>
              {items.map((item, index) => <Row key={item.id} item={item} index={index} />)}
            </SortableContext>
          </DndContext>
        </div>

        <div style={{ textAlign: "center" }}>
          <button
            onClick={onBack}
            style={{ padding: "12px 32px", background: "transparent", color: "#6b7280", borderRadius: "8px", cursor: "pointer", border: "1px solid #d1d5db", fontSize: "16px", fontWeight: "400", fontFamily: "'Montserrat', sans-serif", transition: "all 0.2s ease", display: "inline-block", marginRight: "12px" }}
          >
            ← Назад
          </button>

          <button
            style={{ marginTop: "24px", padding: "12px 32px", background: "#3b82f6", color: "white", border: "none", borderRadius: "8px", fontSize: "16px", fontWeight: "500", cursor: "pointer", fontFamily: "'Montserrat', sans-serif", transition: "background-color 0.2s ease", display: "inline-block", marginRight: "12px" }}
            onClick={() => onDone(items.map(i => i.id))}
          >
            Готово
          </button>
        </div>
      </div>
    </div>
  );
}
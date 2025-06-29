// src/Rank.tsx
import { useState } from "react";
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
    touchAction: "none" as const,
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
    position: "relative" as const
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
  idToText,
  title
}: {
  list: string[];
  onDone: (order: string[]) => void;
  idToText: (id: string) => string;
  title: string;
}) {
  const [items, setItems] = useState<Item[]>(list.map(id => ({ id, text: idToText(id) })));

  const sensors = useSensors(
    useSensor(MouseSensor),
    useSensor(TouchSensor, {
      activationConstraint: { delay: 150, tolerance: 5 },
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

  const containerStyle = {
    padding: "24px",
    maxWidth: "700px",
    margin: "0 auto",
    fontFamily: "'Montserrat', sans-serif"
  };

  const titleStyle = {
    fontSize: "24px",
    marginBottom: "24px",
    fontWeight: "600",
    textAlign: "center" as const,
    lineHeight: "1.4",
    fontFamily: "'Montserrat', sans-serif",
    color: "#1f2937"
  };

  const buttonStyle = {
    marginTop: "24px",
    padding: "12px 32px",
    background: "#3b82f6",
    color: "white",
    border: "none",
    borderRadius: "8px",
    fontSize: "16px",
    fontWeight: "500",
    cursor: "pointer",
    fontFamily: "'Montserrat', sans-serif",
    transition: "background-color 0.2s ease",
    display: "block",
    marginLeft: "auto",
    marginRight: "auto"
  };

  return (
    <div style={containerStyle}>
      <h1 style={titleStyle}>
        {title}
      </h1>

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={items.map(i => i.id)} strategy={verticalListSortingStrategy}>
          {items.map((item, index) => <Row key={item.id} item={item} index={index} />)}
        </SortableContext>
      </DndContext>

      <button
        style={buttonStyle}
        onClick={() => onDone(items.map(i => i.id))}
        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#2563eb"}
        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#3b82f6"}
      >
        Готово
      </button>
    </div>
  );
}
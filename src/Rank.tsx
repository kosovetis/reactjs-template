// src/Rank.tsx
import { useState } from "react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";

type Item = { id: string; text: string };   // ⬅️ добавили тип

function Row({ item }: { item: Item }) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: item.id });

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      style={{
        WebkitUserSelect: "none",
        WebkitTouchCallout: "none",
        touchAction: "none",
        transform: `translate(${transform?.x ?? 0}px, ${transform?.y ?? 0}px)`,
        transition,
        padding: "8px",
        border: "1px solid #ccc",
        marginBottom: "6px",
        background: "#fafafa",
        cursor: "grab",
      }}
    >
      {item.text}        {/* ⬅️ показываем текст, а не id */}
    </div>
  );
}

export default function Rank({
  list,                   // раньше: string[]  (id)
  onDone,
  idToText,               // ⬅️ передадим функцию поиска текста
}: {
  list: string[];
  onDone: (order: string[]) => void;
  idToText: (id: string) => string;
}) {
  /* превращаем id[] → Item[] с текстом */
  const [items, setItems] = useState<Item[]>(list.map(id => ({ id, text: idToText(id) })));

  const sensors = useSensors(useSensor(PointerSensor));

  const handleDragEnd = (e: any) => {
    const { active, over } = e;
    if (active.id !== over.id) {
      const oldIndex = items.findIndex(i => i.id === active.id);
      const newIndex = items.findIndex(i => i.id === over.id);
      setItems(arrayMove(items, oldIndex, newIndex));
    }
  };

  return (
    <div style={{ padding: 16, maxWidth: 600, margin: "0 auto" }}>
      <h1 style={{ fontSize: 24, marginBottom: 12 }}>
        Ранжируй 5 фраз (сверху — самая «ваша»)
      </h1>

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={items.map(i => i.id)} strategy={verticalListSortingStrategy}>
          {items.map(item => <Row key={item.id} item={item} />)}
        </SortableContext>
      </DndContext>

      <button
        style={{ marginTop: 12, padding: "8px 16px" }}
        onClick={() => onDone(items.map(i => i.id))}
      >
        Готово
      </button>
    </div>
  );
}


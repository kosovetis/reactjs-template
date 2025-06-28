// src/Rank.tsx
import { useState } from "react";
import {
  DndContext,
  closestCenter,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";

/* ---- тип карточки ---- */
type Item = { id: string; text: string };

/* ---- компонент строки ---- */
function Row({ item }: { item: Item }) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: item.id });

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      style={{
        /* отключаем выделение текста, лупу и скролл-жест */
        WebkitUserSelect: "none",
        userSelect: "none",
        WebkitTouchCallout: "none",
        touchAction: "none",

        /* dnd-kit трансформация */
        transform: `translate(${transform?.x ?? 0}px, ${transform?.y ?? 0}px)`,
        transition,

        /* оформление карточки */
        padding: "8px",
        border: "1px solid #ccc",
        marginBottom: "6px",
        background: "#fafafa",
        cursor: "grab",
      }}
    >
      {item.text}
    </div>
  );
}

/* ---- пропсы основного компонента ---- */
interface Props {
  list: string[];                 // id выбранных фраз (5 шт.)
  idToText: (id: string) => string;
  onDone: (order: string[]) => void;
}

/* ---- sensors: мышь + тач с порогом 3 px ---- */
const sensors = useSensors(
  useSensor(MouseSensor),
  useSensor(TouchSensor, {
    activationConstraint: { distance: 3 },
  })
);

/* ---- основной компонент ---- */
export default function Rank({ list, idToText, onDone }: Props) {
  /* превращаем id[] => Item[] */
  const [items, setItems] = useState<Item[]>(
    list.map((id) => ({ id, text: idToText(id) }))
  );

  const handleDragEnd = (e: any) => {
    const { active, over } = e;
    if (active.id !== over.id) {
      const oldIndex = items.findIndex((i) => i.id === active.id);
      const newIndex = items.findIndex((i) => i.id === over.id);
      setItems(arrayMove(items, oldIndex, newIndex));
    }
  };

  return (
    <div style={{ padding: 16, maxWidth: 600, margin: "0 auto" }}>
      <h1 style={{ fontSize: 24, marginBottom: 12 }}>
        Ранжируй 5 фраз (сверху — самая «ваша»)
      </h1>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={items.map((i) => i.id)}
          strategy={verticalListSortingStrategy}
        >
          {items.map((item) => (
            <Row key={item.id} item={item} />
          ))}
        </SortableContext>
      </DndContext>

      <button
        style={{ marginTop: 12, padding: "8px 16px" }}
        onClick={() => onDone(items.map((i) => i.id))}
      >
        Готово
      </button>
    </div>
  );
}

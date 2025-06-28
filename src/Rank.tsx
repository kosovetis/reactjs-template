import { useState } from "react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  type PointerSensorOptions,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";

type Item = { id: string; text: string };

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
        userSelect: "none",
        WebkitTouchCallout: "none",
        transform: `translate(${transform?.x ?? 0}px, ${transform?.y ?? 0}px)`,
        transition,
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

interface Props {
  list: string[];
  idToText: (id: string) => string;
  onDone: (order: string[]) => void;
}

const sensorOptions: PointerSensorOptions = {
  activationConstraint: { distance: 3 },
};

export default function Rank({ list, idToText, onDone }: Props) {
  const [items, setItems] = useState<Item[]>(
    list.map((id) => ({ id, text: idToText(id) }))
  );

  const sensors = useSensors(useSensor(PointerSensor, sensorOptions));

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

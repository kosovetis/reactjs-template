// src/Rank.tsx
import { useState, useEffect, CSSProperties } from "react";
import {
  DndContext,
  closestCenter,
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
import { colors, font, gradients, ctaButton } from "./styles/tokens";

type Item = { id: string; text: string };

function Row({ item, index }: { item: Item; index: number }) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: item.id });

  const rowStyle: CSSProperties = {
    WebkitUserSelect: "none",
    WebkitTouchCallout: "none",
    touchAction: "manipulation",
    transform: `translate(${transform?.x ?? 0}px, ${transform?.y ?? 0}px)`,
    transition,
    padding: "14px 14px 14px 50px",
    border: `1.5px solid ${colors.line}`,
    marginBottom: "10px",
    background: colors.bg,
    cursor: "grab",
    borderRadius: "12px",
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)",
    fontFamily: font.text,
    fontSize: "16px",
    lineHeight: "1.5",
    position: "relative",
    color: colors.ink,
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
          left: "12px",
          top: "50%",
          transform: "translateY(-50%)",
          background: gradients.base,
          color: colors.white,
          borderRadius: "50%",
          width: "26px",
          height: "26px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "13px",
          fontWeight: font.semibold,
          fontFamily: font.text,
        }}
      >
        {index + 1}
      </div>
      <div>{item.text}</div>
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
    <div style={{ backgroundColor: colors.bg, minHeight: "100vh", overflowY: "auto", fontFamily: font.text }}>
      <div style={{
        position: "fixed", top: 0, left: 0, right: 0, height: "4px", backgroundColor: colors.track, zIndex: 1000
      }}>
        <div style={{
          height: "100%", background: gradients.base, width: `${progress}%`, transition: "width 0.3s ease"
        }}></div>
      </div>

      <div style={{
        padding: "24px", maxWidth: "700px", margin: "0 auto", paddingBottom: "48px", paddingTop: "20px",
      }}>
        <h1 style={{
          fontFamily: font.display, fontSize: "18px", marginBottom: "12px", fontWeight: font.semibold,
          textAlign: "left", lineHeight: "1.4", color: colors.ink, letterSpacing: "-0.3px",
        }}>
          {mainTitle}
        </h1>

        {instruction && (
          <div style={{
            fontSize: "14px", fontWeight: font.regular, textAlign: "center", marginBottom: "20px",
            color: colors.inkSoft, backgroundColor: colors.panel, padding: "8px 12px",
            borderRadius: "10px", border: `1px solid ${colors.panel2}`,
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

        <div style={{ textAlign: "center", marginTop: "24px" }}>
          <button
            onClick={onBack}
            style={{
              padding: "12px 28px", background: "transparent", color: colors.inkSoft,
              borderRadius: "999px", cursor: "pointer", border: `1px solid ${colors.lineStrong}`,
              fontSize: "16px", fontWeight: font.regular, fontFamily: font.text,
              transition: "all 0.2s ease", display: "inline-block", marginRight: "12px",
            }}
          >
            ← Назад
          </button>

          <button
            style={{ ...ctaButton, padding: "13px 32px" }}
            onClick={() => onDone(items.map(i => i.id))}
          >
            Готово
          </button>
        </div>
      </div>
    </div>
  );
}

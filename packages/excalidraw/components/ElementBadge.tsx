import React from "react";
import { ExcalidrawElement } from "@excalidraw/element/types";

type ElementBadgeProps = {
  element: ExcalidrawElement;
  className?: string;
};

const ELEMENT_TYPE_LABELS: Record<string, string> = {
  rectangle: "Rectangle",
  ellipse: "Ellipse",
  diamond: "Diamond",
  line: "Line",
  arrow: "Arrow",
  freedraw: "Free Draw",
  text: "Text",
  image: "Image",
  frame: "Frame",
  magicframe: "Magic Frame",
  embeddable: "Embeddable",
  iframe: "iframe",
  selection: "Selection",
};

export const getDisplayName = (type: string) => {
  return ELEMENT_TYPE_LABELS[type] || type.charAt(0).toUpperCase() + type.slice(1);
};

const badgeStyle: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  padding: "2px 8px",
  borderRadius: "4px",
  fontSize: "12px",
  fontWeight: 600,
  backgroundColor: "#e8e8e8",
  color: "#333",
  lineHeight: 1.4,
};

export default function ElementBadge({ element, className }: ElementBadgeProps) {
  const label = getDisplayName(element.type);

  return (
    <span style={badgeStyle} className={className}>
      {label}
    </span>
  );
}
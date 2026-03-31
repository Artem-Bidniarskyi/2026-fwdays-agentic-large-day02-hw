import { useState, useEffect } from "react";

import type { ExcalidrawElement } from "@excalidraw/element/types";

interface ElementCoordinatesProps {
  element: ExcalidrawElement;
}

const ElementCoordinates = ({ element }: ElementCoordinatesProps) => {
  const [coords, setCoords] = useState({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  });

  useEffect(() => {
    const cx = element.x + element.width / 2;
    const cy = element.y + element.height / 2;

    const angle = element.angle;
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);

    const dx = element.x - cx;
    const dy = element.y - cy;

    const rotatedX = cx + dx * cos - dy * sin;
    const rotatedY = cy + dx * sin + dy * cos;

    setCoords({
      x: Math.round(rotatedX * 100) / 100,
      y: Math.round(rotatedY * 100) / 100,
      width: Math.round(element.width * 100) / 100,
      height: Math.round(element.height * 100) / 100,
    });
  }, [element.x, element.y, element.width, element.height, element.angle]);

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: "4px",
        padding: "4px 0",
        fontSize: "12px",
      }}
    >
      <div>
        X: {coords.x}, Y: {coords.y}
      </div>
      <div>
        W: {coords.width}, H: {coords.height}
      </div>
    </div>
  );
};

export default ElementCoordinates;
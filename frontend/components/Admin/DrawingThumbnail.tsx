"use client";

import React, { useEffect, useRef } from "react";

interface DrawingThumbnailProps {
  pixels: number[];
  size?: number;
}

export const DrawingThumbnail: React.FC<DrawingThumbnailProps> = ({ pixels, size = 64 }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !pixels || pixels.length !== 784) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Create 28x28 ImageData
    const imgData = ctx.createImageData(28, 28);
    for (let i = 0; i < 784; i++) {
      const val = pixels[i]; // 0.0 (white/bg) -> 1.0 (black/stroke)
      const color = Math.round(255 - val * 255); // 0.0 -> 255 (white), 1.0 -> 0 (black)
      const idx = i * 4;
      imgData.data[idx] = color;     // Red
      imgData.data[idx + 1] = color; // Green
      imgData.data[idx + 2] = color; // Blue
      imgData.data[idx + 3] = 255;   // Alpha
    }

    ctx.putImageData(imgData, 0, 0);
  }, [pixels]);

  return (
    <canvas
      ref={canvasRef}
      width={28}
      height={28}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        imageRendering: "pixelated",
        borderRadius: "6px",
        border: "1px solid #e5e5e5",
        backgroundColor: "#ffffff",
        boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
      }}
    />
  );
};

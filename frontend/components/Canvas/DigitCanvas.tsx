"use client";

import React from "react";

interface DigitCanvasProps {
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  onStartDrawing: (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => void;
  onDraw: (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => void;
  onStopDrawing: () => void;
  onClear: () => void;
  onRecognize: () => void;
  loading: boolean;
}

export const DigitCanvas: React.FC<DigitCanvasProps> = ({
  canvasRef,
  onStartDrawing,
  onDraw,
  onStopDrawing,
  onClear,
  onRecognize,
  loading,
}) => {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      {/* 28x28 Drawing Canvas Frame */}
      <div
        style={{
          border: "1.5px solid #e0e0e0",
          borderRadius: "12px",
          overflow: "hidden",
          boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
          backgroundColor: "#ffffff",
          marginBottom: "24px",
        }}
      >
        <canvas
          ref={canvasRef as any}
          width={28}
          height={28}
          onMouseDown={onStartDrawing}
          onMouseMove={onDraw}
          onMouseUp={onStopDrawing}
          onMouseLeave={onStopDrawing}
          onTouchStart={onStartDrawing}
          onTouchMove={onDraw}
          onTouchEnd={onStopDrawing}
          style={{
            display: "block",
            width: "280px",
            height: "280px",
            imageRendering: "pixelated",
            cursor: "crosshair",
          }}
        />
      </div>

      {/* Buttons */}
      <div style={{ display: "flex", gap: "10px", marginBottom: "32px" }}>
        <button
          onClick={onClear}
          disabled={loading}
          style={{
            padding: "10px 24px",
            fontSize: "13px",
            fontWeight: 500,
            borderRadius: "8px",
            border: "1.5px solid #e0e0e0",
            backgroundColor: "#fff",
            color: "#555",
            cursor: "pointer",
            transition: "all 0.15s",
          }}
        >
          Clear
        </button>
        <button
          onClick={onRecognize}
          disabled={loading}
          style={{
            padding: "10px 28px",
            fontSize: "13px",
            fontWeight: 600,
            borderRadius: "8px",
            border: "none",
            backgroundColor: "#111",
            color: "#fff",
            cursor: loading ? "not-allowed" : "pointer",
            opacity: loading ? 0.6 : 1,
            transition: "all 0.15s",
          }}
        >
          {loading ? "Recognizing…" : "Recognize"}
        </button>
      </div>
    </div>
  );
};

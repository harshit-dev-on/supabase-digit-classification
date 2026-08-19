"use client";

import React from "react";
import { PredictResponse } from "@/services";

interface PredictionViewProps {
  result: PredictResponse | null;
  error: string | null;
}

export const PredictionView: React.FC<PredictionViewProps> = ({ result, error }) => {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      {/* Result — fixed 120px height container prevents layout shifts */}
      <div
        style={{
          height: "120px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          marginTop: "8px",
        }}
      >
        {result ? (
          <>
            <div
              style={{
                fontSize: "72px",
                fontWeight: 700,
                lineHeight: 1,
                color: "#111",
                letterSpacing: "-3px",
              }}
            >
              {result.prediction}
            </div>
            <div
              style={{
                marginTop: "6px",
                fontSize: "12px",
                color: "#999",
                fontWeight: 500,
              }}
            >
              {(result.confidence * 100).toFixed(1)}% confidence
            </div>
          </>
        ) : (
          <div style={{ fontSize: "12px", color: "#ddd" }}>—</div>
        )}
      </div>

      {/* Error message */}
      {error && (
        <div
          style={{
            marginTop: "16px",
            fontSize: "12px",
            color: "#e53935",
            maxWidth: "280px",
            textAlign: "center",
          }}
        >
          {error}
        </div>
      )}
    </div>
  );
};

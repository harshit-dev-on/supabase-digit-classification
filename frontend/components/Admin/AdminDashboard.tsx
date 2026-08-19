"use client";

import React, { useState } from "react";
import { AdminPredictionRecord } from "@/services";
import { DrawingThumbnail } from "./DrawingThumbnail";

interface AdminDashboardProps {
  isOpen: boolean;
  onClose: () => void;
  username: string | null;
  predictions: AdminPredictionRecord[];
  verifiedPredictions: AdminPredictionRecord[];
  loading: boolean;
  onRefresh: () => void;
  onLogout: () => void;
  onFeedback: (recordId: string, actualDigit: number) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  isOpen,
  onClose,
  username,
  predictions,
  verifiedPredictions,
  loading,
  onRefresh,
  onLogout,
  onFeedback,
}) => {
  const [activeTab, setActiveTab] = useState<"all" | "verified">("all");

  if (!isOpen) return null;

  const currentList = activeTab === "all" ? predictions : verifiedPredictions;

  const handleExportJson = () => {
    if (verifiedPredictions.length === 0) return;
    const dataStr =
      "data:text/json;charset=utf-8," +
      encodeURIComponent(JSON.stringify(verifiedPredictions, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute(
      "download",
      `supabase_verified_dataset_${new Date().toISOString().slice(0, 10)}.json`
    );
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        backdropFilter: "blur(6px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9999,
        padding: "20px",
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: "#ffffff",
          borderRadius: "16px",
          width: "100%",
          maxWidth: "920px",
          maxHeight: "90vh",
          display: "flex",
          flexDirection: "column",
          boxShadow: "0 24px 48px rgba(0,0,0,0.18)",
          border: "1px solid #eaeaea",
          overflow: "hidden",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            padding: "20px 24px",
            borderBottom: "1px solid #eee",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            backgroundColor: "#fafafa",
          }}
        >
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <h2 style={{ fontSize: "16px", fontWeight: 700, color: "#111", margin: 0 }}>
                Admin Portal · Supabase Active Learning Manager
              </h2>
              <span
                style={{
                  fontSize: "10px",
                  fontWeight: 600,
                  backgroundColor: "#e8f5e9",
                  color: "#2e7d32",
                  padding: "2px 8px",
                  borderRadius: "999px",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                }}
              >
                Logged in: {username}
              </span>
            </div>
            <p style={{ fontSize: "12px", color: "#777", margin: "4px 0 0 0" }}>
              Manage drawing submissions and ground-truth verified training sheets in Supabase.
            </p>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            {activeTab === "verified" && verifiedPredictions.length > 0 && (
              <button
                onClick={handleExportJson}
                style={{
                  padding: "6px 12px",
                  fontSize: "12px",
                  fontWeight: 600,
                  borderRadius: "6px",
                  border: "1px solid #111",
                  backgroundColor: "#111",
                  color: "#fff",
                  cursor: "pointer",
                }}
              >
                📥 Export Dataset
              </button>
            )}
            <button
              onClick={onRefresh}
              disabled={loading}
              style={{
                padding: "6px 12px",
                fontSize: "12px",
                fontWeight: 500,
                borderRadius: "6px",
                border: "1px solid #ddd",
                backgroundColor: "#fff",
                color: "#333",
                cursor: "pointer",
              }}
            >
              {loading ? "Refreshing…" : "↻ Refresh"}
            </button>
            <button
              onClick={onLogout}
              style={{
                padding: "6px 12px",
                fontSize: "12px",
                fontWeight: 500,
                borderRadius: "6px",
                border: "1px solid #ffcdd2",
                backgroundColor: "#ffebee",
                color: "#c62828",
                cursor: "pointer",
              }}
            >
              Logout
            </button>
            <button
              onClick={onClose}
              style={{
                background: "none",
                border: "none",
                fontSize: "18px",
                cursor: "pointer",
                color: "#999",
                marginLeft: "8px",
                padding: "4px",
              }}
            >
              ✕
            </button>
          </div>
        </div>

        {/* Tab Switcher */}
        <div
          style={{
            display: "flex",
            gap: "24px",
            padding: "0 24px",
            borderBottom: "1px solid #eee",
            backgroundColor: "#fff",
          }}
        >
          <button
            onClick={() => setActiveTab("all")}
            style={{
              padding: "12px 0",
              fontSize: "13px",
              fontWeight: activeTab === "all" ? 600 : 500,
              color: activeTab === "all" ? "#111" : "#888",
              border: "none",
              borderBottom: activeTab === "all" ? "2px solid #111" : "2px solid transparent",
              background: "none",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "6px",
            }}
          >
            <span>All Drawings (`predictions`)</span>
            <span style={{ fontSize: "11px", backgroundColor: "#f0f0f0", padding: "1px 6px", borderRadius: "999px" }}>
              {predictions.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("verified")}
            style={{
              padding: "12px 0",
              fontSize: "13px",
              fontWeight: activeTab === "verified" ? 600 : 500,
              color: activeTab === "verified" ? "#111" : "#888",
              border: "none",
              borderBottom: activeTab === "verified" ? "2px solid #111" : "2px solid transparent",
              background: "none",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "6px",
            }}
          >
            <span>Verified Dataset (`verified_predictions`)</span>
            <span style={{ fontSize: "11px", backgroundColor: "#e8f5e9", color: "#2e7d32", padding: "1px 6px", borderRadius: "999px", fontWeight: 700 }}>
              {verifiedPredictions.length}
            </span>
          </button>
        </div>

        {/* Predictions Content Grid */}
        <div
          style={{
            padding: "24px",
            overflowY: "auto",
            flex: 1,
          }}
        >
          {currentList.length === 0 ? (
            <div style={{ textAlign: "center", padding: "60px 20px", color: "#999" }}>
              <div style={{ fontSize: "36px", marginBottom: "12px" }}>
                {activeTab === "verified" ? "📋" : "🎨"}
              </div>
              <p style={{ fontSize: "14px", fontWeight: 500, margin: 0, color: "#555" }}>
                {activeTab === "verified"
                  ? "No verified records in 'verified_predictions' sheet yet."
                  : "No drawings recorded in Supabase yet."}
              </p>
              <p style={{ fontSize: "12px", marginTop: "4px" }}>
                {activeTab === "verified"
                  ? "Select 'Set Correct' on any drawing in 'All Drawings' to automatically trigger the Supabase verified sync."
                  : "Draw digits on the canvas and click Recognize to populate Supabase records."}
              </p>
            </div>
          ) : (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
                gap: "16px",
              }}
            >
              {currentList.map((p) => {
                const dateStr = p.created_at
                  ? new Date(p.created_at).toLocaleString(undefined, {
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                  : "";

                const isMatch =
                  p.actual_digit !== null &&
                  p.actual_digit !== undefined &&
                  p.actual_digit === p.predicted_digit;

                return (
                  <div
                    key={p.id}
                    style={{
                      border: "1px solid #e5e5e5",
                      borderRadius: "12px",
                      padding: "16px",
                      backgroundColor: "#ffffff",
                      display: "flex",
                      flexDirection: "column",
                      gap: "12px",
                      boxShadow: "0 2px 6px rgba(0,0,0,0.03)",
                      position: "relative",
                    }}
                  >
                    {/* Top row: Thumbnail & Prediction Badge */}
                    <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                      <DrawingThumbnail pixels={p.image_data} size={64} />
                      <div style={{ flex: 1 }}>
                        <span style={{ fontSize: "10px", color: "#999", textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: 600 }}>
                          Predicted
                        </span>
                        <div style={{ fontSize: "32px", fontWeight: 700, color: "#111", lineHeight: 1 }}>
                          {p.predicted_digit}
                        </div>
                        <div style={{ fontSize: "11px", color: "#2e7d32", fontWeight: 600, marginTop: "2px" }}>
                          {(p.confidence * 100).toFixed(1)}% confidence
                        </div>
                      </div>
                    </div>

                    {/* Metadata */}
                    <div style={{ fontSize: "11px", color: "#aaa", display: "flex", justifyContent: "space-between", borderTop: "1px solid #f5f5f5", paddingTop: "8px" }}>
                      <span>Model: <strong>{p.model_name.toUpperCase()}</strong></span>
                      <span>{dateStr}</span>
                    </div>

                    {/* Ground-truth Verified Digit */}
                    <div style={{ fontSize: "11px", color: "#666", display: "flex", alignItems: "center", justifyContent: "space-between", backgroundColor: "#f9f9f9", padding: "6px 8px", borderRadius: "6px" }}>
                      <span>True Label:</span>
                      {p.actual_digit !== null && p.actual_digit !== undefined ? (
                        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                          <span
                            style={{
                              fontWeight: 700,
                              fontSize: "12px",
                              color: isMatch ? "#2e7d32" : "#d32f2f",
                              backgroundColor: isMatch ? "#e8f5e9" : "#ffebee",
                              padding: "2px 8px",
                              borderRadius: "4px",
                            }}
                          >
                            Digit {p.actual_digit} {isMatch ? "✓" : "✎"}
                          </span>
                          <select
                            defaultValue=""
                            onChange={(e) => {
                              const val = parseInt(e.target.value, 10);
                              if (!isNaN(val)) onFeedback(p.prediction_id ? String(p.prediction_id) : p.id, val);
                            }}
                            style={{
                              fontSize: "10px",
                              padding: "1px 3px",
                              borderRadius: "4px",
                              border: "1px solid #ddd",
                              backgroundColor: "#fff",
                              cursor: "pointer",
                            }}
                          >
                            <option value="" disabled>
                              Edit
                            </option>
                            {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((d) => (
                              <option key={d} value={d}>
                                {d}
                              </option>
                            ))}
                          </select>
                        </div>
                      ) : (
                        <select
                          defaultValue=""
                          onChange={(e) => {
                            const val = parseInt(e.target.value, 10);
                            if (!isNaN(val)) onFeedback(p.id, val);
                          }}
                          style={{
                            fontSize: "11px",
                            padding: "2px 4px",
                            borderRadius: "4px",
                            border: "1px solid #ddd",
                            backgroundColor: "#fff",
                            cursor: "pointer",
                          }}
                        >
                          <option value="" disabled>
                            Set Correct Label
                          </option>
                          {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((d) => (
                            <option key={d} value={d}>
                              Digit {d}
                            </option>
                          ))}
                        </select>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer info */}
        <div
          style={{
            padding: "12px 24px",
            borderTop: "1px solid #eee",
            backgroundColor: "#fafafa",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: "11px",
            color: "#888",
          }}
        >
          <span>Supabase Table: <strong>`verified_predictions`</strong> ({verifiedPredictions.length} verified rows)</span>
          <span>Trigger: <strong>PostgreSQL Function Sync</strong></span>
        </div>
      </div>
    </div>
  );
};

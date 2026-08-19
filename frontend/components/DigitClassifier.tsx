"use client";

import React, { useState } from "react";
import { useDigitClassifier } from "@/hooks/useDigitClassifier";
import { useAdmin } from "@/hooks/useAdmin";
import { DigitCanvas } from "./Canvas/DigitCanvas";
import { PredictionView } from "./Result/PredictionView";
import { AdminLoginModal } from "./Admin/AdminLoginModal";
import { AdminDashboard } from "./Admin/AdminDashboard";

export default function DigitClassifier() {
  const {
    canvasRef,
    loading,
    error,
    result,
    startDrawing,
    draw,
    stopDrawing,
    handleClear,
    handleRecognize,
  } = useDigitClassifier();

  const {
    isLoggedIn,
    username,
    predictions,
    verifiedPredictions,
    loading: adminLoading,
    error: adminError,
    login: handleAdminLogin,
    logout: handleAdminLogout,
    fetchPredictions: refreshPredictions,
    submitCorrection,
  } = useAdmin();

  const [isAdminOpen, setIsAdminOpen] = useState(false);

  const handleAdminButtonClick = () => {
    setIsAdminOpen(true);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#f9f9f9",
        fontFamily: "'Inter', sans-serif",
        padding: "24px",
        position: "relative",
      }}
    >
      {/* Top Header / Navigation */}
      <header
        style={{
          position: "absolute",
          top: "24px",
          left: "32px",
          right: "32px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <span
          style={{
            fontSize: "13px",
            fontWeight: 700,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: "#111",
          }}
        >
          MNIST Studio
        </span>

        {/* Admin Access Button */}
        <button
          onClick={handleAdminButtonClick}
          style={{
            padding: "6px 14px",
            fontSize: "11px",
            fontWeight: 600,
            letterSpacing: "0.05em",
            textTransform: "uppercase",
            borderRadius: "999px",
            border: "1px solid #e0e0e0",
            backgroundColor: isLoggedIn ? "#111" : "#ffffff",
            color: isLoggedIn ? "#ffffff" : "#666",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "6px",
            boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
            transition: "all 0.15s ease",
          }}
        >
          <span>🔒</span>
          <span>{isLoggedIn ? `Admin (${username})` : "Admin"}</span>
        </button>
      </header>

      {/* Title */}
      <h1
        style={{
          fontSize: "15px",
          fontWeight: 600,
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          color: "#999",
          marginBottom: "36px",
          marginTop: "48px",
        }}
      >
        Digit Recognizer
      </h1>

      {/* Canvas Block */}
      <DigitCanvas
        canvasRef={canvasRef}
        onStartDrawing={startDrawing}
        onDraw={draw}
        onStopDrawing={stopDrawing}
        onClear={handleClear}
        onRecognize={handleRecognize}
        loading={loading}
      />

      {/* Result Display */}
      <PredictionView result={result} error={error} />

      <p
        style={{
          marginTop: "48px",
          fontSize: "11px",
          color: "#ccc",
          letterSpacing: "0.05em",
        }}
      >
        28 × 28 · SGD Classifier · PostgreSQL Logged
      </p>

      {/* Admin Modals */}
      {isAdminOpen && !isLoggedIn && (
        <AdminLoginModal
          isOpen={isAdminOpen}
          onClose={() => setIsAdminOpen(false)}
          onLogin={async (u, p) => {
            const success = await handleAdminLogin(u, p);
            return success;
          }}
          loading={adminLoading}
          error={adminError}
        />
      )}

      {isAdminOpen && isLoggedIn && (
        <AdminDashboard
          isOpen={isAdminOpen}
          onClose={() => setIsAdminOpen(false)}
          username={username}
          predictions={predictions}
          verifiedPredictions={verifiedPredictions}
          loading={adminLoading}
          onRefresh={refreshPredictions}
          onLogout={() => {
            handleAdminLogout();
            setIsAdminOpen(false);
          }}
          onFeedback={submitCorrection}
        />
      )}
    </div>
  );
}

"use client";

import React, { useState } from "react";

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (user: string, pass: string) => Promise<boolean>;
  loading: boolean;
  error: string | null;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({
  isOpen,
  onClose,
  onLogin,
  loading,
  error,
}) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    const ok = await onLogin(email, password);
    if (ok) {
      setEmail("");
      setPassword("");
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(0, 0, 0, 0.4)",
        backdropFilter: "blur(4px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9999,
        padding: "16px",
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: "#ffffff",
          borderRadius: "14px",
          width: "100%",
          maxWidth: "360px",
          padding: "28px",
          boxShadow: "0 20px 40px rgba(0,0,0,0.15)",
          border: "1px solid #eaeaea",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
          <h2 style={{ fontSize: "16px", fontWeight: 600, color: "#111", margin: 0 }}>
            Supabase Admin Access
          </h2>
          <button
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              fontSize: "18px",
              cursor: "pointer",
              color: "#999",
              padding: "4px",
            }}
          >
            ✕
          </button>
        </div>

        <p style={{ fontSize: "12px", color: "#666", marginBottom: "20px", lineHeight: "1.4" }}>
          Sign in with your Supabase Admin account to review drawing attempts and manage the verified retraining dataset.
        </p>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <div>
            <label style={{ fontSize: "11px", fontWeight: 600, color: "#555", textTransform: "uppercase", letterSpacing: "0.05em", display: "block", marginBottom: "6px" }}>
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@example.com"
              autoFocus
              style={{
                width: "100%",
                padding: "10px 12px",
                borderRadius: "8px",
                border: "1px solid #ddd",
                fontSize: "13px",
                outline: "none",
                boxSizing: "border-box",
              }}
            />
          </div>

          <div>
            <label style={{ fontSize: "11px", fontWeight: 600, color: "#555", textTransform: "uppercase", letterSpacing: "0.05em", display: "block", marginBottom: "6px" }}>
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              style={{
                width: "100%",
                padding: "10px 12px",
                borderRadius: "8px",
                border: "1px solid #ddd",
                fontSize: "13px",
                outline: "none",
                boxSizing: "border-box",
              }}
            />
          </div>

          {error && (
            <div style={{ fontSize: "12px", color: "#e53935", marginTop: "4px" }}>
              {error}
            </div>
          )}

          <div style={{ display: "flex", gap: "10px", marginTop: "12px" }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                flex: 1,
                padding: "10px",
                borderRadius: "8px",
                border: "1px solid #ddd",
                backgroundColor: "#fff",
                color: "#555",
                fontSize: "13px",
                fontWeight: 500,
                cursor: "pointer",
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !email || !password}
              style={{
                flex: 1,
                padding: "10px",
                borderRadius: "8px",
                border: "none",
                backgroundColor: "#111",
                color: "#fff",
                fontSize: "13px",
                fontWeight: 600,
                cursor: loading ? "not-allowed" : "pointer",
                opacity: loading || !email || !password ? 0.6 : 1,
              }}
            >
              {loading ? "Authenticating…" : "Login"}
            </button>
          </div>
        </form>

        <div style={{ marginTop: "20px", paddingTop: "14px", borderTop: "1px solid #f0f0f0", textAlign: "center" }}>
          <span style={{ fontSize: "11px", color: "#aaa" }}>
            Protected by Supabase Auth (GoTrue)
          </span>
        </div>
      </div>
    </div>
  );
};

"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { digitApi, PredictResponse } from "@/services";
import { supabase } from "@/utils/supabase/client";

export function useDigitClassifier() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<PredictResponse | null>(null);

  // Initialize canvas with white background
  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
    }
  }, []);

  const getCoordinates = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
      const canvas = canvasRef.current;
      if (!canvas) return { x: 0, y: 0 };
      const rect = canvas.getBoundingClientRect();
      if ("touches" in e) {
        if (e.touches.length === 0) return { x: 0, y: 0 };
        return {
          x: (e.touches[0].clientX - rect.left) * (canvas.width / rect.width),
          y: (e.touches[0].clientY - rect.top) * (canvas.height / rect.height),
        };
      }
      return {
        x: (e.clientX - rect.left) * (canvas.width / rect.width),
        y: (e.clientY - rect.top) * (canvas.height / rect.height),
      };
    },
    []
  );

  const startDrawing = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
      e.preventDefault();
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      const { x, y } = getCoordinates(e);
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineWidth = 1;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.strokeStyle = "#000000";
      setIsDrawing(true);
    },
    [getCoordinates]
  );

  const draw = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
      if (!isDrawing) return;
      e.preventDefault();
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      const { x, y } = getCoordinates(e);
      ctx.lineTo(x, y);
      ctx.lineWidth = 1;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.strokeStyle = "#000000";
      ctx.stroke();
    },
    [isDrawing, getCoordinates]
  );

  const stopDrawing = useCallback(() => setIsDrawing(false), []);

  const handleClear = useCallback(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
    }
    setResult(null);
    setError(null);
  }, []);

  const handleRecognize = useCallback(async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    setLoading(true);
    setError(null);

    try {
      const imgData = ctx.getImageData(0, 0, 28, 28);
      const data = imgData.data;
      const pixels: number[] = [];
      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        const intensity = 1.0 - (r + g + b) / 3.0 / 255.0;
        pixels.push(intensity);
      }

      // 1. Get high-speed ML prediction from Python microservice
      const response = await digitApi.predict(pixels);
      setResult(response);

      // 2. Asynchronously log attempt to Supabase predictions table
      supabase
        .from("predictions")
        .insert({
          model_name: "sgd",
          predicted_digit: response.prediction,
          confidence: response.confidence,
          probabilities: response.probabilities,
          image_data: pixels,
        })
        .then(({ error: insertError }) => {
          if (insertError) {
            console.warn("[Supabase] Notice logging prediction:", insertError.message);
          }
        });
    } catch (e: any) {
      setError(e.message || "Failed to connect to the prediction server.");
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    canvasRef,
    loading,
    error,
    result,
    startDrawing,
    draw,
    stopDrawing,
    handleClear,
    handleRecognize,
  };
}

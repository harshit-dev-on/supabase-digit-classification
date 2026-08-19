/**
 * Typed Digit Recognition API Service.
 */

import { http } from "./http";

export interface PredictResponse {
  id?: string;
  prediction: number;
  confidence: number;
  probabilities: number[];
  timestamp: string;
}

export interface PredictionHistoryItem {
  id: string;
  model_name: string;
  predicted_digit: number;
  confidence: number;
  probabilities: number[];
  created_at: string;
  actual_digit?: number | null;
}

export const digitApi = {
  /**
   * Submits a 784-element normalized float array to the ML classifier.
   */
  async predict(image: number[]): Promise<PredictResponse> {
    return http.post<PredictResponse>("/api/predict", { image });
  },

  /**
   * Retrieves past prediction records from the active database engine.
   */
  async getHistory(limit: number = 20): Promise<PredictionHistoryItem[]> {
    return http.get<PredictionHistoryItem[]>(`/api/predictions?limit=${limit}`);
  },

  /**
   * Submits human correction / active learning feedback for a past prediction.
   */
  async submitFeedback(recordId: string, actualDigit: number): Promise<{ status: string; id: string; actual_digit: number }> {
    return http.post(`/api/predictions/${recordId}/feedback`, { actual_digit: actualDigit });
  },
};

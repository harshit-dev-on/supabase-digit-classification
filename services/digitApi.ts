/**
 * Typed Digit Recognition ML Microservice Client.
 */

import { http } from "./http";

export interface PredictResponse {
  prediction: number;
  confidence: number;
  probabilities: number[];
  timestamp: string;
}

export const digitApi = {
  /**
   * Submits a 784-element normalized float array to the standalone ML microservice.
   */
  async predict(image: number[]): Promise<PredictResponse> {
    return http.post<PredictResponse>("/api/predict", { image });
  },
};

export interface AdminPredictionRecord {
  id: string;
  prediction_id?: number | null;
  model_name: string;
  predicted_digit: number;
  confidence: number;
  probabilities: number[];
  image_data: number[];
  created_at: string;
  actual_digit?: number | null;
}

import axios from 'axios';

// Reemplaza con la IP local de tu computadora (ej: 'http://192.168.1.45:8000')
const BASE_URL = 'http://192.168.0.12:8000'; 

export const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Tipado de la respuesta del Backend para mantener consistencia con TypeScript
export interface NudgeProfile {
  critical_day: string;
  critical_category: string;
  average_critical_hour: number;
  vulnerability_score: number;
  nudge_trigger_time: {
    hour: number;
    minute: number;
  };
  suggested_nudge_message: string;
}

export interface PredictionResponse {
  user_id: string;
  insights_calculated_at: string;
  nudge_profile: NudgeProfile;
}

export interface UserMetrics {
  first_name: string;
  saving_goal_name: string;
  saving_goal_target: number;
  saving_goal_current: number;
  rescued_cash_total: number;
}



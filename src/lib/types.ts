export type Gender = 'male' | 'female';

export interface MajorEvent {
  year: number;
  event: string;
  sentiment: 'positive' | 'negative' | 'neutral';
}

export interface UserInput {
  name: string;
  gender: Gender;
  birthYear: number;
  birthMonth: number;
  birthDay: number;
  birthHour: number;
  birthMinute: number;
  birthLocation: string;
  birthLat?: number;
  birthLng?: number;
  majorEvents: MajorEvent[];
  api_mode?: 'free' | 'pro';
}

// Data for a single year candle
export interface ChartDataPoint {
  age: number;
  year: number;
  ganZhi: string; // The pillar for the year
  daYun: string;  // The 10-year major cycle
  open: number;
  close: number;
  high: number;
  low: number;
  score: number; // usually equals close
  reason: string; // Brief 12-40 word explanation
}

export interface AnalysisSection {
  summary: string;
  summaryScore: number;
  personality: string;
  personalityScore: number;
  career: string;
  careerScore: number;
  wealth: string;
  wealthScore: number;
  marriage: string;
  marriageScore: number;
  health: string;
  healthScore: number;
  family: string; // 六亲
  tradingStyle: string; // 交易运势/Crypto Style
}

export interface FullAnalysisResult {
  bazi: string[]; // [Year, Month, Day, Hour] pillars
  chartData: ChartDataPoint[];
  analysis: AnalysisSection;
  is_premium: boolean;
}

export interface ApiResponse {
  task_id: string;
  status: "completed" | "failed";
  result?: FullAnalysisResult;
  error?: string;
}
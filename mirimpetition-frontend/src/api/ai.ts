import axiosInstance from './axios';

export interface AIAnalysis {
  sentiment: 'POSITIVE' | 'NEUTRAL' | 'NEGATIVE';
  keywords: string[];
  summary: string;
  category: string;
}

export interface Recommendation {
  id: string;
  title: string;
  similarity: number;
  reason: string;
}

export const aiApi = {
  analyzePetition: (petitionId: string) => 
    axiosInstance.post<AIAnalysis>(`/ai/analyze/${petitionId}`),
  
  getRecommendations: () => 
    axiosInstance.get<Recommendation[]>('/ai/recommendations'),
  
  categorizePetition: (petitionId: string) => 
    axiosInstance.post<{ category: string }>(`/ai/categorize/${petitionId}`),
  
  summarizePetition: (petitionId: string) => 
    axiosInstance.post<{ summary: string }>(`/ai/summarize/${petitionId}`),
}; 
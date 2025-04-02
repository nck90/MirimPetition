import axiosInstance from './axios';

export interface DateRange {
  startDate: string;
  endDate: string;
}

export interface PetitionStats {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
  completed: number;
}

export interface CategoryStats {
  category: string;
  count: number;
}

export interface UserStats {
  total: number;
  active: number;
  inactive: number;
}

export interface PopularPetition {
  id: string;
  title: string;
  voteCount: number;
}

export interface StatisticsResponse {
  petitions: PetitionStats;
  categories: CategoryStats[];
  users: UserStats;
  popular: PopularPetition[];
}

export const statisticsApi = {
  getPetitionStats: (dateRange: DateRange) => 
    axiosInstance.get<PetitionStats>('/statistics/petitions', { params: dateRange }),
  
  getCategoryStats: () => 
    axiosInstance.get<CategoryStats[]>('/statistics/categories'),
  
  getUserStats: () => 
    axiosInstance.get<UserStats>('/statistics/users'),
  
  getPopularPetitions: (params: { limit?: number; period?: string }) => 
    axiosInstance.get<PopularPetition[]>('/statistics/popular', { params }),
}; 
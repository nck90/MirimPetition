import axiosInstance from './axios';
import { Petition } from './petitions';

export interface SearchParams {
  keyword?: string;
  status?: string;
  category?: string;
  page?: number;
  limit?: number;
}

export interface SearchResponse {
  items: Petition[];
  total: number;
  page: number;
  limit: number;
}

export const searchApi = {
  searchPetitions: (params: SearchParams) => 
    axiosInstance.get<SearchResponse>('/search/petitions', { params }),
  
  getPopularPetitions: () => 
    axiosInstance.get<Petition[]>('/search/popular'),
  
  getRecentPetitions: () => 
    axiosInstance.get<Petition[]>('/search/recent'),
}; 
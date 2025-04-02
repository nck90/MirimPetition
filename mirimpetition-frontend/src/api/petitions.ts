import axiosInstance from './axios';

export interface Petition {
  id: string;
  title: string;
  content: string;
  category: string;
  targetCount: number;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'COMPLETED';
  createdAt: string;
  updatedAt: string;
  userId: string;
}

export interface CreatePetitionData {
  title: string;
  content: string;
  category: string;
  targetCount: number;
}

export interface UpdatePetitionData {
  title?: string;
  content?: string;
  category?: string;
  targetCount?: number;
}

export interface PetitionQueryParams {
  page?: number;
  limit?: number;
}

export interface PetitionListResponse {
  items: Petition[];
  total: number;
  page: number;
  limit: number;
}

export const petitionsApi = {
  create: (data: CreatePetitionData) => 
    axiosInstance.post<Petition>('/petitions', data),
  
  getList: (params: PetitionQueryParams) => 
    axiosInstance.get<PetitionListResponse>('/petitions', { params }),
  
  getById: (id: string) => 
    axiosInstance.get<Petition>(`/petitions/${id}`),
  
  update: (id: string, data: UpdatePetitionData) => 
    axiosInstance.patch<Petition>(`/petitions/${id}`, data),
  
  delete: (id: string) => 
    axiosInstance.delete(`/petitions/${id}`),
  
  updateStatus: (id: string, status: Petition['status']) => 
    axiosInstance.patch(`/petitions/${id}/status`, { status }),
}; 
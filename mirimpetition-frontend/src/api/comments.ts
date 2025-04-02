import axiosInstance from './axios';

export interface Comment {
  id: string;
  content: string;
  petitionId: string;
  userId: string;
  isOfficialResponse: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCommentData {
  content: string;
  petitionId: string;
  isOfficialResponse: boolean;
}

export interface UpdateCommentData {
  content: string;
}

export const commentsApi = {
  create: (data: CreateCommentData) => 
    axiosInstance.post<Comment>('/comments', data),
  
  getByPetition: (petitionId: string) => 
    axiosInstance.get<Comment[]>(`/comments/petition/${petitionId}`),
  
  update: (id: string, data: UpdateCommentData) => 
    axiosInstance.patch<Comment>(`/comments/${id}`, data),
  
  delete: (id: string) => 
    axiosInstance.delete(`/comments/${id}`),
}; 
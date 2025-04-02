import axiosInstance from './axios';

export interface Notification {
  id: string;
  title: string;
  content: string;
  type: 'PETITION_UPDATE' | 'VOTE' | 'COMMENT' | 'SYSTEM';
  isRead: boolean;
  createdAt: string;
}

export const notificationsApi = {
  getList: () => 
    axiosInstance.get<Notification[]>('/notifications'),
  
  getById: (id: string) => 
    axiosInstance.get<Notification>(`/notifications/${id}`),
}; 
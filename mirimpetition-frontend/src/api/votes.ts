import axiosInstance from './axios';

export interface Vote {
  id: string;
  petitionId: string;
  userId: string;
  voteType: 'AGREE' | 'DISAGREE';
  createdAt: string;
}

export interface CreateVoteData {
  voteType: Vote['voteType'];
}

export const votesApi = {
  create: (petitionId: string, data: CreateVoteData) => 
    axiosInstance.post<Vote>(`/votes/${petitionId}`, data),
  
  getUserVotes: (userId: string) => 
    axiosInstance.get<Vote[]>(`/votes/user/${userId}`),
}; 
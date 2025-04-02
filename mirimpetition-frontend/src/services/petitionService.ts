import axios from '../api/axios';

export interface Petition {
    id?: number;
    title: string;
    content: string;
    createdAt?: Date;
    updatedAt?: Date;
    userId?: number;
    status?: string;
    category?: string;
    tags?: string[];
}

export interface PetitionResponse {
    data: Petition[];
    meta?: {
        total: number;
        page: number;
        limit: number;
    };
}

export const petitionService = {
    // 모든 청원 목록 조회 (페이지네이션 지원)
    getAllPetitions: async (page = 1, limit = 10) => {
        const response = await axios.get<PetitionResponse>(`/petitions?page=${page}&limit=${limit}`);
        return response.data;
    },

    // 특정 청원 조회
    getPetition: async (id: number) => {
        const response = await axios.get<Petition>(`/petitions/${id}`);
        return response.data;
    },

    // 새 청원 생성
    createPetition: async (petition: Omit<Petition, 'id' | 'createdAt' | 'updatedAt'>) => {
        const response = await axios.post<Petition>('/petitions', petition);
        return response.data;
    },

    // 청원 수정
    updatePetition: async (id: number, petition: Partial<Petition>) => {
        const response = await axios.patch<Petition>(`/petitions/${id}`, petition);
        return response.data;
    },

    // 청원 삭제
    deletePetition: async (id: number) => {
        const response = await axios.delete(`/petitions/${id}`);
        return response.data;
    },

    // 청원 검색
    searchPetitions: async (query: string, page = 1, limit = 10) => {
        const response = await axios.get<PetitionResponse>(`/petitions/search?q=${query}&page=${page}&limit=${limit}`);
        return response.data;
    },

    // 청원 카테고리별 조회
    getPetitionsByCategory: async (category: string, page = 1, limit = 10) => {
        const response = await axios.get<PetitionResponse>(`/petitions/category/${category}?page=${page}&limit=${limit}`);
        return response.data;
    }
}; 
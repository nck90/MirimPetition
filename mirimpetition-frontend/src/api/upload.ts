import axiosInstance from './axios';

export type UploadType = 'petition' | 'profile';

export interface UploadResponse {
  url: string;
}

export const uploadApi = {
  uploadFile: (file: File, type: UploadType) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);
    
    return axiosInstance.post<UploadResponse>('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  
  deleteFile: (fileUrl: string) => 
    axiosInstance.delete(`/upload/${fileUrl}`),
}; 
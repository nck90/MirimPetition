import React, { useState, useEffect } from 'react';
import { petitionService, Petition } from '../services/petitionService';

const PetitionTest: React.FC = () => {
    const [petitions, setPetitions] = useState<Petition[]>([]);
    const [message, setMessage] = useState<string>('');
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(0);

    // 모든 청원 조회
    const fetchPetitions = async () => {
        try {
            const response = await petitionService.getAllPetitions(page);
            setPetitions(response.data);
            setTotal(response.meta?.total || 0);
            setMessage('청원 목록 조회 성공');
        } catch (error) {
            setMessage('청원 목록 조회 실패');
            console.error('Error:', error);
        }
    };

    // 새 청원 생성
    const createNewPetition = async () => {
        try {
            const newPetition = {
                title: '테스트 청원',
                content: '이것은 테스트 청원입니다.',
                category: '일반',
                tags: ['테스트', '샘플']
            };
            const response = await petitionService.createPetition(newPetition);
            setMessage('청원 생성 성공');
            console.log('Created:', response);
            fetchPetitions(); // 목록 새로고침
        } catch (error) {
            setMessage('청원 생성 실패');
            console.error('Error:', error);
        }
    };

    // 청원 검색
    const searchPetitions = async () => {
        try {
            const response = await petitionService.searchPetitions('테스트');
            setPetitions(response.data);
            setTotal(response.meta?.total || 0);
            setMessage('청원 검색 성공');
        } catch (error) {
            setMessage('청원 검색 실패');
            console.error('Error:', error);
        }
    };

    useEffect(() => {
        fetchPetitions();
    }, [page]);

    return (
        <div>
            <h2>청원 API 테스트</h2>
            <div>
                <button onClick={createNewPetition}>새 청원 생성</button>
                <button onClick={searchPetitions}>청원 검색</button>
                <button onClick={fetchPetitions}>청원 목록 새로고침</button>
            </div>
            <p>{message}</p>
            <div>
                <h3>청원 목록 (총 {total}개):</h3>
                {petitions.map((petition) => (
                    <div key={petition.id} style={{ marginBottom: '1rem', padding: '1rem', border: '1px solid #ccc' }}>
                        <h4>{petition.title}</h4>
                        <p>{petition.content}</p>
                        <div>
                            <small>카테고리: {petition.category}</small>
                            <small>태그: {petition.tags?.join(', ')}</small>
                        </div>
                    </div>
                ))}
            </div>
            <div>
                <button 
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page === 1}
                >
                    이전
                </button>
                <span>페이지 {page}</span>
                <button 
                    onClick={() => setPage(p => p + 1)}
                    disabled={petitions.length < 10}
                >
                    다음
                </button>
            </div>
        </div>
    );
};

export default PetitionTest; 
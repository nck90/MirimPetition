import { useEffect, useState } from 'react';
import { statisticsApi, CategoryStats, UserStats, PopularPetition } from '../api';

const Dashboard = () => {
  const [categoryStats, setCategoryStats] = useState<CategoryStats[]>([]);
  const [userStats, setUserStats] = useState<UserStats>({
    total: 0,
    active: 0,
    inactive: 0,
  });
  const [popularPetitions, setPopularPetitions] = useState<PopularPetition[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categoriesResponse, usersResponse, popularResponse] = await Promise.all([
          statisticsApi.getCategoryStats(),
          statisticsApi.getUserStats(),
          statisticsApi.getPopularPetitions({ limit: 5, period: '7d' }),
        ]);

        setCategoryStats(categoriesResponse.data);
        setUserStats(usersResponse.data);
        setPopularPetitions(popularResponse.data);
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">관리자 대시보드</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-900">전체 사용자</h3>
          <p className="text-3xl font-bold text-indigo-600">{userStats.total}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-900">활성 사용자</h3>
          <p className="text-3xl font-bold text-green-600">{userStats.active}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-900">비활성 사용자</h3>
          <p className="text-3xl font-bold text-red-600">{userStats.inactive}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-bold text-gray-900 mb-4">카테고리별 통계</h2>
          <div className="space-y-4">
            {categoryStats.map((stat) => (
              <div key={stat.category} className="flex justify-between items-center">
                <span className="text-gray-700">{stat.category}</span>
                <span className="font-semibold text-gray-900">{stat.count}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-bold text-gray-900 mb-4">인기 청원 (최근 7일)</h2>
          <div className="space-y-4">
            {popularPetitions.map((petition) => (
              <div
                key={petition.id}
                className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium text-gray-900">{petition.title}</p>
                    <p className="text-sm text-gray-500">
                      {petition.voteCount}명 참여
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 
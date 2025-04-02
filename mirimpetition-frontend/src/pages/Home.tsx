import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { searchApi, statisticsApi, Petition } from '../api';

const Home = () => {
  const { isAuthenticated } = useAuth();
  const [recentPetitions, setRecentPetitions] = useState<Petition[]>([]);
  const [popularPetitions, setPopularPetitions] = useState<Petition[]>([]);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    completed: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [recentResponse, popularResponse, statsResponse] = await Promise.all([
          searchApi.getRecentPetitions(),
          searchApi.getPopularPetitions(),
          statisticsApi.getPetitionStats({
            startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
            endDate: new Date().toISOString(),
          }),
        ]);

        setRecentPetitions(recentResponse.data);
        setPopularPetitions(popularResponse.data);
        setStats(statsResponse.data);
      } catch (error) {
        console.error('Failed to fetch home data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          미림 청원
        </h1>
        <p className="text-xl text-gray-600">
          여러분의 의견을 들려주세요
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-900">전체 청원</h3>
          <p className="text-3xl font-bold text-indigo-600">{stats.total}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-900">대기중</h3>
          <p className="text-3xl font-bold text-yellow-600">{stats.pending}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-900">승인됨</h3>
          <p className="text-3xl font-bold text-green-600">{stats.approved}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-900">완료됨</h3>
          <p className="text-3xl font-bold text-blue-600">{stats.completed}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">최근 청원</h2>
          <div className="space-y-4">
            {recentPetitions.map((petition) => (
              <Link
                key={petition.id}
                to={`/petitions/${petition.id}`}
                className="block bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow"
              >
                <h3 className="font-semibold text-gray-900">{petition.title}</h3>
                <p className="text-sm text-gray-500 mt-1">
                  {new Date(petition.createdAt).toLocaleDateString()}
                </p>
              </Link>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">인기 청원</h2>
          <div className="space-y-4">
            {popularPetitions.map((petition) => (
              <Link
                key={petition.id}
                to={`/petitions/${petition.id}`}
                className="block bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow"
              >
                <h3 className="font-semibold text-gray-900">{petition.title}</h3>
                <p className="text-sm text-gray-500 mt-1">
                  {new Date(petition.createdAt).toLocaleDateString()}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {isAuthenticated && (
        <div className="text-center mt-12">
          <Link
            to="/create-petition"
            className="inline-block bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors"
          >
            청원 작성하기
          </Link>
        </div>
      )}
    </div>
  );
};

export default Home; 
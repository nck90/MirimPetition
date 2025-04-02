import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { petitionsApi, votesApi, Petition, Vote } from '../api';

const Profile = () => {
  const { user, logout } = useAuth();
  const [myPetitions, setMyPetitions] = useState<Petition[]>([]);
  const [myVotes, setMyVotes] = useState<Vote[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      if (!user?.id) return;

      try {
        const [votesResponse] = await Promise.all([
          votesApi.getUserVotes(user.id),
        ]);

        setMyVotes(votesResponse.data);
      } catch (error) {
        console.error('Failed to fetch profile data:', error);
      }
    };

    fetchData();
  }, [user]);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">프로필</h1>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">이름</label>
              <p className="mt-1 text-lg text-gray-900">{user.name}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">이메일</label>
              <p className="mt-1 text-lg text-gray-900">{user.email}</p>
            </div>
            <button
              onClick={handleLogout}
              className="mt-4 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors"
            >
              로그아웃
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">내 투표 내역</h2>
          <div className="space-y-4">
            {myVotes.map((vote) => (
              <div
                key={vote.id}
                className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium text-gray-900">
                      {vote.voteType === 'AGREE' ? '찬성' : '반대'}
                    </p>
                    <p className="text-sm text-gray-500">
                      {new Date(vote.createdAt).toLocaleDateString()}
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

export default Profile; 
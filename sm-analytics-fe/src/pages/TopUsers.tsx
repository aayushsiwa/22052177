import { useState, useEffect } from 'react';
import UserCard from '../components/UserCard';
import api from '../api/api';

const TopUsers = () => {
  interface User {
    id: number;
    username: string;
    postCount: number;
  }

  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    const fetchTopUsers = async () => {
      try {
        setLoading(true);
        const topUsers = await api.getTopUsers();
        setUsers(topUsers);
        setLoading(false);
      } catch (err) {
        setError(`Failed: ${(err as { message?: string })?.message || 'Unknown error'}`);
        setLoading(false);
      }
    };
    fetchTopUsers();
  }, []);
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Top Users</h1>
        <p className="text-gray-600">Users with the highest number of posts</p>
      </div>

      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6">
          <p>{error}</p>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center my-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <div>
          {users.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-gray-500">No user data available yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {users.map((user, index) => (
                <div key={user?.id} className="transform hover:-translate-y-1 transition-transform duration-300">
                  <UserCard user={user} rank={index + 1} />
                </div>
              ))}
            </div>
          )}
          
          {users.length > 0 && (
            <div className="mt-8 bg-blue-50 rounded-lg p-4 border border-blue-100">
              <h3 className="text-lg font-semibold text-blue-800 mb-2">What Makes a Top User?</h3>
              <p className="text-blue-700">
                Top users are determined by the total number of posts they've created. These active community members 
                help drive engagement and provide valuable content to the platform.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TopUsers;
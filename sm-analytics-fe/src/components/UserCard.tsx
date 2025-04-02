import React from 'react';

interface User {
  id: number;
  username: string;
  postCount: number;
  followers?: number;
}

const UserCard: React.FC<{ user: User; rank?: number }> = ({ user, rank }) => {
  // Generate a random avatar from a consistent seed (user id)
  const avatarUrl = `https://i.pravatar.cc/150?img=${user.id % 70 || rank}`;

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="p-4 flex items-center space-x-4">
        <div className="relative">
          <img 
            src={avatarUrl} 
            alt={`${user.username}'s avatar`} 
            className="w-16 h-16 rounded-full object-cover border-2 border-blue-500"
          />
          {rank && (
            <div className="absolute -top-2 -right-2 bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center font-bold text-sm">
              {rank}
            </div>
          )}
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-bold text-gray-800">{user.username}</h3>
          <p className="text-gray-600">@{user.username.toLowerCase().replace(/\s/g, '')}</p>
          <div className="flex space-x-4 mt-2">
            <div className="text-sm">
              <span className="font-semibold text-blue-600">{user.postCount}</span>
              <span className="text-gray-500 ml-1">Posts</span>
            </div>
            {user.followers && (
              <div className="text-sm">
                <span className="font-semibold text-blue-600">{user.followers}</span>
                <span className="text-gray-500 ml-1">Followers</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserCard;
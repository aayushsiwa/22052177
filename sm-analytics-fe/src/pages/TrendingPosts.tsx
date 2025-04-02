import React, { useState, useEffect } from 'react';
import PostCard from '../components/PostCard';
import api from '../api/api';

const TrendingPosts = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTrendingPosts = async () => {
      try {
        setLoading(true);
        const trendingPosts = await api.getTrendingPosts();
        
        // Make sure we have unique posts by filtering based on ID
        const uniquePosts = Array.from(
          new Map(trendingPosts.map(post => [post.id, post])).values()
        );
        
        setPosts(uniquePosts);
        setLoading(false);
      } catch (err) {
        setError('Failed to load trending posts. Please try again later.');
        setLoading(false);
      }
    };

    fetchTrendingPosts();
    
    // Refresh trending posts periodically
    const interval = setInterval(fetchTrendingPosts, 60000); // Refresh every minute
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Trending Posts</h1>
        <p className="text-gray-600">Posts with the highest number of comments</p>
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
          {posts.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-gray-500">No trending posts available yet.</p>
            </div>
          ) : (
            <>
              <div className="bg-gradient-to-r from-purple-600 to-blue-500 text-white p-4 rounded-lg mb-6">
                <div className="flex items-center">
                  <div className="mr-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">Hot right now!</h3>
                    <p>These posts are generating the most conversations</p>
                  </div>
                </div>
              </div>
              
              <div>
                {posts.map((post, idx) => (
                  <PostCard 
                    key={`${post.id}-${idx}`} // Use combination of id and index to ensure uniqueness
                    post={post} 
                    isTrending={true} 
                  />
                ))}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default TrendingPosts;
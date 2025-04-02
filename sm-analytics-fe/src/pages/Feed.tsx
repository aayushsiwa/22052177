import { useState, useEffect, useCallback } from 'react';
import PostCard, { PostCardSkeleton } from '../components/PostCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { api } from '../api/api';

interface Post {
  id: string;
  title: string;
  content: string;
  username: string;
  comments?: number;
  likes?: number;
}

function Feed() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [pollingInterval] = useState<number>(5000); // 5 seconds default
  const [isConnected, setIsConnected] = useState<boolean>(true);

  const handleNewPost = useCallback((newPosts: Post[]) => {
    setPosts((prevPosts) => {
      const updatedPosts = [...prevPosts];
      
      newPosts.forEach(newPost => {
        const existingIndex = updatedPosts.findIndex(p => p.id === newPost.id);
        
        if (existingIndex >= 0) {
          updatedPosts[existingIndex] = newPost;
        } else {
          updatedPosts.unshift(newPost);
        }
      });
      
      return updatedPosts.slice(0, 50);
    });
    
    setIsConnected(true);
    setError(null);
  }, []);

  const handleInitialData = useCallback((initialPosts: Post[]) => {
    setPosts(initialPosts);
    setLoading(false);
    setIsConnected(true);
    setError(null);
  }, []);

  const handleError = useCallback((errorMessage: string) => {
    console.error(errorMessage);
    setError(`Connection error. Attempting to reconnect...`);
    setIsConnected(false);
  }, []);

  const reconnect = useCallback(() => {
    setError(null);
    setLoading(true);
    
    if ((window as any).feedDisconnect) {
      (window as any).feedDisconnect();
    }
    
    (window as any).feedDisconnect = api.connectToFeed(
      handleNewPost,
      handleInitialData,
      handleError,
      pollingInterval
    );
  }, [handleNewPost, handleInitialData, handleError, pollingInterval]);

  useEffect(() => {
    (window as any).feedDisconnect = api.connectToFeed(
      handleNewPost, 
      handleInitialData, 
      handleError,
      pollingInterval
    );
    
    return () => {
      if ((window as any).feedDisconnect) {
        (window as any).feedDisconnect();
      }
    };
  }, [handleNewPost, handleInitialData, handleError, pollingInterval]);

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Live Feed</h1>
        <div className="flex items-center">
          {!isConnected && (
            <button 
              onClick={reconnect}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded mr-3"
            >
              Reconnect
            </button>
          )}
          <div className={`h-3 w-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'} mr-2`}></div>
          <span className="text-sm text-gray-600">
            {isConnected ? 'Connected' : 'Disconnected'}
          </span>
        </div>
      </div>
      
      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6">
          <p>{error}</p>
        </div>
      )}
      
      {loading && posts.length === 0 ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, index) => (
            <PostCardSkeleton key={index} />
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {posts.map((post) => (
            <PostCard 
              key={post.id} 
              post={{
                ...post,
                comments: post.comments || 0,
                likes: post.likes || 0
              }}
            />
          ))}
          
          {posts.length === 0 && !loading && (
            <div className="text-center py-8 text-gray-500">
              No posts available. Check back soon!
            </div>
          )}
        </div>
      )}
      
      {loading && posts.length > 0 && (
        <div className="flex justify-center mt-6">
          <LoadingSpinner />
        </div>
      )}
    </div>
  );
}

export default Feed;

const API_BASE_URL = 'http://localhost:3000';

interface Post {
  id: number;
  userId: number;
  username: string;
  content: string;
  createdAt: string;
}

export const api = {
  getFeed: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/posts?type=latest`);
      if (!response.ok) throw new Error('Failed to fetch feed');
      const data = await response.json();
      return data.latestPosts || [];
    } catch (error) {
      console.error('Error fetching feed:', error);
      throw error;
    }
  },
  
  getTopUsers: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/users`);
      if (!response.ok) throw new Error('Failed to fetch top users');
      const users = await response.json();
      
      return users.map((user: { userId: number; username: string; postCount: number }) => ({
        id: user.userId,
        username: user.username,
        postCount: user.postCount
      }));
    } catch (error) {
      console.error('Error fetching top users:', error);
      throw error;
    }
  },
  
  getTrendingPosts: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/posts?type=popular`);
      if (!response.ok) throw new Error('Failed to fetch trending posts');
      
      const data = await response.json();
      if (!data.topPosts || data.topPosts.length === 0) return [];
      
      const latestPostsResponse = await fetch(`${API_BASE_URL}/posts?type=latest`);
      if (!latestPostsResponse.ok) throw new Error('Failed to fetch latest posts');
      const latestData = await latestPostsResponse.json();
      const allPosts = latestData.latestPosts;

      return data.topPosts.map((trendingPost: { postId: number; userid: number; commentCount?: number }) => {
        const fullPost = allPosts.find((post: { id: number; }) => post.id === trendingPost.postId) || {};
        return {
          ...fullPost,
          id: trendingPost.postId,
          userId: trendingPost.userid,
          comments: trendingPost.commentCount || 0,
          isTrending: true
        };
      });
    } catch (error) {
      console.error('Error fetching trending posts:', error);
      throw error;
    }
  },
  
  getAllPosts: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/posts?type=latest`);
      if (!response.ok) throw new Error('Failed to fetch all posts');
      
      const data = await response.json();
      return data.latestPosts.map((post: { id: number; userid: number; username: string; content: string; }) => ({
        ...post,
        userId: post.userid,
        username: post.username,
        createdAt: new Date().toISOString() 
      })).sort((a: Post, b: Post) => b.id - a.id);
    } catch (error) {
      console.error('Error fetching all posts:', error);
      throw error;
    }
  },
  
  connectToFeed: (onInitialData: (data: { id: number; userId: number; username: string; createdAt: string; }[]) => void, onError: (message: string) => void, pollInterval = 5000) => {
    let isPolling = true;
    let timeoutId: ReturnType<typeof setTimeout> | null = null;
    
    const fetchPosts = async () => {
      if (!isPolling) return;
      
      try {
        const latestPosts = await api.getFeed();
        if (latestPosts.length > 0) {
          onInitialData(latestPosts);
        }
        
        timeoutId = setTimeout(fetchPosts, pollInterval);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        onError(`Failed to fetch posts: ${errorMessage}`);
        timeoutId = setTimeout(fetchPosts, pollInterval * 2);
      }
    };
    
    fetchPosts();
    
    return () => {
      isPolling = false;
      if (timeoutId) clearTimeout(timeoutId);
    };
  }
};

export default api;
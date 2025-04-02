import { Link, useLocation } from 'react-router-dom';
const Navbar = () => {
  const location = useLocation();
  const isActive = (path: string): boolean => {
    return location.pathname === path;
  };
  return (
    <nav className="bg-blue-600 shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <span className="text-white text-xl font-bold">Social Media Analytics</span>
          </div>
          <div className="flex items-center space-x-4">
            <Link 
              to="/" 
              className={`text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors
                ${isActive('/') ? 'bg-blue-700 font-bold' : ''}`}
            >
              Feed
            </Link>
            <Link 
              to="/top-users" 
              className={`text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors
                ${isActive('/top-users') ? 'bg-blue-700 font-bold' : ''}`}
            >
              Top Users
            </Link>
            <Link 
              to="/trending-posts" 
              className={`text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors
                ${isActive('/trending-posts') ? 'bg-blue-700 font-bold' : ''}`}
            >
              Trending Posts
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
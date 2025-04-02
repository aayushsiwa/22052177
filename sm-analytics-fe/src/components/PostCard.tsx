import  { useState } from "react";

interface Post {
    id: number;
    userid: number;
    username?: string;
    title: string;
    likes?: number;
    comments?: number;
}

const PostCard = ({ post }: { post: Post }) => {
    const [imageLoaded, setImageLoaded] = useState(false);
    const imageId = post.id;
    const imageUrl = `https://picsum.photos/seed/${imageId}/800/400`;

    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6 hover:shadow-lg transition-shadow duration-300">
            <div className={`p-4 `}>
                <div className="flex items-center mb-4">
                    <img
                        src={`https://i.pravatar.cc/150?img=${post.userid}`}
                        alt="User avatar"
                        className="w-10 h-10 rounded-full mr-3"
                    />
                    <div>
                        <h4 className="font-semibold text-gray-800">
                            {post.username || `User_${post.userid}`}
                        </h4>
                        <span className="text-xs text-gray-500">
                            {"Post No-" + post.id}
                        </span>
                    </div>
                </div>

                <h3 className="text-xl font-bold text-gray-800 mb-2">
                    {post.title}
                </h3>
                {imageUrl && (
                    <div className="mb-4 rounded-lg overflow-hidden relative">
                        {!imageLoaded && (
                            <div
                                className="absolute inset-0 bg-gray-200 animate-pulse"
                                style={{ height: "200px" }}
                            ></div>
                        )}
                        <img
                            src={imageUrl}
                            alt="Post content"
                            className={`w-full h-auto ${
                                !imageLoaded ? "opacity-0" : "opacity-100"
                            } transition-opacity duration-300`}
                            onLoad={() => setImageLoaded(true)}
                        />
                    </div>
                )}

                <div className="flex justify-between items-center pt-3 mt-3 border-t border-gray-200">
                    <div className="flex space-x-4">
                        <span className="flex items-center text-gray-500">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5 mr-1"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                                />
                            </svg>
                            {post.likes || 0}
                        </span>
                        <span className="flex items-center text-gray-500">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5 mr-1"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                                />
                            </svg>
                            {post.comments || 0}
                        </span>
                    </div>
                    <div>
                        <button className="text-blue-500 hover:text-blue-700 text-sm font-semibold">
                            View Details
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export const PostCardSkeleton = () => {
    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6 p-4">
            <div className="flex items-center mb-4">
                <div className="w-10 h-10 rounded-full bg-gray-200 animate-pulse mr-3"></div>
                <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded animate-pulse w-32"></div>
                    <div className="h-3 bg-gray-200 rounded animate-pulse w-24"></div>
                </div>
            </div>

            <div className="space-y-3">
                <div className="h-6 bg-gray-200 rounded animate-pulse w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded animate-pulse w-full"></div>
                <div className="h-4 bg-gray-200 rounded animate-pulse w-full"></div>
                <div className="h-4 bg-gray-200 rounded animate-pulse w-2/3"></div>
            </div>

            <div className="mt-4 mb-4 w-full h-48 bg-gray-200 rounded animate-pulse"></div>

            <div className="flex justify-between items-center pt-3 mt-3 border-t border-gray-200">
                <div className="flex space-x-4">
                    <div className="h-5 bg-gray-200 rounded animate-pulse w-16"></div>
                    <div className="h-5 bg-gray-200 rounded animate-pulse w-16"></div>
                </div>
                <div className="h-5 bg-gray-200 rounded animate-pulse w-24"></div>
            </div>
        </div>
    );
};

export default PostCard;

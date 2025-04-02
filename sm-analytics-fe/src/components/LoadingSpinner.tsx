function LoadingSpinner() {
  return (
    <div className="flex justify-center items-center min-h-[50vh]">
      <div className="relative">
        <div className="w-16 h-16 border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
        </div>
      </div>
    </div>
  );
}

export default LoadingSpinner;
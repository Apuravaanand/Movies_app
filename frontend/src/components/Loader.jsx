const Loader = () => {
    return (
        <div className="space-y-3">
            {/* Title skeleton */}
            <div className="h-6 w-40 bg-gray-300 rounded animate-pulse"></div>

            {/* Cards skeleton */}
            <div className="flex gap-4 overflow-hidden">
                {Array.from({ length: 6 }).map((_, i) => (
                    <div
                        key={i}
                        className="w-60 h-64 bg-gray-300 rounded-lg animate-pulse bg-gradient-to-r from-gray-300 via-gray-200 to-gray-300"
                    ></div>
                ))}
            </div>
        </div>
    );
};

export default Loader;
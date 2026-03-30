import MovieCard from "./MovieCard.jsx";

const MovieRow = ({ title, movies = [] }) => {
    // Prevent crash if movies is undefined/null
    if (!Array.isArray(movies) || movies.length === 0) {
        return (
            <div className="my-6">
                <h2 className="text-xl font-semibold mb-2">{title}</h2>
                <p className="text-gray-500">No movies available.</p>
            </div>
        );
    }

    return (
        <div className="my-6">
            <h2 className="text-xl font-semibold mb-2">{title}</h2>

            <div className="flex gap-4 overflow-x-auto scrollbar-hide">
                {movies.map((movie) => (
                    <MovieCard
                        key={movie._id || movie.id}
                        movie={movie}
                    />
                ))}
            </div>
        </div>
    );
};

export default MovieRow;
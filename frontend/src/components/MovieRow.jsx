// src/components/MovieRow.jsx

import MovieCard from "./MovieCard.jsx";

const MovieRow = ({ title, movies = [] }) => {
    return (
        <div className="space-y-4 mb-8">

            {/* Row Title */}
            <h2 className="text-xl font-semibold text-gray">{title}</h2>

            {/* Horizontal Scroll Row */}
            <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-2">
                {movies.length > 0 ? (
                    movies.map((movie) => (
                        <MovieCard key={movie._id} movie={movie} />
                    ))
                ) : (
                    <p className="text-gray-400">No movies available</p>
                )}
            </div>

        </div>
    );
};

export default MovieRow;
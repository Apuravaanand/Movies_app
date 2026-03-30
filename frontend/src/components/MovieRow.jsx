// src/components/MovieRow.jsx
import MovieCard from "./MovieCard.jsx";

const MovieRow = ({ title, movies }) => {
    return (
        <div className="space-y-4">
            <h2 className="text-xl font-semibold">{title}</h2>
            <div className="flex gap-4 overflow-x-auto">
                {movies.length > 0 ? (
                    movies.map((movie) => <MovieCard key={movie._id} movie={movie} />)
                ) : (
                    <p className="text-gray-500">No movies available</p>
                )}
            </div>
        </div>
    );
};

export default MovieRow;
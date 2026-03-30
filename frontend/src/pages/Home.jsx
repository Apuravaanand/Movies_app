// src/pages/Home.jsx
import { useEffect, useState } from "react";
import { getAllMovies } from "../api/movie.api.js";
import MovieCard from "../components/MovieCard.jsx";

const Home = () => {
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(true);

    // Fetch all movies
    useEffect(() => {
        const fetchMovies = async () => {
            try {
                const res = await getAllMovies();
                setMovies(res.data?.data || res.data || []);
            } catch (err) {
                console.error("Fetch error:", err);
                alert("Failed to fetch movies");
            } finally {
                setLoading(false);
            }
        };

        fetchMovies();
    }, []);

    if (loading) {
        return (
            <div className="ml-64 p-6">
                <h1 className="text-xl font-bold text-green-700">Loading movies...</h1>
            </div>
        );
    }

    return (
        <div className="ml-64 p-6">
            <h1 className="text-2xl font-bold text-green-700 mb-4">All Movies</h1>

            {movies.length === 0 ? (
                <p className="text-gray-500">No movies found.</p>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {movies.map((movie) => (
                        <MovieCard key={movie._id} movie={movie} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default Home;
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext.jsx";
import { toggleFavoriteMovie } from "../api/user.api.js";

const MovieCard = ({ movie }) => {
    const navigate = useNavigate();
    const { user, setUser } = useContext(AuthContext);

    const [isFav, setIsFav] = useState(false);
    const [loading, setLoading] = useState(false);

    // Check favorite
    useEffect(() => {
        if (!user?.favorites || !movie?._id) return;

        setIsFav(
            user.favorites.some(
                (id) => id.toString() === movie._id.toString()
            )
        );
    }, [user?.favorites, movie?._id]);

    // Toggle favorite
    const handleFavorite = async (e) => {
        e.stopPropagation();
        if (loading) return;

        try {
            setLoading(true);

            const res = await toggleFavoriteMovie(movie._id);
            const updatedFavorites = res.data.favorites;

            const updatedUser = {
                ...user,
                favorites: updatedFavorites,
            };

            setUser(updatedUser);
            localStorage.setItem("user", JSON.stringify(updatedUser));
        } catch (err) {
            console.error("Favorite error:", err);
        } finally {
            setLoading(false);
        }
    };

    // CLEAN POSTER LOGIC (single source)
    const poster = movie.posterUrl
        ? movie.posterUrl.startsWith("http")
            ? movie.posterUrl
            : `${import.meta.env.VITE_API_URL || "http://localhost:5000"}${movie.posterUrl}`
        : "/default-poster.jpg";

    return (
        <div
            onClick={() => navigate(`/movie/${movie._id}`)}
            className="relative min-w-[180px] max-w-[200px] bg-white rounded-xl shadow-md overflow-hidden cursor-pointer hover:scale-105 transition duration-300 flex-shrink-0"
        >
            {/* Poster */}
            <div className="w-full h-64 overflow-hidden">
                <img
                    src={poster}
                    alt={movie.title}
                    className="w-full h-full object-cover"
                    onError={(e) => (e.target.src = "/default-poster.jpg")}
                />
            </div>

            {/* Content */}
            <div className="p-3">
                <h3 className="text-sm font-semibold truncate">
                    {movie.title}
                </h3>
                <p className="text-xs text-gray-500">
                    ⭐ {movie.rating || 0}/10
                </p>
            </div>

            {/* Favorite Button */}
            <button
                onClick={handleFavorite}
                disabled={loading}
                className="absolute top-2 right-2 text-lg"
            >
                {isFav ? "❤️" : "🤍"}
            </button>
        </div>
    );
};

export default MovieCard;
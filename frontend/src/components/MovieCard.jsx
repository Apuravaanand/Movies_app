import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext.jsx";
import { toggleFavoriteMovie } from "../api/user.api.js";

const MovieCard = ({ movie }) => {
    const navigate = useNavigate();
    const { user, setUser } = useContext(AuthContext);
    const [isFav, setIsFav] = useState(false);

    useEffect(() => {
        if (!user?.favorites || !movie?._id) return;

        setIsFav(
            user.favorites.some(
                (id) => id.toString() === movie._id.toString()
            )
        );
    }, [user?.favorites, movie?._id]);

    // Toggle Favorite
    const handleFavorite = async () => {
        alert("fav btn");
        try {
            const res = await toggleFavoriteMovie(movie._id);

            const updatedFavorites = res.data.favorites;

            setIsFav(
                updatedFavorites.some(
                    (id) => id.toString() === movie._id.toString()
                )
            );

            // Update context + persist
            const updatedUser = {
                ...user,
                favorites: updatedFavorites,
            };

            setUser(updatedUser);
            localStorage.setItem("user", JSON.stringify(updatedUser));

        } catch (err) {
            console.error("Favorite error:", err);
        }
    };

    const poster = movie.posterUrl
        ? movie.posterUrl.startsWith("http")
            ? movie.posterUrl
            : `http://localhost:5000${movie.posterUrl}`
        : "/default-poster.jpg";

    return (
        <div
            onClick={() => navigate(`/movie/${movie._id}`)}
            className="w-48 bg-white rounded-lg shadow-md p-2 relative cursor-pointer hover:scale-105 transition"
        >
            <img
                src={poster}
                alt={movie.title}
                className="w-full h-64 object-cover rounded-lg"
            />

            <h3 className="mt-2 font-semibold truncate">{movie.title}</h3>
            <p className="text-sm text-gray-600">⭐ {movie.rating || 0}/10</p>

            {/* ❤️ Favorite */}
            <button
                onClick={(e) => {
                    e.stopPropagation();
                    handleFavorite();
                }}
                className="absolute top-2 right-2 text-xl"
            >
                {isFav ? "fav" : "unfav"}
            </button>
        </div>
    );
};

export default MovieCard;

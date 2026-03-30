import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import { getMovieById } from "../api/movie.api.js";
import { toggleFavoriteMovie } from "../api/user.api.js";
import { AuthContext } from "../context/AuthContext.jsx";

const MovieDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user, setUser } = useContext(AuthContext);

    const [movie, setMovie] = useState(null);
    const [isFav, setIsFav] = useState(false);
    const [loading, setLoading] = useState(true);

    // ✅ Fetch Movie (SAFE)
    useEffect(() => {
        const fetchMovie = async () => {
            try {
                const res = await getMovieById(id);

                // 🔥 safer handling (prevents undefined crash)
                const movieData = res?.data?.data || res?.data || null;

                setMovie(movieData);
            } catch (err) {
                console.error("Error fetching movie:", err);
            } finally {
                setLoading(false);
            }
        };

        if (id) fetchMovie();
    }, [id]);

    // ✅ Check Favorite (SAFE)
    useEffect(() => {
        if (user?.favorites && movie?._id) {
            setIsFav(
                user.favorites.some(
                    (favId) => favId.toString() === movie._id.toString()
                )
            );
        }
    }, [user, movie]);

    // ✅ Toggle Favorite (SAFE)
    const handleFav = async () => {
        if (!movie?._id) return;

        try {
            const res = await toggleFavoriteMovie(movie._id);

            const favs = res?.data?.favorites || [];

            setIsFav(
                favs.some(
                    (favId) => favId.toString() === movie._id.toString()
                )
            );

            setUser((prev) => ({
                ...prev,
                favorites: favs,
            }));
        } catch (err) {
            console.error("Error updating favorite:", err);
        }
    };

    // ✅ Poster Fix (SAFE)
    const poster = movie?.posterUrl
        ? movie.posterUrl.startsWith("http")
            ? movie.posterUrl
            : `http://localhost:5000${movie.posterUrl}`
        : "/default-poster.jpg";

    // ✅ UI STATES (IMPORTANT)
    if (loading) return <p className="p-6">Loading...</p>;
    if (!movie) return <p className="p-6 text-red-500">Movie not found</p>;

    return (
        <div className="min-h-screen bg-gray-100 p-4 md:ml-64 md:p-6">
            {/* 🔙 Back Button */}
            <button
                onClick={() => navigate(-1)}
                className="mb-6 px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg transition"
            >
                ← Back
            </button>

            <div className="flex flex-col md:flex-row gap-8 bg-white p-6 rounded-2xl shadow-lg">
                {/* 🎬 Poster */}
                <div className="flex justify-center md:justify-start">
                    <img
                        src={poster}
                        alt={movie?.title || "movie"}
                        className="w-64 h-96 object-cover rounded-xl shadow-md"
                        onError={(e) => (e.target.src = "/default-poster.jpg")}
                    />
                </div>

                {/* 📄 Info */}
                <div className="flex-1">
                    <h1 className="text-3xl font-bold text-gray-800">
                        {movie?.title || "No Title"}
                    </h1>

                    <p className="text-gray-500 mt-2">
                        ⭐ {movie?.rating || 0}/10
                    </p>

                    <p className="mt-4 text-gray-700">
                        {movie?.description || "No description available."}
                    </p>

                    {/* ❤️ Buttons */}
                    <div className="mt-6 flex gap-4">
                        <button
                            onClick={handleFav}
                            className={`px-4 py-2 rounded-lg ${isFav
                                    ? "bg-red-100 text-red-600"
                                    : "bg-gray-200 hover:bg-gray-300"
                                }`}
                        >
                            {isFav ? "❤️ Favorited" : "🤍 Add to Favorites"}
                        </button>

                        <button className="px-5 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
                            ▶ Watch
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MovieDetails;
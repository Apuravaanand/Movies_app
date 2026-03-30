import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getMovieById } from "../api/movie.api.js";
import { getImageUrl } from "../api/index.js"; // ✅ use centralized helper

const MovieDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [movie, setMovie] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchMovie = async () => {
            try {
                // ✅ FIX: already returns res.data
                const data = await getMovieById(id);

                if (!data?.data) throw new Error("Movie not found");

                setMovie(data.data);
            } catch (err) {
                console.error(err);
                setError("Failed to load movie");
            } finally {
                setLoading(false);
            }
        };

        if (id) fetchMovie();
    }, [id]);

    // ✅ FIX: centralized image handling
    const imageUrl = getImageUrl(movie?.posterUrl);

    // ✅ Loading UI
    if (loading) {
        return (
            <div className="ml-64 p-6">
                <h2 className="text-xl font-semibold">Loading...</h2>
            </div>
        );
    }

    // ✅ Error UI
    if (error) {
        return (
            <div className="ml-64 p-6">
                <h2 className="text-xl text-red-500">{error}</h2>
                <button
                    onClick={() => navigate(-1)}
                    className="mt-4 bg-gray-700 text-white px-4 py-2 rounded"
                >
                    Go Back
                </button>
            </div>
        );
    }

    return (
        <div className="ml-64 p-6">
            {/* Back Button */}
            <button
                onClick={() => navigate(-1)}
                className="mb-4 bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-700"
            >
                ← Back
            </button>

            <div className="flex flex-col lg:flex-row gap-6">
                {/* Poster */}
                <img
                    src={imageUrl}
                    alt={movie?.title || "Movie"}
                    className="w-full max-w-xs h-auto object-cover rounded-lg shadow-lg"
                    onError={(e) => {
                        e.target.src = "/default-poster.jpg";
                    }}
                />

                {/* Details */}
                <div className="flex-1 space-y-3">
                    <h1 className="text-3xl font-bold">
                        {movie?.title || "Untitled"}
                    </h1>

                    <p className="text-gray-600">
                        ⭐ {movie?.rating ?? 0}/10
                    </p>

                    <p>
                        <span className="font-semibold">Director:</span>{" "}
                        {movie?.director || "N/A"}
                    </p>

                    <p>
                        <span className="font-semibold">Genre:</span>{" "}
                        {(movie?.genre || []).join(", ") || "N/A"}
                    </p>

                    <p>
                        <span className="font-semibold">
                            Release Year:
                        </span>{" "}
                        {movie?.releaseYear || "N/A"}
                    </p>

                    <p className="mt-4 text-gray-700 leading-relaxed">
                        {movie?.description ||
                            "No description available."}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default MovieDetails;
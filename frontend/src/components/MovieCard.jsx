import { useNavigate } from "react-router-dom";
import { getImageUrl } from "../api/index.js"; // ✅ use helper

const MovieCard = ({ movie }) => {
    const navigate = useNavigate();

    const handleClick = () => {
        if (!movie?._id) {
            console.error("Movie ID missing:", movie);
            return;
        }
        navigate(`/movie/${movie._id}`);
    };

    return (
        <div
            onClick={handleClick} // ✅ safer click
            className="cursor-pointer bg-white rounded-xl shadow-lg hover:shadow-xl transition duration-300 p-2 w-48"
        >
            <img
                src={getImageUrl(movie?.posterUrl)} // ✅ FIXED
                alt={movie?.title || "Movie"}
                className="w-full h-64 object-cover rounded-lg"
                onError={(e) => {
                    e.target.src = "/default-poster.jpg";
                }}
            />

            <h3 className="mt-2 font-semibold truncate">
                {movie?.title || "Untitled"}
            </h3>

            <p className="text-sm text-gray-600">
                ⭐ {movie?.rating ?? 0}/10
            </p>
        </div>
    );
};

export default MovieCard;
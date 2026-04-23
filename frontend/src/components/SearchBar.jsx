import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { getMovieSuggestions } from "../api/movie.api.js";

const SearchBar = () => {
    const [query, setQuery] = useState("");
    const [suggestions, setSuggestions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);

    const wrapperRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
                setShowDropdown(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    useEffect(() => {
        const trimmed = query.trim();

        if (!trimmed) {
            setSuggestions([]);
            setShowDropdown(false);
            return;
        }

        const delay = setTimeout(async () => {
            try {
                setLoading(true);

                const data = await getMovieSuggestions(trimmed);

                setSuggestions(Array.isArray(data) ? data : []);
                setShowDropdown(true);
            } catch (err) {
                console.error("Suggestion error:", err);
                setSuggestions([]);
            } finally {
                setLoading(false);
            }
        }, 300);

        return () => clearTimeout(delay);
    }, [query]);

    const handleChange = (e) => {
        setQuery(e.target.value);
    };

    // 🔥 IMPORTANT FIX HERE
    const handleSelect = (movie) => {
        setQuery(movie.title);
        setSuggestions([]);
        setShowDropdown(false);

        // navigate to details page
        navigate(`/movie/${movie._id}`);
    };

    const handleClear = () => {
        setQuery("");
        setSuggestions([]);
        setShowDropdown(false);
    };

    return (
        <div ref={wrapperRef} className="relative w-full max-w-md mx-auto my-4">

            <div className="flex items-center gap-2">
                <input
                    type="text"
                    value={query}
                    onChange={handleChange}
                    placeholder="Search movies..."
                    className="flex-1 border p-2 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                />

                {query && (
                    <button
                        onClick={handleClear}
                        className="px-3 py-2 bg-gray-300 rounded hover:bg-gray-400"
                    >
                        ✕
                    </button>
                )}
            </div>

            {showDropdown && (
                <div className="absolute w-full bg-white border mt-1 rounded shadow max-h-60 overflow-y-auto z-50">

                    {loading && (
                        <div className="p-2 text-sm text-gray-500">
                            Loading...
                        </div>
                    )}

                    {!loading && suggestions.length === 0 && (
                        <div className="p-2 text-sm text-gray-500">
                            No results found
                        </div>
                    )}

                    {suggestions.map((movie) => (
                        <div
                            key={movie._id}
                            onClick={() => handleSelect(movie)}
                            className="flex items-center gap-2 p-2 hover:bg-gray-100 cursor-pointer"
                        >
                            <img
                                src={
                                    movie.posterUrl
                                        ? `${import.meta.env.VITE_API_URL || "http://localhost:5000"}${movie.posterUrl}`
                                        : "/default-poster.jpg"
                                }
                                className="w-8 h-10 object-cover rounded"
                                alt={movie.title}
                            />
                            <span className="text-sm">{movie.title}</span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default SearchBar;
import { useState, useEffect } from "react";

const SearchBar = ({ onSearch }) => {
    const [query, setQuery] = useState("");

    // 🔥 Real-time search (no need to press button)
    useEffect(() => {
        const delayDebounce = setTimeout(() => {
            onSearch(query.trim());
        }, 300); // debounce

        return () => clearTimeout(delayDebounce);
    }, [query, onSearch]);

    const handleChange = (e) => {
        setQuery(e.target.value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSearch(query.trim());
    };

    const handleClear = () => {
        setQuery("");
        onSearch("");
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="flex items-center gap-2 w-full max-w-md mx-auto my-4"
        >
            <input
                type="text"
                placeholder="Search movies..."
                value={query}
                onChange={handleChange}
                className="flex-1 border p-2 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
            />

            {/* Clear Button */}
            {query && (
                <button
                    type="button"
                    onClick={handleClear}
                    className="bg-gray-300 px-3 py-2 rounded hover:bg-gray-400"
                >
                    ✕
                </button>
            )}

            <button
                type="submit"
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
            >
                Search
            </button>
        </form>
    );
};

export default SearchBar;
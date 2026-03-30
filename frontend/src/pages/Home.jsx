import { useState, useEffect } from "react";
import { getAllMovies } from "../api/movie.api.js";
import MovieRow from "../components/MovieRow.jsx";
import SearchBar from "../components/SearchBar.jsx";

const Home = () => {
    const [movies, setMovies] = useState([]);
    const [filteredMovies, setFilteredMovies] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMovies = async () => {
            try {
                const res = await getAllMovies();
                console.log("Movies fetched:", res.data); // 🔥 Check this in console
                const data = res.data.data || [];
                setMovies(data);
                setFilteredMovies(data);
            } catch (err) {
                console.error("Fetch movies error:", err);
            } finally {
                setLoading(false);
            }

        };

        fetchMovies();
    }, []);

    const handleSearch = (query) => {
        if (!query) return setFilteredMovies(movies);

        const q = query.toLowerCase();

        const filtered = movies.filter(
            (m) =>
                m.title?.toLowerCase().includes(q) ||
                (m.genre || []).some((g) =>
                    g.toLowerCase().includes(q)
                ) ||
                m.director?.toLowerCase().includes(q)
        );

        setFilteredMovies(filtered);
    };

    // ✅ GROUP BY GENRE (safe version)
    const groupedMovies = filteredMovies.reduce((acc, movie) => {
        if (!movie.genre || movie.genre.length === 0) {
            if (!acc["Others"]) acc["Others"] = [];
            acc["Others"].push(movie);
        } else {
            movie.genre.forEach((g) => {
                if (!acc[g]) acc[g] = [];
                acc[g].push(movie);
            });
        }
        return acc;
    }, {});

    // ✅ LOADING UI
    if (loading) {
        return (
            <div className="ml-64 p-6">
                <h1 className="text-xl font-bold">Loading movies...</h1>
            </div>
        );
    }

    return (
        <div className="ml-64 p-6 space-y-6">
            <h1 className="text-2xl font-bold">All Movies</h1>

            <SearchBar onSearch={handleSearch} />

            {/* ✅ Dynamic Genre Rows */}
            {Object.keys(groupedMovies).length === 0 ? (
                <p>No movies found</p>
            ) : (
                Object.entries(groupedMovies).map(([genre, movies]) => (
                    <MovieRow
                        key={genre}
                        title={genre}
                        movies={movies}
                    />
                ))
            )}
        </div>
    );
};

export default Home;
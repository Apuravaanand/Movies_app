import { useEffect, useState, useContext, useMemo } from "react";
import { getAllMovies } from "../api/movie.api.js";
import MovieRow from "../components/MovieRow.jsx";
import { AuthContext } from "../context/AuthContext.jsx";
import Navbar from "../components/Navbar.jsx";

const UserDashboard = () => {
    const { user } = useContext(AuthContext);

    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(true);

    // ✅ Filter states
    const [search, setSearch] = useState("");
    const [selectedGenre, setSelectedGenre] = useState("All");

    useEffect(() => {
        const fetchMovies = async () => {
            try {
                const res = await getAllMovies();
                setMovies(res?.data?.data || []);
            } catch (err) {
                console.error("Error fetching movies:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchMovies();
    }, []);

    // ✅ Extract unique genres dynamically
    const genres = useMemo(() => {
        const allGenres = movies.flatMap(movie => movie.genre || []);
        return ["All", ...new Set(allGenres)];
    }, [movies]);

    // ✅ Filtered movies
    const filteredMovies = useMemo(() => {
        return movies.filter(movie => {
            const matchesSearch =
                movie.title.toLowerCase().includes(search.toLowerCase());

            const matchesGenre =
                selectedGenre === "All" ||
                (movie.genre && movie.genre.includes(selectedGenre));

            return matchesSearch && matchesGenre;
        });
    }, [movies, search, selectedGenre]);

    if (!user) return null;

    // ================= LOADING =================
    // if (loading) {
    //     return (
    //         <div className="p-6 space-y-6">
    //             <div className="h-8 w-1/3 bg-gray-300 rounded animate-pulse shadow-md"></div>

    //             <div className="flex gap-6 overflow-x-auto">
    //                 {Array.from({ length: 6 }).map((_, idx) => (
    //                     <div
    //                         key={idx}
    //                         className="w-48 bg-white rounded-xl shadow-lg p-2"
    //                     >
    //                         <div className="w-full h-64 bg-gray-300 rounded-lg animate-pulse shadow-inner"></div>
    //                         <div className="h-4 bg-gray-300 rounded mt-3 animate-pulse shadow-inner"></div>
    //                         <div className="h-3 bg-gray-300 rounded mt-2 w-2/3 animate-pulse shadow-inner"></div>
    //                     </div>
    //                 ))}
    //             </div>
    //         </div>
    //     );
    // }

    // ================= MAIN UI =================
    return (<>
        <Navbar />
        <div className="ml-64 p-6 space-y-6">
            <h1 className="text-2xl font-bold text-green-700">
                Welcome, {user?.name}
            </h1>

            {/* ✅ FILTER SECTION */}
            <div className="flex flex-col md:flex-row gap-4 bg-white p-4 rounded-xl shadow-md">
                <input
                    type="text"
                    placeholder="Search by title..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="flex-1 border p-2 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                />

                <select
                    value={selectedGenre}
                    onChange={(e) => setSelectedGenre(e.target.value)}
                    className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                    {genres.map((genre, index) => (
                        <option key={index} value={genre}>
                            {genre}
                        </option>
                    ))}
                </select>
            </div>

            {/* ✅ MOVIE LIST */}
            {filteredMovies.length > 0 ? (
                <MovieRow title="Movies" movies={filteredMovies} />
            ) : (
                <p className="text-gray-500">No movies match your filter.</p>
            )}
        </div>
    </>
    );
};

export default UserDashboard;
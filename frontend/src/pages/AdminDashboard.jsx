import { useEffect, useState, useContext } from "react";
import {
    getAllMovies,
    createMovie,
    updateMovie,
    deleteMovie,
} from "../api/movie.api.js";
import { AuthContext } from "../context/AuthContext.jsx";
import Navbar from "../components/Navbar.jsx";

const AdminDashboard = () => {
    const { user } = useContext(AuthContext);

    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [creating, setCreating] = useState(false);
    const [editingMovie, setEditingMovie] = useState(null);

    const [form, setForm] = useState({
        title: "",
        description: "",
        genre: "",
        director: "",
        cast: "",
        releaseDate: "",
        rating: 0,
        duration: 0,
        poster: null,
    });

    // ================= FETCH MOVIES =================
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

    // ================= HANDLE INPUT =================
    const handleChange = (e) => {
        const { name, value, files } = e.target;
        if (files) setForm((prev) => ({ ...prev, [name]: files[0] }));
        else setForm((prev) => ({ ...prev, [name]: value }));
    };

    // ================= SUBMIT (CREATE + UPDATE) =================
    const handleSubmit = async (e) => {
        e.preventDefault();
        setCreating(true);

        try {
            const payload = new FormData();

            payload.append("title", form.title);
            payload.append("description", form.description);
            payload.append("director", form.director);
            payload.append("releaseDate", form.releaseDate);
            payload.append("rating", form.rating);
            payload.append("duration", form.duration);
            payload.append(
                "genre",
                JSON.stringify(
                    form.genre
                        .split(",")
                        .map((g) => g.trim())
                        .filter(Boolean)
                )
            );
            payload.append(
                "cast",
                JSON.stringify(
                    form.cast
                        .split(",")
                        .map((c) => c.trim())
                        .filter(Boolean)
                )
            );

            if (form.poster) payload.append("poster", form.poster);

            let res;
            if (editingMovie) {
                // ✅ UPDATE
                res = await updateMovie(editingMovie._id, payload);
                const updatedMovie = res.data?.data || res.data;

                setMovies((prev) =>
                    prev.map((m) => (m._id === editingMovie._id ? updatedMovie : m))
                );
                alert("Movie updated ✅");
            } else {
                // ✅ CREATE
                res = await createMovie(payload);
                const newMovie = res.data?.data || res.data;

                setMovies((prev) => [newMovie, ...prev]);
                alert("Movie created ✅");
            }

            // RESET FORM
            setEditingMovie(null);
            setForm({
                title: "",
                description: "",
                genre: "",
                director: "",
                cast: "",
                releaseDate: "",
                rating: 0,
                duration: 0,
                poster: null,
            });
        } catch (err) {
            console.error(err);
            alert(err.response?.data?.message || "Operation failed");
        } finally {
            setCreating(false);
        }
    };

    // ================= DELETE =================
    const handleDelete = async (id) => {
        if (!window.confirm("Delete this movie?")) return;

        try {
            const res = await deleteMovie(id);
            if (res.data?.success || res.success) {
                setMovies((prev) => prev.filter((m) => m._id !== id));
                alert("Movie deleted ✅");
            }
        } catch (err) {
            console.error(err);
            alert("Delete failed");
        }
    };

    // ================= EDIT =================
    const handleEdit = (movie) => {
        setEditingMovie(movie);
        setForm({
            title: movie.title || "",
            description: movie.description || "",
            genre: movie.genre?.join(", ") || "",
            director: movie.director || "",
            cast: movie.cast?.join(", ") || "",
            releaseDate: movie.releaseDate?.split("T")[0] || "",
            rating: movie.rating || 0,
            duration: movie.duration || 0,
            poster: null,
        });
    };

    if (!user) return null;

    // ================= LOADING =================
    if (loading)
        return (
            <div className="ml-64 p-6 text-gray-600 font-semibold">
                Loading movies...
            </div>
        );

    // ================= UI =================
    return (
        <>
            <Navbar />
            <div className="ml-64 p-6 space-y-8 bg-gray-50 min-h-screen">
                <h1 className="text-3xl font-bold text-green-700">Admin Dashboard</h1>

                {/* FORM */}
                <form
                    onSubmit={handleSubmit}
                    className="bg-white p-6 rounded-xl shadow-md max-w-lg space-y-4"
                >
                    <h2 className="text-xl font-semibold text-green-600">
                        {editingMovie ? "Update Movie" : "Create New Movie"}
                    </h2>

                    <input
                        name="title"
                        placeholder="Title"
                        value={form.title}
                        onChange={handleChange}
                        className="w-full border p-2 rounded"
                        required
                    />

                    <textarea
                        name="description"
                        placeholder="Description"
                        value={form.description}
                        onChange={handleChange}
                        className="w-full border p-2 rounded"
                    />

                    <input
                        name="genre"
                        placeholder="Genre (comma separated)"
                        value={form.genre}
                        onChange={handleChange}
                        className="w-full border p-2 rounded"
                        required
                    />

                    <input
                        name="director"
                        placeholder="Director"
                        value={form.director}
                        onChange={handleChange}
                        className="w-full border p-2 rounded"
                    />

                    <input
                        name="cast"
                        placeholder="Cast (comma separated)"
                        value={form.cast}
                        onChange={handleChange}
                        className="w-full border p-2 rounded"
                    />

                    <input
                        type="date"
                        name="releaseDate"
                        value={form.releaseDate}
                        onChange={handleChange}
                        className="w-full border p-2 rounded"
                        required
                    />

                    <input
                        type="number"
                        name="rating"
                        value={form.rating}
                        onChange={handleChange}
                        className="w-full border p-2 rounded"
                        min="0"
                        max="10"
                    />

                    <input
                        type="number"
                        name="duration"
                        value={form.duration}
                        onChange={handleChange}
                        className="w-full border p-2 rounded"
                    />

                    <input
                        type="file"
                        name="poster"
                        onChange={handleChange}
                        className="w-full"
                    />

                    <button
                        type="submit"
                        disabled={creating}
                        className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                        {creating
                            ? "Processing..."
                            : editingMovie
                                ? "Update Movie"
                                : "Create Movie"}
                    </button>
                </form>

                {/* MOVIES */}
                <div>
                    <h2 className="text-xl font-semibold mb-4">
                        All Movies ({movies.length})
                    </h2>

                    <div className="flex flex-wrap gap-4">
                        {movies.map((movie) => (
                            <div
                                key={movie._id}
                                className="relative w-48 bg-white rounded-lg shadow-md p-2"
                            >
                                {/* DELETE */}
                                <button
                                    onClick={() => handleDelete(movie._id)}
                                    className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded"
                                >
                                    ✕
                                </button>

                                {/* EDIT */}
                                <button
                                    onClick={() => handleEdit(movie)}
                                    className="absolute top-2 left-2 bg-blue-500 text-white text-xs px-2 py-1 rounded"
                                >
                                    ✎
                                </button>

                                <img
                                    src={
                                        movie.posterUrl
                                            ? movie.posterUrl.startsWith("http")
                                                ? movie.posterUrl
                                                : `http://localhost:5000${movie.posterUrl}`
                                            : "/default-poster.jpg"
                                    }
                                    alt={movie.title}
                                    className="w-full h-64 object-cover rounded-lg"
                                    onError={(e) => (e.target.src = "/default-poster.jpg")}
                                />

                                <h3 className="mt-2 font-semibold truncate">{movie.title}</h3>
                                <p className="text-sm text-gray-600">
                                    ⭐ {movie.rating || 0}/10
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
};

export default AdminDashboard;
import { useEffect, useState, useContext } from "react";
import {
    getAllMovies,
    createMovie,
    updateMovie,
    deleteMovie,
} from "../api/movie.api.js";
import { AuthContext } from "../context/AuthContext.jsx";
import MovieCard from "../components/MovieCard.jsx";
import Navbar from "../components/Navbar.jsx";

const AdminDashboard = () => {
    const { user } = useContext(AuthContext);

    const [open, setOpen] = useState(true);

    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState(false);
    const [editingMovie, setEditingMovie] = useState(null);
    const [message, setMessage] = useState("");

    const [form, setForm] = useState({
        title: "",
        description: "",
        genre: "",
        director: "",
        cast: "",
        releaseDate: "",
        rating: 0,
        duration: 90,
        poster: null,
    });

    // FETCH
    useEffect(() => {
        const fetchMovies = async () => {
            try {
                const res = await getAllMovies();
                const data = res?.data?.data || res?.data || [];
                setMovies(Array.isArray(data) ? data : []);
            } catch {
                setMessage("Failed to fetch movies");
            } finally {
                setLoading(false);
            }
        };
        fetchMovies();
    }, []);

    // INPUT
    const handleChange = (e) => {
        const { name, value, files } = e.target;
        if (name === "poster") {
            setForm((prev) => ({ ...prev, poster: files[0] }));
        } else {
            setForm((prev) => ({ ...prev, [name]: value }));
        }
    };

    const parseArray = (str) =>
        str.split(",").map((s) => s.trim()).filter(Boolean);

    const resetForm = () => {
        setForm({
            title: "",
            description: "",
            genre: "",
            director: "",
            cast: "",
            releaseDate: "",
            rating: 0,
            duration: 90,
            poster: null,
        });
        setEditingMovie(null);
    };

    // SUBMIT
    const handleSubmit = async (e) => {
        e.preventDefault();
        setProcessing(true);
        setMessage("");

        try {
            const genres = parseArray(form.genre);
            const castArr = parseArray(form.cast);

            if (!form.title || genres.length === 0 || !form.releaseDate) {
                setMessage("Required fields missing");
                return;
            }

            const payload = new FormData();
            payload.append("title", form.title);
            payload.append("description", form.description);
            payload.append("director", form.director);
            payload.append("releaseDate", form.releaseDate);
            payload.append("rating", Number(form.rating));
            payload.append("duration", Number(form.duration));
            payload.append("genre", JSON.stringify(genres));
            payload.append("cast", JSON.stringify(castArr));

            if (form.poster) payload.append("poster", form.poster);

            let res;

            if (editingMovie) {
                res = await updateMovie(editingMovie._id, payload);
                const updated = res?.data?.data || res?.data;

                setMovies((prev) =>
                    prev.map((m) => (m._id === editingMovie._id ? updated : m))
                );

                setMessage("Movie updated");
            } else {
                res = await createMovie(payload);
                const created = res?.data?.data || res?.data;

                setMovies((prev) => [created, ...prev]);
                setMessage("Movie created");
            }

            resetForm();
        } catch (err) {
            setMessage(err?.response?.data?.message || "Operation failed");
        } finally {
            setProcessing(false);
        }
    };

    // DELETE
    const handleDelete = async (id) => {
        if (!window.confirm("Delete this movie?")) return;

        try {
            const res = await deleteMovie(id);
            if (res?.success || res?.data?.success) {
                setMovies((prev) => prev.filter((m) => m._id !== id));
                setMessage("Movie deleted");
            }
        } catch {
            setMessage("Delete failed");
        }
    };

    // EDIT
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
            duration: movie.duration || 90,
            poster: null,
        });
        setMessage("");
    };

    if (!user) return <p className="p-6">Unauthorized</p>;

    return (<>
        <Navbar open={open} setOpen={setOpen} />

        <div
            className={`transition-all duration-300 p-6 min-h-screen ${open ? "ml-64" : "ml-10"
                }`}
        >

            <h1 className="text-3xl font-bold text-green-700 mb-6">
                Admin Dashboard
            </h1>

            {message && (
                <p className="mb-4 text-sm text-center text-white bg-gray-800 py-2 rounded">
                    {message}
                </p>
            )}

            {/* FORM */}
            <form
                key={editingMovie?._id || "new"}
                onSubmit={handleSubmit}
                className="bg-white p-6 rounded-xl shadow-md max-w-xl space-y-4"
            >
                <h2 className="text-xl font-semibold text-green-600">
                    {editingMovie ? "Update Movie" : "Create Movie"}
                </h2>

                <input className="input" name="title" placeholder="Title" value={form.title} onChange={handleChange} required />
                <textarea className="input" name="description" placeholder="Description" value={form.description} onChange={handleChange} />
                <input className="input" name="genre" placeholder="Genre (comma separated)" value={form.genre} onChange={handleChange} required />
                <input className="input" name="director" placeholder="Director" value={form.director} onChange={handleChange} />
                <input className="input" name="cast" placeholder="Cast" value={form.cast} onChange={handleChange} />
                <input className="input" type="date" name="releaseDate" value={form.releaseDate} onChange={handleChange} required />

                <div className="flex gap-2">
                    <input className="input w-1/2" type="number" name="rating" value={form.rating} onChange={handleChange} />
                    <input className="input w-1/2" type="number" name="duration" value={form.duration} onChange={handleChange} />
                </div>

                <input type="file" name="poster" onChange={handleChange} />

                <button
                    type="submit"
                    disabled={processing}
                    className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
                >
                    {processing ? "Processing..." : editingMovie ? "Update" : "Create"}
                </button>
            </form>

            {/* MOVIES */}
            <div className="flex items-center justify-center flex-wrap gap-5 mt-8 mx-auto">
                {loading ? (
                    <p className="col-span-full text-center text-gray-500">
                        Loading...
                    </p>
                ) : movies.length === 0 ? (
                    <p className="col-span-full text-center text-gray-500">
                        No movies found
                    </p>
                ) : (
                    movies.map((movie) => (
                        <div key={movie?._id} className="relative">
                            {/* Admin buttons */}
                            <div className="absolute top-2 left-2 flex gap-2 z-10">
                                <button
                                    onClick={() => handleEdit(movie)}
                                    className="bg-blue-500 text-white text-xs px-2 py-1 rounded"
                                >
                                    Edit
                                </button>

                                <button
                                    onClick={() => handleDelete(movie._id)}
                                    className="bg-red-500 text-white text-xs px-2 py-1 rounded"
                                >
                                    Delete
                                </button>
                            </div>

                            {/* Original card (unchanged) */}
                            <MovieCard movie={movie} />
                        </div>
                    ))
                )}
            </div>
        </div>
    </>
    );
};

export default AdminDashboard;
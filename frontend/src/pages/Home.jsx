// src/pages/Home.jsx
import { useEffect, useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getAllMovies } from "../api/movie.api.js";
import MovieRow from "../components/MovieRow.jsx";
import SearchBar from "../components/SearchBar.jsx";
import Loader from "../components/Loader.jsx";
import { AuthContext } from "../context/AuthContext.jsx";
import HeroSlider from "../components/HeroSlider.jsx";
import Navbar from "../components/Navbar.jsx";

const Home = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  // 🔥 Sidebar state
  const [open, setOpen] = useState(true);

  // 🔥 Movie states
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const dashboardRoute =
    user?.role === "admin" ? "/admin-dashboard" : "/dashboard";

  // 🔥 Group movies
  const groupByGenre = (movies) => {
    return movies.reduce((acc, movie) => {
      const genres = Array.isArray(movie.genre)
        ? movie.genre
        : ["Others"];

      genres.forEach((genre) => {
        if (!acc[genre]) acc[genre] = [];
        acc[genre].push(movie);
      });

      return acc;
    }, {});
  };

  // 🔥 Fetch movies
  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const res = await getAllMovies();
        setMovies(res.data?.data || res.data || []);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch movies");
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);

  const groupedMovies = groupByGenre(movies);

  return (
    <>
      <Navbar open={open} setOpen={setOpen} />

      <div
        className={`transition-all duration-300 p-6 min-h-screen ${open ? "ml-64" : "ml-10"
          }`}
      >
        <SearchBar />

        <h1 className="text-2xl font-bold text-green-700 mb-6">
          All Movies
        </h1>

        {/* HERO */}
        <div className="p-2">
          <HeroSlider />
        </div>

        {/* LOADING */}
        {loading && (
          <div className="space-y-4 mt-6">
            <Loader />
            <Loader />
            <Loader />
          </div>
        )}

        {/* ERROR */}
        {error && (
          <p className="text-red-500 mt-6">{error}</p>
        )}

        {/* DATA */}
        {!loading && movies.length === 0 && (
          <p className="text-gray-500 mt-6">No movies found.</p>
        )}

        {!loading && movies.length > 0 && (
          <div className="space-y-10 mt-6">
            {Object.entries(groupedMovies).map(([genre, movies]) => (
              <MovieRow key={genre} title={genre} movies={movies} />
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default Home;
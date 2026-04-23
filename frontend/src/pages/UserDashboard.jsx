// src/pages/UserDashboard.jsx
import { useEffect, useState, useContext } from "react";
import { getMovieById } from "../api/movie.api.js";
import { AuthContext } from "../context/AuthContext.jsx";
import Navbar from "../components/Navbar.jsx";
import MovieCard from "../components/MovieCard.jsx";
import { Navigate } from "react-router-dom";
import Loader from "../components/Loader.jsx";

const UserDashboard = () => {
  const { user } = useContext(AuthContext);


  const [open, setOpen] = useState(true);

  const [favoriteMovies, setFavoriteMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    if (!user.favorites || user.favorites.length === 0) {
      setFavoriteMovies([]);
      setLoading(false);
      return;
    }

    const fetchFavorites = async () => {
      try {
        const promises = user.favorites.map((id) =>
          getMovieById(id).catch((err) => null)
        );

        const results = await Promise.all(promises);

        const validMovies = results
          .filter((res) => res !== null)
          .map((res) => res.data);

        setFavoriteMovies(validMovies);
      } catch (err) {
        console.error(err);
        setError("Failed to load favorite movies.");
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, [user]);

  if (!user) return <Navigate to="/login" replace />;

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="ml-64 p-6">
          <h1 className="text-green-700 font-bold animate-pulse">
            <Loader />
            <Loader />
          </h1>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar open={open} setOpen={setOpen} />

      {/* MAIN WRAPPER (ANIMATED SHIFT) */}
      <div
        className={`transition-all duration-300 min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6
                ${open ? "ml-64" : "ml-0"}`}
      >
        <h1 className="text-2xl font-bold text-green-700">Welcome, {user.name}</h1>

        <h2 className="text-xl font-semibold mt-4">Your Favorites</h2>

        {error && <p className="text-red-500">{error}</p>}

        {error ? (
          <p className="text-red-500">{error}</p>
        ) : favoriteMovies.length === 0 ? (
          <p className="text-gray-500">No favorite movies yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {favoriteMovies.map((movie) => (
              <MovieCard key={movie._id} movie={movie} />
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default UserDashboard;
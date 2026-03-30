import { useEffect, useState, useContext } from "react";
import { getMovieById } from "../api/movie.api.js";
import { AuthContext } from "../context/AuthContext.jsx";
import Navbar from "../components/Navbar.jsx";
import MovieCard from "../components/MovieCard.jsx";
import { Navigate } from "react-router-dom";

const UserDashboard = () => {
  const { user } = useContext(AuthContext);
  const [favoriteMovies, setFavoriteMovies] = useState([]);
  const [loadingFav, setLoadingFav] = useState(true);

  useEffect(() => {
    if (!user?.favorites?.length) {
      setFavoriteMovies([]);
      setLoadingFav(false);
      return;
    }

    const fetchFavorites = async () => {
      try {
        const promises = user.favorites.map((id) => getMovieById(id));
        const results = await Promise.all(promises);
        setFavoriteMovies(results.map((res) => res.data));
      } catch (err) {
        console.error("Error fetching favorite movies:", err);
      } finally {
        setLoadingFav(false);
      }
    };

    fetchFavorites();
  }, [user]);

  if (!user) return <Navigate to="/login" replace />;
  if (loadingFav) return <h1 className="ml-64 p-6 text-green-700 font-bold">Loading favorites...</h1>;

  return (
    <>
      <Navbar />
      <div className="ml-64 p-6 space-y-6">
        <h1 className="text-2xl font-bold text-green-700">Welcome, {user?.name}</h1>

        <h2 className="text-xl font-semibold mt-4">Your Favorites</h2>
        {favoriteMovies.length === 0 ? (
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
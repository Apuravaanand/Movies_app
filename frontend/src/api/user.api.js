import api from "./index.js";

// Toggle Favorite
export const toggleFavoriteMovie = (movieId) =>
    api.patch(`/user/favorites/${movieId}`);

// Get Favorites
export const getFavoriteMovies = () =>
    api.get("/user/favorites");
// Capitalize first letter of a string
export const capitalize = (str) => {
    if (!str) return "";
    return str.charAt(0).toUpperCase() + str.slice(1);
};

// Sort movies by rating or releaseDate
export const sortMovies = (movies, type = "rating") => {
    if (!movies || !Array.isArray(movies)) return [];
    return [...movies].sort((a, b) =>
        type === "rating" ? b.rating - a.rating : new Date(b.releaseDate) - new Date(a.releaseDate)
    );
};

// Filter movies by genre
export const filterByGenre = (movies, genre) => {
    if (!genre) return movies;
    return movies.filter((movie) =>
        movie.genre.some((g) => g.toLowerCase() === genre.toLowerCase())
    );
};

// Truncate text to specified length
export const truncateText = (text, length = 100) => {
    if (!text) return "";
    return text.length > length ? text.slice(0, length) + "..." : text;
};
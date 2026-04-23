import api from "./index.js";

// get movie suggestions
export const getMovieSuggestions = async (query) => {
    if (!query) return [];

    const res = await api.get(`/movies/suggestions?q=${query}`);
    return res.data.data;
};

// get all movies
export const getAllMovies = async () => {
    const res = await api.get("/movies");
    return res.data;
};

// get movie by id
export const getMovieById = async (id) => {
    if (!id) throw new Error("Movie ID is required");
    const res = await api.get(`/movies/${id}`);
    return res.data;
};

// only admin can create
export const createMovie = async (formData) => {
    const res = await api.post("/movies", formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
    return res.data;
};

export const updateMovie = async (id, formData) => {
    if (!id) throw new Error("Movie ID is required");

    const res = await api.put(`/movies/${id}`, formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });

    return res.data;
};

export const deleteMovie = async (id) => {
    if (!id) throw new Error("Movie ID is required");

    const res = await api.delete(`/movies/${id}`);
    return res.data;
};
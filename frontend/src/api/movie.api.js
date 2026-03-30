import api from "./index.js";

// ✅ GET ALL MOVIES
export const getAllMovies = async () => {
    const res = await api.get("/movies");
    return res.data; // return clean data
};

// ✅ GET SINGLE MOVIE
export const getMovieById = async (id) => {
    if (!id) throw new Error("Movie ID is required");
    const res = await api.get(`/movies/${id}`);
    return res.data;
};

// ✅ CREATE MOVIE (admin)
export const createMovie = async (formData) => {
    const res = await api.post("/movies", formData, {
        headers: {
            "Content-Type": "multipart/form-data", // important for image upload
        },
    });
    return res.data;
};

// ✅ UPDATE MOVIE (admin)
export const updateMovie = async (id, formData) => {
    if (!id) throw new Error("Movie ID is required");

    const res = await api.put(`/movies/${id}`, formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });

    return res.data;
};

// ✅ DELETE MOVIE (admin)
export const deleteMovie = async (id) => {
    if (!id) throw new Error("Movie ID is required");

    const res = await api.delete(`/movies/${id}`);
    return res.data;
};
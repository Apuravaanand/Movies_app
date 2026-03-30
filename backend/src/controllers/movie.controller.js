import MovieCard from "../models/Movie.js";
import mongoose from "mongoose";

//    CREATE MOVIE (ADMIN ONLY)
export const createMovieCard = async (req, res) => {
    try {
        if (req.user?.role !== "admin") {
            return res.status(403).json({
                success: false,
                message: "Unauthorized",
            });
        }

        const {
            title,
            description,
            genre,
            director,
            cast,
            releaseDate,
            rating,
            duration,
        } = req.body;

        if (!title || !description) {
            return res.status(400).json({
                success: false,
                message: "Title and description are required",
            });
        }

        const posterUrl = req.file ? `/uploads/${req.file.filename}` : "";

        const movie = await MovieCard.create({
            title,
            description,
            genre: Array.isArray(genre) ? genre : [genre],
            director,
            cast: Array.isArray(cast) ? cast : cast ? [cast] : [],
            releaseDate,
            rating,
            duration,
            posterUrl,
            createdBy: req.user.id,
        });

        res.status(201).json({ success: true, data: movie });

    } catch (err) {
        console.error("Create Movie error:", err);
        res.status(500).json({ success: false, message: "Failed to create movie" });
    }
};



//    GET ALL MOVIES (FILTER SUPPORT)
export const getAllMovieCards = async (req, res) => {
    try {
        const { genre, search, minRating } = req.query;

        let filter = { isActive: true };

        if (genre) {
            filter.genre = genre;
        }

        if (minRating) {
            filter.rating = { $gte: Number(minRating) };
        }

        if (search) {
            filter.title = { $regex: search, $options: "i" };
        }

        const movies = await MovieCard
            .find(filter)
            .sort({ createdAt: -1 });

        res.status(200).json({ success: true, data: movies });

    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Failed to fetch movies" });
    }
};

//    GET MOVIE BY ID
export const getMovieCardById = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid movie ID",
            });
        }

        const movie = await MovieCard.findOne({ _id: id, isActive: true });

        if (!movie) {
            return res.status(404).json({
                success: false,
                message: "Movie not found",
            });
        }

        res.status(200).json({ success: true, data: movie });

    } catch (error) {
        console.error("Get movie error:", error);
        res.status(500).json({ success: false, message: "Failed to fetch movie" });
    }
};

//    UPDATE MOVIE (ADMIN ONLY)
export const updateMovieCard = async (req, res) => {
    try {
        if (req.user?.role !== "admin") {
            return res.status(403).json({
                success: false,
                message: "Unauthorized",
            });
        }

        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid movie ID",
            });
        }

        const allowedFields = [
            "title",
            "description",
            "genre",
            "director",
            "cast",
            "releaseDate",
            "rating",
            "duration",
        ];

        const updateData = {};
        allowedFields.forEach((field) => {
            if (req.body[field] !== undefined) {
                updateData[field] = req.body[field];
            }
        });

        const movie = await MovieCard.findByIdAndUpdate(
            id,
            updateData,
            { new: true, runValidators: true }
        );

        if (!movie) {
            return res.status(404).json({
                success: false,
                message: "Movie not found",
            });
        }

        res.status(200).json({ success: true, data: movie });

    } catch (error) {
        console.error("Update movie error:", error);
        res.status(500).json({ success: false, message: "Failed to update movie" });
    }
};


//    DELETE MOVIE (SOFT, ADMIN ONLY)
export const deleteMovieCard = async (req, res) => {
    try {
        if (req.user?.role !== "admin") {
            return res.status(403).json({
                success: false,
                message: "Unauthorized",
            });
        }

        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid movie ID",
            });
        }

        const movie = await MovieCard.findByIdAndUpdate(
            id,
            { isActive: false },
            { new: true }
        );

        if (!movie) {
            return res.status(404).json({
                success: false,
                message: "Movie not found",
            });
        }

        res.status(200).json({
            success: true,
            message: "Movie deleted successfully",
        });

    } catch (error) {
        console.error("Delete movie error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to delete movie",
        });
    }
};
import Movie from "../models/Movie.js";
import mongoose from "mongoose";

//    GET ALL MOVIES (FILTER SUPPORT)
export const getAllMovieCards = async (req, res) => {
    try {
        const { genre, search, minRating } = req.query;

        let filter = { isActive: true };

        // Genre filter (supports array field properly)
        if (genre) {
            filter.genre = genre;
        }

        // Minimum rating filter
        if (minRating) {
            filter.rating = { $gte: Number(minRating) };
        }

        // Search by title (case-insensitive)
        if (search) {
            filter.title = { $regex: search, $options: "i" };
        }

        const movies = await Movie.find(filter).sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            data: movies,
        });

    } catch (error) {
        console.error("Get Movies Error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch movies",
        });
    }
};

// export const getAllMovieCards = async (req, res) => {
//     try {
//         const { genre, search, minRating } = req.query;

//         let filter = {};
//         filter.isActive = true;

//         // Genre filter
//         if (genre) {
//             filter.genre = { $in: genre.split(",") };
//         }

//         // Rating filter
//         if (minRating && !isNaN(minRating)) {
//             filter.rating = { $gte: Number(minRating) };
//         }

//         // Search filter
//         if (search) {
//             filter.$or = [
//                 { title: { $regex: search, $options: "i" } },
//                 { description: { $regex: search, $options: "i" } }
//             ];
//         }

//         const movies = await Movie.find(filter).sort({ createdAt: -1 });

//         return res.status(200).json({
//             success: true,
//             data: movies,
//         });

//     } catch (error) {
//         console.error("Get Movies Error:", error);
//         return res.status(500).json({
//             success: false,
//             message: "Failed to fetch movies",
//         });
//     }
// };

// showing suggesion in input

export const getMovieSuggestions = async (req, res) => {
    try {
        const { q } = req.query;

        if (!q) {
            return res.json({ success: true, data: [] });
        }

        const movies = await Movie.find({
            title: { $regex: q, $options: "i" },
            isActive: true,
        })
            .select("title posterUrl")
            .limit(5);

        return res.json({
            success: true,
            data: movies,
        });

    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Failed to fetch suggestions",
        });
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

        const movie = await Movie.findOne({ _id: id, isActive: true });

        if (!movie) {
            return res.status(404).json({
                success: false,
                message: "Movie not found",
            });
        }

        return res.status(200).json({
            success: true,
            data: movie,
        });

    } catch (error) {
        console.error("Get movie error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch movie",
        });
    }
};

// (ADMIN ONLY)
export const createMovieCard = async (req, res, next) => {
    try {
        if (req.user?.role !== "admin") {
            return res.status(403).json({
                success: false,
                message: "Unauthorized",
            });
        }

        let {
            title,
            description,
            genre,
            cast,
            releaseDate,
            rating,
            duration,
            director,
        } = req.body;

        if (typeof genre === "string") {
            if (genre.startsWith("[")) {
                genre = JSON.parse(genre);
            } else {
                genre = genre.split(",").map((g) => g.trim());
            }
        }

        if (typeof cast === "string") {
            if (cast.startsWith("[")) {
                cast = JSON.parse(cast);
            } else {
                cast = cast.split(",").map((c) => c.trim());
            }
        }

        let posterUrl = "";
        if (req.file) {
            posterUrl = `/uploads/${req.file.filename}`;
        }

        const movie = await Movie.create({
            title,
            description,
            genre,
            cast,
            director,
            releaseDate: new Date(releaseDate),
            rating,
            duration,
            posterUrl,
            createdBy: req.user.id,
        });

        console.log(movie.posterUrl);

        return res.status(201).json({
            success: true,
            data: movie,
        });

    } catch (err) {
        console.error("Create Movie error:", err);
        next(err);
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

        let { genre, cast, releaseDate } = req.body;

        if (typeof genre === "string") {
            if (genre.startsWith("[")) {
                genre = JSON.parse(genre);
            } else {
                genre = genre.split(",").map(g => g.trim()).filter(Boolean);
            }
        }

        if (typeof cast === "string") {
            cast = cast.split(",").map(c => c.trim()).filter(Boolean);
        }

        if (releaseDate) {
            releaseDate = new Date(releaseDate);
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
            let value = req.body[field];

            if (value === undefined) return;

            if (typeof value === "string" && value.trim() === "") return;

            if (field === "genre") value = genre;
            if (field === "cast") value = cast;
            if (field === "releaseDate") value = releaseDate;

            updateData[field] = value;
        });

        if (req.file) {
            updateData.posterUrl = `/uploads/${req.file.filename}`;
        }

        const movie = await Movie.findByIdAndUpdate(
            id,
            updateData,
            {
                returnDocument: "after",
                runValidators: true,
            }
        );

        if (!movie) {
            return res.status(404).json({
                success: false,
                message: "Movie not found",
            });
        }

        return res.status(200).json({
            success: true,
            data: movie,
        });

    } catch (error) {
        console.error("Update movie error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to update movie",
        });
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

        const movie = await Movie.findByIdAndUpdate(
            id,
            { isActive: false },
            {
                returnDocument: "after",
            }
        );

        if (!movie) {
            return res.status(404).json({
                success: false,
                message: "Movie not found",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Movie deleted successfully",
        });

    } catch (error) {
        console.error("Delete movie error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to delete movie",
        });
    }
};
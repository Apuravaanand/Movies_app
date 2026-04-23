import mongoose from "mongoose";

const GENRES = [
    "Action",
    "Drama",
    "Comedy",
    "Sci-Fi",
    "Adventure",
    "Crime",
    "Horror",
];

const movieSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
        },

        description: {
            type: String,
            default: "",
            trim: true,
        },

        genre: {
            type: [String],
            required: true,
            set: (arr) =>
                Array.isArray(arr)
                    ? arr.map((g) => g.trim())
                    : [],
            validate: {
                validator: (arr) =>
                    Array.isArray(arr) &&
                    arr.length > 0 &&
                    arr.every((g) => GENRES.includes(g)),
                message: "Invalid genre",
            },
        },

        director: {
            type: String,
            default: "",
            trim: true,
        },

        cast: {
            type: [String],
            default: [],
            set: (arr) =>
                Array.isArray(arr)
                    ? arr.map((c) => c.trim())
                    : [],
        },

        releaseDate: {
            type: Date,
            required: true,
        },

        rating: {
            type: Number,
            min: 0,
            max: 10,
            default: 0,
        },

        posterUrl: {
            type: String,
            default: "",
        },

        duration: {
            type: Number,
            min: 1,
            default: 90,
        },

        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        isActive: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
    }
);

// Indexes
movieSchema.index({ title: "text" });
movieSchema.index({ genre: 1, rating: -1 });

export default mongoose.model("Movie", movieSchema);
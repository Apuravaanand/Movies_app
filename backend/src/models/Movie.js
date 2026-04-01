import mongoose from "mongoose";

const movieSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true
        },

        description: {
            type: String,
            default: ""
        },

        genre: {
            type: [String],
            required: true,
            index: true   // ✅ faster category filtering
        },

        director: {
            type: String,
            default: ""
        },

        cast: {
            type: [String],
            default: []
        },

        releaseDate: {
            type: Date,
            required: true
        },

        rating: {
            type: Number,
            min: 0,
            max: 10,
            default: 0
        },

        posterUrl: {
            type: String,
            default: ""
        },

        duration: {
            type: Number,
            default: 0
        },

        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        isActive: {
            type: Boolean,
            default: true
        },
    },
    {
        timestamps: true, 
    }
);

movieSchema.index({ title: "text" });

export default mongoose.model("Movie", movieSchema);
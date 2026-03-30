import User from "../models/User.js";

export const toggleFavorite = async (req, res) => {
    const user = await User.findById(req.user.id);

    const movieId = req.params.movieId;

    if (user.favorites.includes(movieId)) {
        user.favorites = user.favorites.filter(
            (id) => id.toString() !== movieId
        );
    } else {
        user.favorites.push(movieId);
    }

    await user.save();

    res.json({
        favorites: user.favorites, // ✅ IMPORTANT
    });
};

export const getFavorites = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).populate("favorites");

        res.json({
            success: true,
            favorites: user.favorites,
        });
    } catch (err) {
        res.status(500).json({ success: false, message: "Server Error" });
    }
};
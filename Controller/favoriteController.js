const Favorite = require('../Model/favorite');
const User = require('../Model/Users');
const Event = require('../Model/Events/Events');


exports.addFavorite = async (req, res) => {
    try {
        const { user_id, event_id } = req.body;

        // Check if favorite already exists
        const existingFavorite = await Favorite.findOne({ user_id, event_id });
        if (existingFavorite) {
            return res.status(400).json({ message: "Event already favorited by this user." });
        }

        // Create new favorite
        const favorite = new Favorite({ user_id, event_id });
        await favorite.save();

        res.status(201).json({ message: "Event added to favorites", favorite });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};


//   Remove an event from favorites

exports.removeFavorite = async (req, res) => {
    try {
        const { user_id, event_id } = req.body;

        const deletedFavorite = await Favorite.findOneAndDelete({ user_id, event_id });

        if (!deletedFavorite) {
            return res.status(404).json({ message: "Favorite not found" });
        }

        res.status(200).json({ message: "Event removed from favorites" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};


//   Get all favorite events of a user
 
exports.getUserFavorites = async (req, res) => {
    try {
        const { user_id } = req.params;

        const favorites = await Favorite.find({ user_id }).populate('event_id');

        res.status(200).json(favorites);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

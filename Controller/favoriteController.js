const Favorite = require('../Model/favorite');
const User = require('../Model/Users');
const Event = require('../Model/Events/Events');


// ------------------------------- Adding  events to the Favorite List  -------------------------------------------------
exports.addFavorite = async (req, res) => {
    try {
        const { user_id, event_id } = req.body;

        // Find favorite document for the user
        let favorite = await Favorite.findOne({ user_id });

        if (!favorite) {
            // Create new favorite document if it doesn't exist
            favorite = new Favorite({ user_id, event_id: [event_id] });
        } else {
            // Check if event is already favorited
            if (favorite.event_id.includes(event_id)) {
                return res.status(400).json({ message: "Event already favorited by this user." });
            }

            // Add event ID to the favorites array
            favorite.event_id.push(event_id);
        }

        // Save the favorite document
        await favorite.save();

        res.status(201).json({ message: "Event added to favorites", favorite });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};



// ------------------------   Remove an event from favorites  ------------------------------------------

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


// ---------------------   Get all favorite events of a user -------------------------------------------
 
exports.getUserFavorites = async (req, res) => {
    try {
        const { user_id } = req.params;

        const favorites = await Favorite.find({ user_id }).populate('event_id');

        res.status(200).json(favorites);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

const mongoose = require('mongoose');

const favoriteSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: true
    },
    event_id: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'events'
    }]
}, { timestamps: true });

const Favorite = mongoose.model('Favorite', favoriteSchema);

module.exports = Favorite;

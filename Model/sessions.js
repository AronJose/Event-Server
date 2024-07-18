const mongoose = require('mongoose');

const sessionsSchema = new mongoose.Schema({
    token: {
        type: String,
        required: true
    },
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: true
    },
});

const Session = mongoose.model('session', sessionsSchema);

module.exports = Session;
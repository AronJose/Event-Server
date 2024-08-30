const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
    Event_name: {
        type: String,
        required: true
    },
    image: [
        {
            type: String,
        }
    ],
    place: {
        type: String,
        required: true
    },
    desc: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    services: [{
        type: String,
        required: true
    }],
    category: [{
        type: String,
        required: true
    }]
});

const Event = mongoose.model('Events', eventSchema);

module.exports = Event;
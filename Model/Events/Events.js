const mongoose = require('mongoose');
const Providing = require('./providing/providing');

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
    }],
    providing: [{
        type: String,
        required: true
    }],
    providers: [{
        type: String,
        required: true
    }],
    email: {
        type: String,
        required: true,
        unique: true
    },
    contact: {
        type: String,
        required: true,
        unique: true
    },
    status: {
        type: String,
        enum: ['active', 'inactive', 'trash'],
        default: 'active',
        required: true
    },
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: true
    },
    created_at: {
        type: Date,
        default: Date.now
    }

});

const Event = mongoose.model('events', eventSchema);

module.exports = Event;
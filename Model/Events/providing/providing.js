const mongoose = require('mongoose');

const providingSchema = new mongoose.Schema({
    providing: {
        type: String,
        required: true
    }
});

const Providing = mongoose.model('Providing', providingSchema);

module.exports = Providing;
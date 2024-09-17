const mongoose = require('mongoose');

const providersSchema = new mongoose.Schema({
    providers: {
        type: String,
        required: true
    }
});

const Providers = mongoose.model('Providers', providersSchema);

module.exports = Providers;
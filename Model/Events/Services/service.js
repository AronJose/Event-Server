const mongoose = require('mongoose');

const servicesSchema = new mongoose.Schema({
    services: {
        type: String,
        required: true
    }
});

const Services = mongoose.model('Services', servicesSchema);

module.exports = Services;
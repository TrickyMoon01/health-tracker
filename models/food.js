const mongoose = require('mongoose');

// user.js

const foodSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    } // YOU DO: Define properties of food schema
});


const Food = mongoose.model('Food', foodSchema);

module.exports = Food; 
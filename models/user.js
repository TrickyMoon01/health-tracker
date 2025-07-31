const mongoose = require('mongoose');


const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
});

userSchema.virtual('weight_history',{
    ref: 'Weight',
    localField:'_id',
    foreignField: 'user_id'
})

// Configure schema to support population of virtuals
claimSchema.set("toJSON", { virtuals: true });
claimSchema.set("toObject", { virtuals: true });
//https://mongoosejs.com/docs/tutorials/virtuals.html

const User = mongoose.model('User', userSchema);

module.exports = User; 
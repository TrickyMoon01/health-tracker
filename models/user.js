const mongoose = require('mongoose');
const Weight = require('./weight.js')
const Plan = require('./plan.js')


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
userSchema.virtual('plan_history',{
    ref: 'Plan',
    localField:'_id',
    foreignField: 'user_id'
})

// Configure schema to support population of virtuals
userSchema.set("toJSON", { virtuals: true });
userSchema.set("toObject", { virtuals: true });
//https://mongoosejs.com/docs/tutorials/virtuals.html

const User = mongoose.model('User', userSchema);

module.exports = User; 
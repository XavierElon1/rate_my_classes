const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const reviewSchema = new Schema ({
    body: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minLength: 3
    },
    rating: {
        type: Number,
        required: true,
        unique: false,
        min: 1,
        max: 5,
    },
    difficulty: {
        type: Number,
        required: true,
        unique: false,
        min: 1,
        max: 5,
    },
    hoursPerWeek: {
        type: Number,
        required: true,
        unique: false,
        min: 1, 
        max: 100,
    },
    professor: {
        type: String,
        required: false,
        unique: false,
        minLength:3
    },
    grade: {
        type: String,
        required: false,
        unique: false,
        min:1,
        max:1
    }
}, {
    timestamps: true,
});

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
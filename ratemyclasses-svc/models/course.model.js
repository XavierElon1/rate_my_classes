const mongoose = require('mongoose');

const Review = require('../models/review.model');

const Schema = mongoose.Schema;

const courseSchema = new Schema ({
    title: {
        type: String,
        required: true,
        unique: false,
        trim: true,
        minLength: 3
    },
    courseID: {
        type: String,
        required: true,
        unique: false,
        trim: true,
        minLength: 3
    },
    body: {
        type: String,
        required: true,
        unique: false,
        trim: true,
        minLength: 3
    },
    averageRating: {
        type: Number,
        required: true,
        unique: false,
        min: 0,
        max: 5,
    },
    averageDifficulty: {
        type: Number,
        required: true,
        unique: false,
        min: 0,
        max: 5,
    },
    averageHoursPerWeek: {
        type: Number,
        required: true,
        unique: false,
        min: 0,
        max: 100,
    },
    reviews: [{ type: Schema.Types.ObjectId, ref: 'Review'}]
}, {
    timestamps: true,
});

const Course = mongoose.model('Course', courseSchema);

module.exports = Course;
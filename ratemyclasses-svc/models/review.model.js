const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const reviewSchema = new Schema ({
    title: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minLength: 3
    },
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
		grade: {
				type: String,
				required: false,
				unique: false,
				minLength:1,
				maxLength:1,
		},
		professor: {
				type: String,
				required: false,
				unique: false,
				minLength:3
		}
}, {
    timestamps: true,
});

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;

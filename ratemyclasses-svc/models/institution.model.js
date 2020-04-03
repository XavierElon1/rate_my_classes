const mongoose = require('mongoose');

const Course = require('../models/course.model');

const Schema = mongoose.Schema;

const institutionSchema = new Schema ({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minLength: 2
    },
    averageRating: {
        type: Number,
        required: true,
        unique: false,
        min: 0,
        max: 5,
    },
    courses: [{ type: Schema.Types.ObjectId, ref: 'Course'}]
}, {
    timestamps: true,
});

const Institution = mongoose.model('Institution', institutionSchema);

module.exports = Institution;
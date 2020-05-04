const router = require('express').Router();

var Course = require('../models/review.model');
var Review = require('../models/review.model');

const isValid = require('../helpers/helpers.js').idIsValid;
const constants = require('../helpers/constants.js');

const MONGO_ID_LENGTH = 24;

// Retrieve single ID - Probably don't need this route for now
router.get('/:course_id', (req, res) => {
    Review.find()
        .then(reviews => res.json(reviews))
        .catch(err => res.status(400).json('Error: ' + err));
});

// Get all reviews of a course
router.get('/:course_id', (req, res) => {
    var id = req.params.review_id;
    if (!req.params || !id|| !isValid(id)) {
        return res.status(404).json({Error: + constants.ID_ERROR});
    }
    
    console.log("getting course by id: " + id);

    try{
        Course.findById(id).exec( (err, institution ) => {
            if(err) {
                res.status(404).json({ Error: + err });
                return;
            }
            if(!institution) {
                res.status(404).json({ Error: + constants.NOT_FOUND})
            }
        });
    }
    Review.findById(id)
        .then(review => {res.status(200).json(review)
            console.log(JSON.stringify(review));
        })
        .catch(err => res.status(400).json('Error: ' + err));
    
});

router.post('/', (req, res) => {
    const title = req.body.title;
    const body = req.body.body;
    const rating = req.body.rating;
    const difficulty = req.body.difficulty;
    const hoursPerWeek = req.body.hoursPerWeek;
    const professor = req.body.professor;
    const grade = req.body.grade;

    const newReview = new Review({
        title,
        body,
        rating,
        difficulty,
        hoursPerWeek,
        professor,
        grade
    });

    newReview.save().then(item => {res.status(200).json(item)
        console.log(newReview);
    })
    .catch(error => {
        res.status(400).json(error);
    });
});

router.put('/:review_id', async (req, res) => {
    
});

router.delete('/:review_id', function (req, res) {
    const review = Review.findById(req.param.review_id);
    if(!review) throw Error('No review with that id found');
        
    review.remove().then(item => {res.status(200).json(item)
        console.log(review);
    })
    .catch(error => {
        res.status(400).json(error);
    });
});
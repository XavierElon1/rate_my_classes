const router = require('express').Router();
var Review = require('../models/review.model');
const idIsValid = require('../helpers/helpers.js').idIsValid

router.get('/', (req, res) => {
    Review.find()
        .then(reviews => res.json(reviews))
        .catch(err => res.status(400).json('Error: ' + err));
});

router.get('/:review_id', (req, res) => {
    var id = req.params.review_id;
    console.log("id = " + id);
    if (idIsValid(id)) {
        return res.status(500).json('Error: ' + 'Invalid id');
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
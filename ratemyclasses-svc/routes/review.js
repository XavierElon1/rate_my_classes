const router = require('express').Router();

var Course = require('../models/review.model');
var Review = require('../models/review.model');

const isValid = require('../helpers/helpers.js').idIsValid;
const constants = require('../helpers/constants.js');


// Paginate reviews
function paginate(req, res) {
    page = 0;
    if (Object.keys(req.query).includes("page")) {
        page = parseInt(req.query.page);
    }
    var reviewCount = 0;

    Review.countDocuments({}, function(err, result) {
        if (err) {
            console.log(err);
        } else {
            reviewCount = parseInt(result);
            console.log('Found ' + reviewCount + ' reviews');
        }
    });
    Review.find()
    .limit(constants.QUERY_LIMIT)
    .skip(page * constants.QUERY_LIMIT)
    .then(reviews => {
        var results = {};
        if ((page * constants.QUERY_LIMIT) < reviewCount) {
            nextPage = page + 1;
            results.next = req.protocol + '://' + req.get('host') + req.baseUrl + '?page' + nextPage;
        }
        results.reviews = reviews;
        console.log("Returning results " + (page * constants.QUERY_LIMIT) + " to " + (page * constants.QUERY_LIMIT + constants.QUERY_LIMIT) + " of " + reviewCount + " reviews");
        res.json(results);
    })
    .catch(err => res.status(400).json({ Error: err }));
}

// Start Review Routes

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
        Course.findById(id).
        exec( (err, course ) => {
            if(err) {
                res.status(404).json({ Error: + err });
                return;
            }
            if(!course) {
                res.status(404).json({ Error: + constants.NOT_FOUND});
                return;
            }
            console.log("returning courses reviews: " + JSON.stringify(course.reviews));
            Course.find({
                '_id': { $in: [
                    course.reviews
                ]}
            }, function(err, reviews) {
                    if(err) {
                        res.status(400).json({ Error: + err});
                    } else {
                        console.log(JSON.stringify(reviews));
                        paginate(req, res);
                    }
                });
            });
    } catch (err) {
        res.status(400).json({ Error: err });
    }
});


// Put a review into a course
router.put('/:course_id', (req, res) => {
    var id = req.params.course_id;
    if (!req.params || !id|| !isValid(id)) {
        return res.status(404).json({Error: + constants.ID_ERROR});
    }

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

    try {
        Course.findById(id)
        .exec( (err, course ) => {
            if (err) {
                res.status(404).json({ Error: err });
                return;
            }
            if (!course) {
                res.status(404).json({ Error: constants.NOT_FOUND });
                return;
            }

            console.log('trying to add review object to course id ' + id + ': ' + JSON.stringify(newReview));
            newReview.save()
            .then( review => {
                console.log('saved new review: ' + review.id);
                course.reviews.push({'_id': review.id});
                course.save()
                console.log('modified course: ' + JSON.stringify(course));
                res.status(201).json({'id': review.id});
            })
            .catch(err => { 
                res.status(400).json({'Error': err.errmsg});
            });
        });
    } catch(err) { 
        res.status(400).json({ Error: err });
    }
});


// Delete a review from a course 
router.delete('/:review_id/:course_id', function (req, res) {
    var review_id = req.params.review_id;
    var course_id = req.params.course_id;
    if (!req.params || !course_id || !isValid(course_id) || !review_id || !isValid(review_id)) {
        return res.status(400).json({ Error: + constants.ID_ERROR });
    }
   
    console.log("getting course by id: " + course_id);

    try {
        Course.findById(course_id)
        .exec( (err, course) => {
            if(err) {
                res.status(404).json({ Error: err });
                return;
            }
            if (!course) {
                res.status(404).json({ Error: constants.NOT_FOUND });
                return;
            }
            console.log('trying to remove review ' + review_id + ' from course ' + course_id)
            course.reviews.pull({'_id': review_id});
            course.save()
            console.log('saved course: ' + JSON.stringify(course))
        })
    } catch(err) { 
        res.status(400).json({'Error': err});
    }

    console.log('deleting review')
    try {
        Review.findByIdAndDelete(review_id, function (err,review) {
            if (err) { 
                res.status(400).json({ Error: err }); 
            } else if (review) { 
                review.save()
                console.log('deleted' + JSON.stringify(review))
                res.status(204).json();
            } else {
                res.status(404).json({ Error: constants.NOT_FOUND });
            }
        });
    } catch(err) { 
        res.status(400).json({ Error: err });
    }
});

module.exports = router;
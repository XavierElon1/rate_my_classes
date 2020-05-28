const router = require('express').Router();

var Institution = require('../models/institution.model');
var Course = require('../models/course.model');
var Review = require('../models/review.model');

const isValid = require('../helpers/helpers.js').idIsValid;
const verifyToken = require('../helpers/helpers.js').verifyToken;
const sameDomain = require('../helpers/helpers.js').sameDomain;

const constants = require('../helpers/constants.js');


// Paginate reviews
function paginate(req, res, review_list, review_count, course_id) {
    page = 0;
    if (Object.keys(req.query).includes("page")) {
        page = parseInt(req.query.page);
    }
    console.log('review count: ' + review_count);
   
    Review.find().where('_id').in(review_list)
    .limit(constants.QUERY_LIMIT)
    .skip(page * constants.QUERY_LIMIT)
    .then(reviews => {
        var results = {};
        if (((page + 1) * constants.QUERY_LIMIT) < review_count) {
            nextPage = page + 1;
            results.next = req.protocol + '://' + req.get('host') + req.baseUrl + '/' + course_id + '?page' + nextPage;
        }

        results.pages = Math.ceil(review_count / constants.QUERY_LIMIT);
        results.reviews = reviews;
        console.log("Returning results " + (page * constants.QUERY_LIMIT) + " to " + (page * constants.QUERY_LIMIT + constants.QUERY_LIMIT) + " of " + review_count + " reviews");
        console.log(results);
        res.json(results);
    })
    .catch(err => res.status(400).json({ Error: err }));
}

// Start Review Routes

// Retrieve single ID - Probably don't need this route for now
router.get('/:course_id/:review_id', (req, res) => {
    var id = req.params.review_id;
    if (!req.params || !req.params.course_id || !isValid(req.params.course_id) || !id || !isValid(id)) {
        return res.status(400).json({Error: + constants.ID_ERROR});
    }
    if (id.length != constants.MONGO_ID_LENGTH || !id.match(/^[0-9a-z]+$/)) {
        return res.status(500).json('Error: ' + 'Invalid id');
    }
    Review.findById(id)
        .then(review => {res.status(200).json(review)
            console.log(review);
        })
        .catch(err => res.status(400).json('Error: ' + err));
});

// Get all reviews of a course
router.get('/:course_id', (req, res) => {
    var id = req.params.course_id;
    if (!req.params || !req.params.course_id|| !isValid(id)) {
        return res.status(404).json({Error: + constants.ID_ERROR});
    }
    if (id.length != constants.MONGO_ID_LENGTH || !id.match(/^[0-9a-z]+$/)) {
        return res.status(500).json('Error: ' + 'Invalid id');
    }
    
    console.log("getting course by id: " + id);

    try{
        Course.findById(id).
        exec( (err, course ) => {
            console.log(course);
            if(err) {
                res.status(404).json({ Error: + err });
                return;
            }
            if(!course) {
                res.status(404).json({ Error: + constants.NOT_FOUND});
                return;
            }
            var reviews = course.reviews;
            var review_count = reviews.length;
            Review.find().where('_id').in(reviews).exec((err, review_list) => {
                if (err) {
                    res.status(404).json({ Error: err});
                    return;
                }
                if(!review_list) {
                    res.status(404).json({ Error: constants.NOT_FOUND });
                    return;
                }
                console.log(review_list);
                paginate(req, res, review_list, review_count, id);
            })
        });
    } catch (err) {
        res.status(400).json({ Error: err });
    }
});


// Put a review into a course
router.put('/:course_id', (req, res) => {
    var id = req.params.course_id;
    if (!req.params || !id || !isValid(id)) {
        return res.status(404).json({Error: + constants.ID_ERROR});
    }

    const authorization = req.get('Authorization','');
    if (!authorization) {
        return res.status(401).json({Error: constants.NO_TOKEN});
    } 

    const body = req.body.body;
    const rating = req.body.rating;
    const difficulty = req.body.difficulty;
    const hoursPerWeek = req.body.hoursPerWeek;
    const professor = req.body.professor;
    const grade = req.body.grade;

    const newReview = new Review({
        body,
        rating,
        difficulty,
        hoursPerWeek,
        professor,
        grade
    });

    console.log("getting class by id: " + id);

    try {
        Institution.findOne({ 'courses': id })
        .then( institution => {
            console.log(institution)
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
                console.log(course);
                
                const tokenArray = authorization.split(" ");
                if (tokenArray.length < 2) {
                    return res.status(401).json({Error: constants.BAD_TOKEN});
                }

                const email = verifyToken(tokenArray[1]);

                if (tokenArray[0] != "Bearer" ) {
                    return res.status(401).json({Error: constants.BAD_TOKEN});
                } else if (!sameDomain(email, institution.website) && email != process.env.MANAGEMENT_EMAIL) {
                    return res.status(401).json({Error: constants.BAD_TOKEN});
                } 

                var reviews = course.reviews;
                console.log('trying to add review object to course id ' + id + ': ' + JSON.stringify(newReview));
                newReview.save()
                .then( review => {
                    console.log('saved new review: ' + review.id);
                    course.reviews.push({'_id': review.id});
                    Review.aggregate(
                        [
                          {"$match": {
                            "_id": { "$in": reviews },
                          }},
                          { "$group": {
                            "_id": null,
                            "avgDifficulty": { "$avg": "$difficulty" }, 
                            "avgRating": { "$avg": "$rating" },
                            "avgHours": { "$avg": "$hoursPerWeek"}
                          }},
                        ], function(err, averages) {
                            if (err) {
                                console.log(err);
                            }
                            console.log(averages);
                            course.averageRating = averages[0].avgRating.toFixed(1);
                            course.averageDifficulty = averages[0].avgDifficulty.toFixed(1);
                            course.averageHoursPerWeek = averages[0].avgHours.toFixed(1);
                            course.save();
                        }
                    );
                    console.log('modified course: ' + JSON.stringify(course));
                    try {
                        Institution.findOne({ 'courses': id })
                        .then( institution => {
                            console.log(institution)
                            var courses = institution.courses
                            Course.aggregate(
                                [
                                    { "$match": {
                                        "_id": { "$in": courses},
                                    }},
                                    { "$group": {
                                        "_id": null,
                                        "avgRating": { "$avg": "$averageRating" }
                                    }}
                                ], function (err, average) {
                                    if (err) {
                                        console.log(err)
                                    }
                                    console.log(average)
                                    institution.averageRating = average[0].avgRating.toFixed(1)
                                    institution.save()
                                }
                            )
                        })
                    } catch(err) {
                        res.status(400).json({ Error: err });
                    }
                    res.status(201).json({'id': review.id, 'body': review.body, 'rating': review.rating, 'difficulty': review.difficulty, 'hoursPerWeek': review.hoursPerWeek, 'professor': review.professor, 'grade': review.grade});
                })
                .catch(err => { 
                    res.status(400).json({'Error': err.errmsg});
                });
            });
        })
        .catch(err => {
            res.status(400).json({'Error': err});
        });
    } catch(err) { 
        res.status(400).json({ Error: err });
    }
    
});


// Delete a review from a course 
router.delete('/:review_id/:course_id', function (req, res) {

    if (!req.params || !req.params.course_id || !isValid(req.params.course_id) || !req.params.review_id || !isValid(req.params.review_id)) {
        return res.status(400).json({ Error: + constants.ID_ERROR });
    }

    var review_id = req.params.review_id;
    var course_id = req.params.course_id;

    const authorization = req.get('Authorization','');
    if (!authorization) {
        return res.status(401).json({Error: constants.NO_TOKEN});
    } else {
        const tokenArray = authorization.split(" ");
        if (tokenArray.length < 2 || tokenArray[0] != "Bearer" || verifyToken(tokenArray[1]) != process.env.MANAGEMENT_EMAIL ) {
            return res.status(401).json({Error: constants.BAD_TOKEN});
        } 
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
            course.reviews.pull({"_id": review_id});
            course.save();
            var reviews = course.reviews;
            console.log(reviews);
            console.log(reviews.length)
            if (reviews.length == 0) {
                course.averageRating = 0.0
                course.averageDifficulty = 0.0
                course.averageHoursPerWeek = 0.0
            } else {
                Review.aggregate(
                    [
                        {"$match": {
                            "_id": { "$in": reviews },
                        }},
                        { "$group": {
                            "_id": null,
                            "avgDifficulty": { "$avg": "$difficulty" },
                            "avgRating": { "$avg": "$rating" },
                            "avgHours": { "$avg": "$hoursPerWeek" }
                        }},
                    ], function (err, averages) {
                        if (err) {
                            console.log(err);
                        }
                        console.log(averages);
                        course.averageRating = averages[0].avgRating.toFixed(1);
                        course.averageDifficulty = averages[0].avgDifficulty.toFixed(1);
                        course.averageHoursPerWeek = averages[0].avgHours.toFixed(1);
                        course.save();
                    }
                )
            }
           
                        
            
            console.log('saved course: ' + JSON.stringify(course))
        })
    } catch(err) { 
        res.status(400).json({'Error': err});
    }

    

    
    try {
        Review.findByIdAndDelete(review_id, function (err,review) {
            console.log('deleting review')
            if (err) { 
                res.status(400).json({ Error: err }); 
            } else if (review) { 
                review.save()
                Institution.findOne({ 'courses': course_id })
                        .then( institution => {
                            console.log(institution)
                            var courses = institution.courses
                            Course.aggregate(
                                [
                                    { "$match": {
                                        "_id": { "$in": courses},
                                    }},
                                    { "$group": {
                                        "_id": null,
                                        "avgRating": { "$avg": "$averageRating" }
                                    }}
                                ], function (err, average) {
                                    if (err) {
                                        console.log(err)
                                    }
                                    console.log(average)
                                    institution.averageRating = average[0].avgRating.toFixed(1)
                                    institution.save()
                                }
                            )
                        })
                
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
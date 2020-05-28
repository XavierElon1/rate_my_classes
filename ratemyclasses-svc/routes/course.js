const router = require('express').Router();

var Course = require('../models/course.model');
var Institution = require('../models/institution.model');

const isValid = require('../helpers/helpers.js').idIsValid
const verifyToken = require('../helpers/helpers.js').verifyToken
const sameDomain = require('../helpers/helpers.js').sameDomain
const constants = require('../helpers/constants.js')


// Paginate courses
function paginate(req, res, course_list, course_count, institution_id) {
    page = 0;
    if (Object.keys(req.query).includes("page")) {
        page = parseInt(req.query.page);
    }
    console.log('Found ' + course_count + ' courses');

    Course.find().where('_id').in(course_list)
        .limit(constants.QUERY_LIMIT)
        .skip(page * constants.QUERY_LIMIT)
        .sort({
            averageRating: 'desc'
        })
        .then(courses => {
            var results = {};
            if (((page + 1) * constants.QUERY_LIMIT) < course_count) {
                nextPage = page + 1;
                results.next = req.protocol + '://' + req.get('host') + req.baseUrl + '/' + institution_id + '?page' + nextPage;
            }
            results.pages = Math.ceil(course_count / constants.QUERY_LIMIT);
            results.courses = courses;
            console.log(results);
            console.log("Returning results " + (page * constants.QUERY_LIMIT) + " to " + (page * constants.QUERY_LIMIT + constants.QUERY_LIMIT) + " of " + course_count + " courses");
            console.log(results);
            res.json(results);
        })
        .catch(err => res.status(400).json({ Error: err }));
}


// Filter courses
function filterResults(req, res, course_list, course_count, institution_id) {

    filter = req.query.filter;
    if (filter.length < 2) {
        return res.status(400).json({'Error': constants.FILTER_ERROR});
    }
    console.log(course_count);
    page = 0;
    if (Object.keys(req.query).includes("page")) {
        page = parseInt(req.query.page)
    }   
        var query = {$or: [{title: {$regex: filter, $options: 'i'}}, {courseID: {$regex: filter, $options: 'i'}}]}
        Course.find(query)
        .where('_id').in(course_list)
        .sort({
            title: 'asc'
        })
        .skip(page * constants.QUERY_LIMIT)
        .then(filtered_courses => {
            var results = {};
            var filtered_course_count = filtered_courses.length;
            console.log("filtered course count: " + filtered_course_count)
            if(((page + 1) * constants.QUERY_LIMIT) < filtered_course_count) {
                nextPage = page + 1;
                results.next = req.protocol + '://' + req.get('host') + req.baseUrl + '/' + institution_id + '?page=' + nextPage;
            }
            
            results.pages = Math.ceil(filtered_course_count / constants.QUERY_LIMIT);
            results.courses = filtered_courses;
            
            console.log("Returning results " + (page * constants.QUERY_LIMIT) + ' to ' + (page * constants.QUERY_LIMIT + constants.QUERY_LIMIT) + ' of ' +
            filtered_course_count + ' courses');
            res.json(results);
        })
        .catch(err => res.status(400).json({ Error: err }));
}



// GET all courses for an institution
router.route('/:institution_id').get((req,res) => {
    var id = req.params.institution_id;
    if (!req.params || !req.params.institution_id || !isValid(req.params.institution_id)) {
        return res.status(400).json({Error: + constants.ID_ERROR});
    }
    if (id.length != constants.MONGO_ID_LENGTH || !id.match(/^[0-9a-z]+$/)) {
        return res.status(500).json('Error: ' + 'Invalid id');
    }

    console.log("getting institution by id: " + id)

    try {
        Institution.findById(id)
        .exec( (err, institution) => {
            if(err) {
                res.status(404).json({Error: + err});
                return;
            }
            if (!institution) {
                res.status(404).json({Error: + constants.NOT_FOUND});
                return;
            }
            console.log("returning institution courses: " + JSON.stringify(institution.courses));
            var courses = institution.courses;
            Course.find().where('_id').in(courses).exec((err, course_list) => {
                if(err) {
                    res.status(404).json({ Error: + err });
                    return;
                }
                if (!course_list) {
                    res.status(404).json({ Error: constants.NOT_FOUND });
                    return;
                }
                course_count = course_list.length;
                if(req.query.filter == undefined) {
                    paginate(req, res, course_list, course_count, id)
                } else {
                    filterResults(req, res, course_list, course_count);
                }
            })
        });
    } catch(err) { 
        res.status(400).json({'Error': err});
    }
});


// GET a single course by ID
router.get('/:institution_id/:course_id', (req, res) => {
    var id = req.params.course_id;
    if (!req.params || !req.params.institution_id || !isValid(req.params.institution_id) || !id || !isValid(id)) {
        return res.status(400).json({Error: + constants.ID_ERROR});
    }
    if (id.length != constants.MONGO_ID_LENGTH || !id.match(/^[0-9a-z]+$/)) {
        return res.status(500).json('Error: ' + 'Invalid id');
    }
    console.log("getting course by id: " + id);
   
    Course.findById(id)
        .then(course => {res.status(200).json(course)
            console.log(course);
        })
        .catch(err => res.status(400).json('Error: ' + err));

});

// PATCH a course
router.patch('/:course_id', (req, res) => {
    var updatedCourse = req.body;
    console.log(updatedCourse);
    var id = req.params.course_id;

    const authorization = req.get('Authorization','');
    if (!authorization) {
        return res.status(401).json({Error: constants.NO_TOKEN});
    } 

    const tokenArray = authorization.split(" ");
    if (tokenArray.length < 2) {
        return res.status(401).json({Error: constants.BAD_TOKEN});
    }

    const email = verifyToken(tokenArray[1]);
    Course.findByIdAndUpdate(id, req.body, {new: true}, (err, course) => {
        if (err) {
            return res.status(500).send(err);
        } else {
            return res.send(course);
        }
    })
})


// add a course to an Institution
router.route('/:institution_id').put((req,res) => {
    if (!req.params || !req.params.institution_id || !isValid(req.params.institution_id)) {
        return res.status(400).json({Error: + constants.ID_ERROR});
    }

    const authorization = req.get('Authorization','');
    if (!authorization) {
        return res.status(401).json({Error: constants.NO_TOKEN});
    } 

    const title = req.body.title;
    const courseID = req.body.courseID;
    const averageRating = 0.0;
    const averageDifficulty = 0.0;
    const averageHoursPerWeek = 0.0;
    
    const newCourse = new Course({
        title,
        courseID,
        averageRating,
        averageDifficulty,
        averageHoursPerWeek
    });

    var id = req.params.institution_id;

    console.log("getting institution by id: " + id);

    try {
        Institution.findById(id)
        .exec( (err, institution) => {
            if(err) {
                res.status(404).json({'Error': err});
                return;
            }
            if (!institution) {
                res.status(404).json({'Error': constants.NOT_FOUND});
                return;
            }
          
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
            var course_list = institution.courses;
    
            console.log('trying to add course object to institution id ' + req.params.institution_id + ': ' + JSON.stringify(newCourse));
            newCourse.save()
            .then( course => {
                console.log('saved new course: ' + course.id);
                institution.courses.push({'_id': course.id});
                Course.aggregate(
                    [
                        { "$match": {
                            "_id": { "$in": course_list },
                        }},
                        { "$group": {
                            "_id": null,
                            "avgRating": { "$avg": "$averageRating"}
                        }}
                    ], function (err, average) {
                        if (err) {
                            console.log(err);
                        }
                        console.log(average);
                        institution.averageRating = average[0].avgRating.toFixed(1);
                        institution.save()
                    }
                )
                
                console.log('modified institution: ' + JSON.stringify(institution));
                res.status(201).json({'id': course.id, 'courseID': course.courseID, 'title': course.title, 'rating': course.averageRating, 'difficulty': course.averageDifficulty, 'hoursPerWeek': course.averageHoursPerWeek});
            })
            .catch(err => { 
                res.status(400).json({'Error': err.errmsg});
            });
        });
    } catch(err) {
        res.status(400).json({'Error': err});
    }
});


// DELETE a course from an institution
router.delete('/:course_id/:institution_id', function (req, res) {
    if (!req.params || !req.params.course_id || !isValid(req.params.course_id) || !req.params.institution_id || !isValid(req.params.institution_id)) {
        return res.status(400).json({Error: + constants.ID_ERROR});
    }

    const authorization = req.get('Authorization','');
    if (!authorization) {
        return res.status(401).json({Error: constants.NO_TOKEN});
    } else {
        const tokenArray = authorization.split(" ");
        if (tokenArray.length < 2 || tokenArray[0] != "Bearer" || verifyToken(tokenArray[1]) != process.env.MANAGEMENT_EMAIL ) {
            return res.status(401).json({Error: constants.BAD_TOKEN});
        } 
    }

    var id = req.params.institution_id;
    var course_id = req.params.course_id;

    console.log("getting institution by id: " + id)

    try {
        Institution.findById(id)
        .exec( (err, institution) => {
            if(err) {
                res.status(404).json({'Error': err});
                return;
            }
            if (!institution) {
                res.status(404).json({'Error': constants.NOT_FOUND});
                return;
            }
            console.log('trying to remove course ' + req.params.course_id + ' from institution ' + req.params.institution_id)
            institution.courses.pull({"_id": course_id});
            institution.save()
            var courses = institution.courses;
            console.log(courses);
            console.log(courses.length)
            if (courses.length == 0) {
                institution.averageRating = 0.0;
            } else {
                Course.aggregate (
                    [
                        { "$match": {
                            "_id": { "$in": courses },
                        }},
                        { "$group": {
                            "_id": null,
                            "avgRating": { "$avg": "$averageRating" }
                        }},
                    ], function (err, average) {
                        if (err) {
                            console.log(err);
                        }
                        console.log(average);
                        institution.averageRating = average[0].avgRating.toFixed(1);
                        institution.save()
                    }
                )
            }
            console.log('saved institution: ' + JSON.stringify(institution))
        })
    } catch(err) { 
        res.status(400).json({'Error': err});
    }

    console.log('deleting course')
    try {
        Course.findByIdAndDelete(req.params.course_id, function (err,course) {
            if (err) { 
                res.status(400).json({'Error': err}); 
            } else if (course) { 
                course.save()
                console.log('deleted' + JSON.stringify(course))
                res.status(204).json();
            } else {
                res.status(404).json({'Error': constants.NOT_FOUND});
            }
        });
    } catch(err) { 
        res.status(400).json({'Error': err});
    }
});
module.exports = router;
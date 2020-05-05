const router = require('express').Router();

var Course = require('../models/course.model');
var Institution = require('../models/institution.model');

const isValid = require('../helpers/helpers.js').idIsValid;
const constants = require('../helpers/constants.js');



// Paginate courses
function paginate(req, res) {
    page = 0;
    if (Object.keys(req.query).includes("page")) {
        page = parseInt(req.query.page);
    }
    var courseCount = 0;

    Course.countDocuments({}, function(err, result) {
        if (err) {
            console.log(err);
        } else {
            courseCount = parseInt(result);
            console.log('Found ' + courseCount + ' courses');
        }
    });
    Course.find()
    .limit(constants.QUERY_LIMIT)
    .skip(page * constants.QUERY_LIMIT)
    .then(courses => {
        var results = {};
        if ((page * constants.QUERY_LIMIT) < courseCount) {
            nextPage = page + 1;
            results.next = req.protocol + '://' + req.get('host') + req.baseUrl + '?page' + nextPage;
        }
        results.courses = courses;
        console.log("Returning results " + (page * constants.QUERY_LIMIT) + " to " + (page * constants.QUERY_LIMIT + constants.QUERY_LIMIT) + " of " + courseCount + " courses");
        res.json(results);
    })
    .catch(err => res.status(400).json({ Error: err }));
}


// Get all courses for an institution
router.route('/:institution_id').get((req,res) => {
    if (!req.params || !req.params.institution_id || !isValid(req.params.institution_id)) {
        return res.status(400).json({Error: + constants.ID_ERROR});
    }

    var id = req.params.institution_id;

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
            Course.find({
                '_id': { $in: [
                    institution.courses
                ]}
            }, function(err, courses){
                if (err) {
                    res.status(400).json({'Error': err});
                } else { 
                    console.log(JSON.stringify(courses));
                    res.json(courses)
                }
            });
        });
    } catch(err) { 
        res.status(400).json({'Error': err});
    }
});


// Get a single course by ID
router.get('/:course_id', (req, res) => {
    var id = req.params.course_id;
    console.log("id = " + id);
    if (id.length != MONGO_ID_LENGTH || !id.match(/^[0-9a-z]+$/)) {
        return res.status(500).json('Error: ' + 'Invalid id');
    }
    Course.findById(id)
        .then(course => {res.status(200).json(course)
            console.log(JSON.stringify(course));
        })
        .catch(err => res.status(400).json('Error: ' + err));

});


// Post a course to an Institution
router.route('/:institution_id').put((req,res) => {
    if (!req.params || !req.params.institution_id || !isValid(req.params.institution_id)) {
        return res.status(400).json({Error: + constants.ID_ERROR});
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
            console.log('trying to add course object to institution id ' + req.params.institution_id + ': ' + JSON.stringify(newCourse));
            newCourse.save()
            .then( course => {
                console.log('saved new course: ' + course.id);
                institution.courses.push({'_id': course.id});
                institution.save()
                console.log('modified institution: ' + JSON.stringify(institution));
                res.status(201).json({'id': course.id});
            })
            .catch(err => { 
                console.log("here");
                res.status(400).json({'Error': err.errmsg});
            });
        });
    } catch(err) { 
        res.status(400).json({'Error': err});
    }
});


// Delete a course from an institution
router.delete('/:course_id/:institution_id', function (req, res) {
    if (!req.params || !req.params.course_id || !isValid(req.params.course_id) || !req.params.institution_id || !isValid(req.params.institution_id)) {
        return res.status(400).json({Error: + constants.ID_ERROR});
    }

    var id = req.params.institution_id;

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
            institution.courses.pull({'_id': req.params.course_id});
            institution.save()
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
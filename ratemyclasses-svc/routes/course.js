const router = require('express').Router();

var Course = require('../models/course.model');
var Institution = require('../models/institution.model');

const isValid = require('../helpers/helpers.js').idIsValid
const constants = require('../helpers/constants.js')

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
            console.log("returning institution courses: " + JSON.stringify(institution.courses))
            response = {}
            for (i=0; i< institution.courses.length; i++) {
                try {
                    Course.findById(institution.courses[i])
                    .exec( (err, course) => {
                        if(err) {
                            console.log(err)
                        }
                        console.log("processing course: " + JSON.stringify(course))
                        response.add(course);
                    });
                } catch(err) { 
                    console.log(err);
                }
            }
            res.json(response);
        });
    } catch(err) { 
        res.status(400).json({Error: + err});
    }
});

router.get('/:course_id/:institution_id', (req, res) => {
    var id = req.params.course_id;
    console.log("id = " + id);
    if (!isValid(id)) {
        return res.status(400).json('Error: ' + 'Invalid id');
    }
    Course.findById(id)
        .then(course => {res.status(200).json(course)
            console.log(JSON.stringify(course));
        })
        .catch(err => res.status(400).json('Error: ' + err));
    
});


router.route('/:institution_id').put((req,res) => {
    if (!req.params || !req.params.institution_id || !isValid(req.params.institution_id)) {
        return res.status(400).json({Error: + constants.ID_ERROR});
    }

    const title = req.body.title;
    const body = req.body.body;
    const courseID = req.body.courseID;
    const averageRating = 0.0;
    const averageDifficulty = 0.0;
    const averageHoursPerWeek = 0.0;
    
    const newCourse = new Course({
        title,
        courseID,
        body,
        averageRating,
        averageDifficulty,
        averageHoursPerWeek
    });

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
            console.log('trying to add course object to institution id ' + req.params.institution_id + ': ' + JSON.stringify(newCourse))
            newCourse.save()
            .then( course => {
                console.log('saved new course: ' + course.id);
                institution.courses.push({'_id': course.id});
                institution.save()
                console.log('returning institution: ' + JSON.stringify(institution))
                res.status(201).json(institution);
            })
            .catch(err => { 
                res.status(400).json({'Error': err.errmsg});
            });
        });
    } catch(err) { 
        res.status(400).json({'Error': err});
    }
});


router.delete('/:course_id/:institution_id', function (req, res) {
    const course = Course.findById(req.param.course_id);
    if(!course) throw Error('No review with that id found');
        
    course.remove().then(item => {res.status(200).json(item)
        console.log(course);
    })
    .catch(error => {
        res.status(400).json(error);
    });
});
module.exports = router;
const router = require('express').Router();

var Course = require('../models/course.model');
var Institution = require('../models/course.model');

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
            res.json(institution.courses);
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


router.put('/:course_id/:institution_id', (req, res) => {

    if (!req.params || !req.params.course_id || !req.params.institution_id || !isValid(req.params.institution_id) || !isValid(req.params.course_id)) {
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

    Institution.findOneAndUpdate(
        {name: req.params.institution_id}, 
        {$push: {courses: newCourse}
    }).then(res.status(201))
    .catch(err => {
        res.status(400).json(err);
    });
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
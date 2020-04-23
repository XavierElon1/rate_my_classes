const router = require('express').Router();
var Course = require('../models/course.model');

const MONGO_ID_LENGTH = 24;

router.get('/', (req, res) => {
    Course.find()
        .then(institutions => res.json(institutions))
        .catch(err => res.status(400).json('Error: ' + err));
});

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

router.post('/', (req, res) => {
    const title = req.body.title;
    const body = req.body.body;
    const averageRating = 0.0;
    const averageDifficulty = 0.0;
    const averageHoursPerWeek = 0.0;

    const newCourse = new Course({
        title,
        body,
        averageRating,
        averageDifficulty,
        averageHoursPerWeek
    });

    newCourse.save().then(item => {res.status(200).json(item)
        console.log(newCourse);
    })
    .catch(error => {
        res.status(400).json(error);
    });
});



module.exports = router;
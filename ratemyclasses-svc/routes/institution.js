const router = require('express').Router();
var Institution = require('../models/institution.model');

router.route('/').get((req,res) => {
    Institution.find()
        .then(institutions => res.json(institutions))
        .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/').post((req,res) => {

    const name = req.body.name;
    const averageRating = 0.0;
    const courses = [];

    const newInstitution = new Institution({
        name,
        averageRating,
        courses,
    });

    newInstitution.save()
        .then(institutions = res.json('Institution added: ' + name))
        .catch(err => res.status(400).json('Error: ' + err));
});

module.exports = router;
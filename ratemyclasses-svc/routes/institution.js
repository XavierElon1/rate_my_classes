const router = require('express').Router();
var Institution = require('../models/institution.model');

const MONGO_ID_LENGTH = 24

router.route('/').get((req,res) => {
    Institution.find()
        .then(institutions => res.json(institutions))
        .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/').post((req,res) => {

    const name = req.body.name;
    const website = req.body.website;
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

router.route('/:institution_id').get((req,res) => {
    var id = req.params.institution_id;
    console.log("processing id: " + id)
    if (id.length != MONGO_ID_LENGTH|| !id.match(/^[0-9a-z]+$/)) {
        return res.status(500).json('Error: ' +  'Invalid id');
    }
    Institution.findById(id)
        .then(institution => res.json(institution))
        .catch(err => res.status(400).json('Error: ' + err));
});

module.exports = router;
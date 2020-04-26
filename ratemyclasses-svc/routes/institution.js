const router = require('express').Router();
var Institution = require('../models/institution.model');

const MONGO_ID_LENGTH = 24
const QUERY_LIMIT = 100

router.route('/').get((req,res) => {
    page = 0
    if(Object.keys(req.query).includes("page")){
        page = parseInt(req.query.page)
    }

    institutionCount = 0
    Institution.countDocuments({}, function(err, result) {
        if (err) {
          console.log(err);
        } else {
            institutionCount = parseInt(result)
          console.log("Found " + result + " institutions");
        }
    });

    Institution.find()
        .limit(QUERY_LIMIT)
        .skip(page * QUERY_LIMIT)
        .sort({
            averageRating: 'desc'
        })
        .then(institutions => {
            var results = {};
            if ((page * QUERY_LIMIT) < institutionCount) {
                nextPage = page + 1
                results.next = req.protocol + "://" + req.get("host") + req.baseUrl + "?page=" + nextPage;
            }
            results.institutions = institutions
            console.log("Returning results " + (page * QUERY_LIMIT) + " to " + (page * QUERY_LIMIT + QUERY_LIMIT) + " of " + institutionCount + " institutions");
            res.json(results)
        })
        .catch(err => res.status(400).json('Error: ' + err));
});

router.post('/', (req, res) => {

    const name = req.body.name;
    const website = req.body.website;
    const averageRating = 0.0;
    const courses = [];

    const newInstitution = new Institution({
        name,
        website,
        averageRating,
        courses,
    });
    
    newInstitution.save().then(item => { res.status(200).json(item)
        console.log(newInstitution);
    }) 
    .catch(error => { 
        res.status(400).json(error);
    });
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
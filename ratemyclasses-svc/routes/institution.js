const router = require('express').Router();
var Institution = require('../models/institution.model');

const MONGO_ID_LENGTH = 24
const QUERY_LIMIT = 100
const ID_ERROR = 'Missing or invalid id'
const NOT_FOUND = 'Not found'

function idIsValid(id) {
    if (id.length != MONGO_ID_LENGTH|| !id.match(/^[0-9a-z]+$/)) {
        return false
    }
    return true
}

function paginate(req,res) {
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
        .catch(err => res.status(400).json({Error: + err}));
}

function filterResults(req,res) {
    filter = req.query.filter
    Institution.find({ "name": { "$regex": filter, "$options": "i" } })
    .sort({
        name: 'asc'
    })
    .then(institutions => res.json(institutions))
    .catch(err => res.status(400).json({Error: + err}));
}

router.route('/').get((req,res) => {
    if (req.query.filter == undefined) {
        paginate(req,res)
    } else {
        filterResults(req,res)
    }
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
    .catch(err => { 
        res.status(400).json({Error: + err});
    });
});

router.route('/:institution_id').get((req,res) => {
    if (!req.params || !req.params.institution_id || !idIsValid(req.params.institution_id)) {
        return res.status(400).json({Error: + ID_ERROR});
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
                res.status(404).json({Error: + NOT_FOUND});
                return;
            }
            console.log("returning institution: " + JSON.stringify(institution))
            res.json(institution);
        });
    } catch(err) { 
        res.status(400).json({Error: + err});
    }
});

router.delete('/:institution_id', function (req, res) {
    if (!req.params || !req.params.institution_id || !idIsValid(req.params.institution_id)) {
        return res.status(400).json({Error: ID_ERROR});
    }

    // Institution.findByIdAndDelete(req.params.institution_id, function (err) {
    //     if(err) {
    //         console.log(err);
    //         res.status(404).json({Error: + err});
    //     }
    //     console.log("Successfully deleted " + req.params.institution_id);
    //     res.status(204);
    // });
    var id = req.params.institution_id;

    console.log("trying to delete institution by id: " + id)

    try {
        Institution.findByIdAndDelete(id)
        .exec( (err, institution) => {
            if(err) {
                res.status(404).json({Error: + NOT_FOUND});
                return;
            }
            if (!institution) {
                res.status(404).json({Error: + NOT_FOUND});
                return;
            }
            console.log("deleting institution: " + JSON.stringify(institution))
            res.status(204).json(institution);
        });
    } catch(err) { 
        res.status(400).json({Error: + err});
    }
});

module.exports = router;
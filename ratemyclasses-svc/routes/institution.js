const router = require('express').Router();
const verifyToken = require('../helpers/helpers.js').verifyToken

var Institution = require('../models/institution.model');

const isValid = require('../helpers/helpers.js').idIsValid;
const constants = require('../helpers/constants.js');

function paginate(req,res) {
    console.log('in paginate')
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

            Institution.find()
                .limit(constants.QUERY_LIMIT)
                .skip(page * constants.QUERY_LIMIT)
                .sort({
                    averageRating: 'desc',
                    name: 'asc'
                })
                .then(institutions => {
                    var results = {};
                    if (((page + 1) * constants.QUERY_LIMIT) < institutionCount) {
                        nextPage = page + 1
                        results.next = req.protocol + "://" + req.get("host") + req.baseUrl + "?page=" + nextPage;
                    }
                    results.pages = Math.ceil(institutionCount / constants.QUERY_LIMIT)
                    results.institutions = institutions;
                    console.log("Returning results " + (page * constants.QUERY_LIMIT) + " to " + (page * constants.QUERY_LIMIT + constants.QUERY_LIMIT) + " of " + institutionCount + " institutions");
                    res.json(results);
                })
                .catch(err => res.status(400).json({'Error': err}));
            }
        });
}

function filterResults(req,res) {
    filter = req.query.filter;
    if (filter.length < constants.MIN_FILTER) {
       return res.status(400).json({'Error': constants.FILTER_ERROR})
    }

    page = 0
    if(Object.keys(req.query).includes("page")){
        page = parseInt(req.query.page)
    }

    institutionCount = 0
    Institution.countDocuments({ "name": { "$regex": filter, "$options": "i" } }, function(err, result) {
        if (err) {
          console.log(err);
        } else {
            institutionCount = parseInt(result)
            console.log("Found " + result + " institutions");

            Institution.find({ "name": { "$regex": filter, "$options": "i" } })
                .sort({
                    name: 'asc'
                })
                .limit(constants.QUERY_LIMIT)
                .skip(page * constants.QUERY_LIMIT)
                .then(institutions => {
                    var results = {};
                    if (((page + 1) * constants.QUERY_LIMIT) < institutionCount) {
                        nextPage = page + 1
                        results.next = req.protocol + "://" + req.get("host") + req.baseUrl + "?page=" + nextPage;
                    }
                    results.pages = Math.ceil(institutionCount / constants.QUERY_LIMIT)
                    results.institutions = institutions;
                    console.log("Returning results " + (page * constants.QUERY_LIMIT) + " to " + (page * constants.QUERY_LIMIT + constants.QUERY_LIMIT) + " of " + institutionCount + " institutions");
                    res.json(results);
                })
                .catch(err => res.status(400).json({'Error': err}));
            }
        });
    // Institution.find({ "name": { "$regex": filter, "$options": "i" } })
    // .sort({
    //     name: 'asc'
    // })
    // .then(institutions => res.json(institutions))
    // .catch(err => res.status(400).json({'Error': err}));
}


// GET Institutions
router.route('/').get((req,res) => {
    if (req.query.filter == undefined) {
        paginate(req,res)
    } else {
        filterResults(req,res)
    }
});

// POST Institution
router.post('/', (req, res) => {

    const authorization = req.get('Authorization','');
    if (!authorization) {
        return res.status(401).json({Error: constants.NO_TOKEN});
    } else {
        const tokenArray = authorization.split(" ");
        if (tokenArray.length < 2 || tokenArray[0] != "Bearer" || verifyToken(tokenArray[1]) != process.env.MANAGEMENT_EMAIL ) {
            return res.status(401).json({Error: constants.BAD_TOKEN});
        } 
    }

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
        console.log('saved new institution: ')
        console.log(JSON.stringify(newInstitution));
    }) 
    .catch(err => { 
        res.status(400).json({'Error': err});
    });
});


// PATCH an Institution
router.patch('/:institution_id', (req, res) => {
    var updatedInstitution = req.body;
    console.log(updatedInstitution);
    var id = req.params.institution_id;

    const authorization = req.get('Authorization','');
    if (!authorization) {
        return res.status(401).json({Error: constants.NO_TOKEN});
    } else {
        const tokenArray = authorization.split(" ");
        if (tokenArray.length < 2 || tokenArray[0] != "Bearer" || verifyToken(tokenArray[1]) != process.env.MANAGEMENT_EMAIL ) {
            return res.status(401).json({Error: constants.BAD_TOKEN});
        } 
    }
    Institution.findByIdAndUpdate(id, req.body, {new: true}, (err, institution) => {
        if (err) {
            return res.status(500).send(err);
        } else {
            return res.send(institution)
        }
    })
})

// GET single institution
router.route('/:institution_id').get((req,res) => {
    if (!req.params || !req.params.institution_id || !isValid(req.params.institution_id)) {
        return res.status(400).json({Error: + constants.ID_ERROR});
    }

    const id = req.params.institution_id;

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
            console.log("returning institution: " + JSON.stringify(institution))
            res.json(institution);
        });
    } catch(err) { 
        res.status(400).json({'Error': err});
    }
});


// DELETE single institution
router.delete('/:institution_id', function (req, res) {
    if (!req.params || !req.params.institution_id || !isValid(req.params.institution_id)) {
        return res.status(400).json({Error: constants.ID_ERROR});
    }

    const authorization = req.get('Authorization','');
    if (!authorization) {
        return res.status(401).json({Error: constants.NO_TOKEN});
    } 
    // else {
    //     const tokenArray = authorization.split(" ");
    //     if (tokenArray.length < 2 || tokenArray[0] != "Bearer" || verifyToken(tokenArray[1]) != process.env.MANAGEMENT_EMAIL ) {
    //         return res.status(401).json({Error: constants.BAD_TOKEN});
    //     } 
    // }
    
    var id = req.params.institution_id;

    console.log("trying to delete institution by id: " + id)

    try {
        Institution.findByIdAndDelete(id)
        .exec( (err, institution) => {
            if(err) {
                res.status(400).json({'Error':  constants.UNKNOWN});
                return;
            }
            if (!institution) {
                res.status(404).json({'Error':  constants.NOT_FOUND});
                return;
            }
            console.log("deleting institution: " + JSON.stringify(institution))
            res.status(204).json(institution);
        });
    } catch(err) { 
        res.status(400).json({'Error': err});
    }
});

module.exports = router;
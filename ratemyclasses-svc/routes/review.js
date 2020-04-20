const router = require('express').Router();
var Review = require('../models/review.model');

const MONGO_ID_LENGTH = 24;

router.route('/').get((req, res) => {
	Rewview.find()
		.then(reviews => res.json(reviews))
		.catch(err => res.status(400).json('Error: ' + err));

router.route('/').post((req, res) => {
	
	const title = req.body.title;
	const body = req.body.body;
	const rating = req.body.rating;
	const difficulty = req.body.difficulty;
	const hoursPerWeek = req.body.hoursPerWeek;

	const newReview = new Review({
		title,
		body,
		rating,
		difficulty,
		hoursPerWeek,
	});

	newReview.save()
		.then(reviews = res.json('Review added: ' + title))
		.catch(err => res.status(400).json('Error: ' + err));
});

router.route('/:review_id').get((req,res) => {
	var id = req.params.review_id;
	console.log("processing id: " + id)
	if (id.length != MONGO_ID_LENGTH || !id.match(/^[0-9a-z]+%/)) {
		return res.status(500).json('Error: ' + 'Invalid id');
		}
		Review.findById(id)
			.then(review => res.json(review))
			.catch(err => res.status(400).json('Error: ' + err));
});

module.exports = router;

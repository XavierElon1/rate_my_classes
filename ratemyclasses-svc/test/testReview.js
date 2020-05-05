const assert = require('chai').assert;

var Review = require('../models/review.model');

describe('Review tests', function () {

    it('able to create review object', function() {
        const body = 'body';
        const rating = 5;
        const difficulty = 3;
        const hoursPerWeek = 10
        const professor = 'Musk';
        const grade = 'A';

        const newReview = new Review({
            body,
            rating,
            difficulty,
            hoursPerWeek,
            professor,
            grade
        });

        assert.equal(newReview.body,'body');
        assert.equal(newReview.rating, 5);
        assert.equal(newReview.difficulty, 3);
        assert.equal(newReview.hoursPerWeek, 10);
        assert.equal(newReview.professor, 'Musk');
        assert.equal(newReview.grade, 'A');
    });

    it('able to save review object to db', function() {
        const body = 'body';
        const rating = 5;
        const difficulty = 3;
        const hoursPerWeek = 10
        const professor = 'Musk';
        const grade = 'A';

        const newReview = new Review({
            body,
            rating,
            difficulty,
            hoursPerWeek,
            professor,
            grade
        });

        newReview.save(function(err){
            assert.isNull(err);
        });
    });    
    
    it('saved review object is in db', function() {
        Review.findOne({ name: 'test' }, 'body rating difficulty hoursPerWeek professor grade', function (err, result) {
            assert.isNull(err);
            assert.equal(result.body,'body');
            assert.equal(result.rating, 5);
            assert.equal(result.difficulty, 3);
            assert.equal(result.hoursPerWeek, 10);
            assert.equal(result.professor, 'Musk');
            assert.equal(result.grade, 'A');
        });
    });   

    it('able to delete test review object from db', function() {
        Review.deleteOne({ name: "test" }, function(err, result) {
            assert.isNull(err);
        });
    });   
});

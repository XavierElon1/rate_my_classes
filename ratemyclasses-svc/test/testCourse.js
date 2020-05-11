const assert = require('chai').assert;

var Course = require('../models/course.model');


describe('Course tests', function () {

    it('able to create course object', function() {
        const title = 'test';
        const courseID = 'TEST-101';
        const averageRating = 0.0
        const averageDifficulty = 0.0
        const averageHoursPerWeek = 0.0

        const newCourse = new Course({
            title,
            courseID,
            averageRating,
            averageDifficulty,
            averageHoursPerWeek,
        });

        assert.equal(newCourse.title,'test');
        assert.equal(newCourse.courseID,'TEST-101');
        assert.equal(newCourse.averageDifficulty, 0.0);
        assert.equal(newCourse.averageHoursPerWeek, 0.0);
        assert.equal(newCourse.averageRating, 0.0);
        assert.equal(newCourse.reviews.length, 0);
    });

    it('able to save course object to db', function() {
        const title = 'test';
        const courseID = 'TEST-101';
        const averageRating = 0.0
        const averageDifficulty = 0.0
        const averageHoursPerWeek = 0.0

        const newCourse = new Course({
            title,
            courseID,
            averageRating,
            averageDifficulty,
            averageHoursPerWeek,
        });

        newCourse.save(function(err){
            assert.isNull(err);
        });
    });    
    
    it('saved course object is in db', function() {
        Course.findOne({ name: 'test' }, 'title courseID body', function (err, result) {
            assert.isNull(err);
            assert.equal(result.title,'test');
            assert.equal(result.courseID,'http://test.edu');
        });
    });   

    it('able to delete test course object from db', function() {
        Course.deleteOne({ name: "test" }, function(err, result) {
            assert.isNull(err);
        });
    });   
});
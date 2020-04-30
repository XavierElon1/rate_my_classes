const assert = require('chai').assert;

var Course = require('../models/course.model');


describe('Course tests', function () {

    it('able to create course object', function() {
        const title = 'test';
        const courseID = 'TEST-101';
        const body = 'This is the worst test ever';
        const averageRating = 0.0
        const averageDifficulty = 0.0
        const averageHoursPerWeek = 0.0

        const newCourse = new Course({
            title,
            courseID,
            body,
            averageRating,
            averageDifficulty,
            averageHoursPerWeek,
        });

        assert.equal(newCourse.title,'test');
        assert.equal(newCourse.courseID,'TEST-101');
        assert.equal(newCourse.body,'This is the worst test ever');
        assert.equal(newCourse.courses.length, 0.0);
        assert.equal(newCourse.averageRating, 0.0);
        assert.equal(newCourse.courses.length, 0.0);
    });

    it('able to save course object to db', function() {
        const title = 'test';
        const courseID = 'TEST-101';
        const body = 'This is the worst test ever';
        const averageRating = 0.0
        const averageDifficulty = 0.0
        const averageHoursPerWeek = 0.0

        const newCourse = new Course({
            title,
            courseID,
            body,
            averageRating,
            averageDifficulty,
            averageHoursPerWeek,
        });

        newCourse.save(function(err){
            assert.isNull(err);
        });
    });    
    
    it('saved course object is in db', function() {
        Institution.findOne({ name: 'test' }, 'title courseID body', function (err, result) {
            assert.isNull(err);
            assert.equal(result.title,'test');
            assert.equal(result.courseID,'http://test.edu');
            assert.equal(newInstitution.body,'This is the worst test ever');
        });
    });   

    it('able to delete test object from db', function() {
        Institution.deleteOne({ name: "test" }, function(err, result) {
            assert.isNull(err);
        });
    });   
});
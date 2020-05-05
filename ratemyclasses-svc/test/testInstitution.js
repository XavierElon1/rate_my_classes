const assert = require('chai').assert;

var Institution = require('../models/institution.model');


describe('Institution tests', function () {

    it('able to create institution object', function() {
        const name = 'test';
        const website = 'http://test.edu';
        const averageRating = 1.1;
        const courses = [];
        
        const newInstitution = new Institution({
            name,
            website,
            averageRating,
            courses,
        });

        assert.equal(newInstitution.name,'test');
        assert.equal(newInstitution.website,'http://test.edu');
        assert.equal(newInstitution.averageRating,1.1);
        assert.equal(newInstitution.courses.length, 0);
    });

    it('able to save institution object to db', function() {
        const name = 'test';
        const website = 'http://test.edu';
        const averageRating = 1.1;
        const courses = [];
        
        const newInstitution = new Institution({
            name,
            website,
            averageRating,
            courses,
        });

        newInstitution.save(function(err){
            assert.isNull(err);
        });
    });    
    
    it('saved institution object is in db', function() {
        Institution.findOne({ name: 'test' }, 'name website averageRating', function (err, result) {
            assert.isNull(err);
            assert.equal(result.name,'test');
            assert.equal(result.website,'http://test.edu');
            assert.equal(newInstitution.averageRating,1.1);
            assert.equal(newInstitution.length, 0);            

        });
    });   

    it('able to delete test institution object from db', function() {
        Institution.deleteOne({ name: "test" }, function(err, result) {
            assert.isNull(err);
        });
    });   
});
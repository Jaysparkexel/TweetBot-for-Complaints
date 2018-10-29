var MongoClient = require('mongodb').MongoClient
    , assert = require('assert');

var mongoUrl = 'mongodb://localhost:27017/tweeterDB';

module.exports = function (userId, _callback) {
    MongoClient.connect(mongoUrl, function (err, db) {
        assert.equal(null, err);
        var scol = db.collection('stweet');
        scol.remove({'user.id_str': userId}, function (err, r) {
            if(err){
                console.log("Error deleting tweet");
                console.log(err)
            } else {
                console.log("Deleted Tweet Successfully")
            }
            db.close()
            _callback(true)
        })
    })
}
var MongoClient = require('mongodb').MongoClient
    , assert = require('assert');

var mongoUrl = 'mongodb://localhost:27017/Conversation';


module.exports = function (userId) {

    MongoClient.connect(mongoUrl, function (err, db) {
        assert.equal(null, err);

        db.dropCollection(userId, function (err, res) {
            if(err){
                console.log("Error deleting conversation")
                console.log(err)
            } else {
                console.log("Conversation Deleted Successfully")
            }
            db.close()
        })


    })
}
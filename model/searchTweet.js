var MongoClient = require('mongodb').MongoClient
    , assert = require('assert');

var mongoUrl = 'mongodb://localhost:27017/tweeterDB';

module.exports = function (searchQuery, io) {
    MongoClient.connect(mongoUrl, function(err, db) {
        assert.equal(null, err);

        var scol = db.collection('stweet')

        scol.find({ "user.name" : {  $regex: new RegExp(searchQuery, 'i')  } }).toArray(function (err, db) {
            if(err){
                console.log(err)
            } else {
                if(db.length == 0){
                    console.log("result not found")
                    io.emit('resultNotFound', db)
                } else {
                    console.log("found result")
                    io.emit('searchRes', db)
                }

            }
        })
    })
}

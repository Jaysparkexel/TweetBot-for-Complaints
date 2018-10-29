var MongoClient = require('mongodb').MongoClient
    , assert = require('assert');

var mongoUrl = 'mongodb://localhost:27017/tweeterDB';

module.exports = function (io) {
    MongoClient.connect(mongoUrl, function(err, db) {
        var col = db.collection('stweet')
        var cursor = col.find({}).sort({"_id": 1})

        if(err){
            console.log("Error fetching tweet: "+ err)
        }
        else {
            cursor.each(function (err, item) {
                if(item == null){
                    db.close()
                } else {
                    io.emit('tweet', item)
                }
            })
        }
        db.close()
    })

}

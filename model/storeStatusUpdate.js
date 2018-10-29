var MongoClient = require('mongodb').MongoClient
    , assert = require('assert');

var mongoUrl = 'mongodb://localhost:27017/tweeterDB';

module.exports = function (event, userId, io) {
    MongoClient.connect(mongoUrl, function(err, db) {
        assert.equal(null, err);
        console.log("Connected correctly to MongoDB Tweet server");

        var col = db.collection('tweet');
        col.insertOne(event, function(err, r) {
            assert.equal(null, err);
            assert.equal(1, r.insertedCount);
            console.log("inserted succesfully")
            // Finish up test
            // db.close();
        });

        var scol = db.collection('stweet')

        scol.findAndModify({"user.id_str": userId}, {}, {
            $set: {
                "id": event['id'],
                "id_str": event['id_str'],
                "type": "tweet",
                "text": event['text'],
                "created_at": event['created_at']
            }
        }, {}, 
        function (err, object) {
            if (err){
                console.log("err saving new tweet")
                console.log(err);
            }else{
                console.log("inserted new tweet successfully for existing user")
                scol.find({"user.id_str": userId}).limit(1).toArray(function (err, doc) {
                    io.emit('tweetNew', doc[0])
                })

            }
        })


    });

}
